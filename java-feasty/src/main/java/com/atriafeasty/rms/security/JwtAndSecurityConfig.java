package com.atriafeasty.rms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.Date;

@Configuration
@EnableWebSecurity
public class JwtAndSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // JWT PROVIDER COMPONENT
    // =========================================================
    public static class JwtTokenProvider {
        @Value("${app.jwt.secret}")
        private String jwtSecret;

        @Value("${app.jwt.expiration-ms}")
        private long jwtExpirationInMs;

        public String generateToken(String username, String role) {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
            Key key = Keys.hmrShaKeyFor(jwtSecret.getBytes());

            return Jwts.builder()
                    .setSubject(username)
                    .claim("role", "ROLE_" + role)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(key, SignatureAlgorithm.HS256)
                    .compact();
        }

        public String getUsernameFromJwt(String token) {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        }

        public boolean validateToken(String token) {
            try {
                Jwts.parserBuilder()
                    .setSigningKey(jwtSecret.getBytes())
                    .build()
                    .parseClaimsJws(token);
                return true;
            } catch (JwtException | IllegalArgumentException ex) {
                return false;
            }
        }
    }

    // =========================================================
    // JWT FILTER FOR REQUEST VALIDATION
    // =========================================================
    public static class JwtAuthenticationFilter extends OncePerRequestFilter {
        private final JwtTokenProvider tokenProvider;

        public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
            this.tokenProvider = tokenProvider;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            try {
                String jwt = getJwtFromRequest(request);

                if (jwt != null && tokenProvider.validateToken(jwt)) {
                    String username = tokenProvider.getUsernameFromJwt(jwt);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            username, null, java.util.Collections.emptyList()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ex) {
                logger.error("Could not set user authentication in security context", ex);
            }

            filterChain.doFilter(request, response);
        }

        private String getJwtFromRequest(HttpServletRequest request) {
            String bearerToken = request.getHeader("Authorization");
            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                return bearerToken.substring(7);
            }
            return null;
        }
    }

    // =========================================================
    // SPRING SECURITY FILTER CHAIN CONFIGURATION
    // =========================================================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider tokenProvider) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/menu/**").permitAll()
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "OWNER")
                .requestMatchers("/api/owner/**").hasRole("OWNER")
                .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN", "OWNER")
                .anyRequest().authenticated()
            );

        // Add our custom JWT security filter
        http.addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

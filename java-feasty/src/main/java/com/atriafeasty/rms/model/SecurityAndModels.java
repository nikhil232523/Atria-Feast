package com.atriafeasty.rms.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

public class SecurityAndModels {

    public enum RoleName {
        OWNER,
        ADMIN,
        STAFF,
        CUSTOMER
    }

    public enum OrderStatus {
        PENDING,
        ACCEPTED,
        PREPARING,
        READY,
        SERVED,
        DELIVERED,
        CANCELLED
    }

    public enum TableStatus {
        AVAILABLE,
        RESERVED,
        OCCUPIED
    }

    public enum BuffetType {
        VEG,
        PREMIUM,
        FAMILY
    }

    @Entity
    @Table(name = "roles")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Role {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Enumerated(EnumType.STRING)
        @Column(unique = true, nullable = false, length = 50)
        private RoleName name;
    }

    @Entity
    @Table(name = "users")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 150)
        private String fullName;

        @Column(unique = true, nullable = false, length = 100)
        private String email;

        @Column(nullable = false, length = 20)
        private String phone;

        @Column(columnDefinition = "TEXT")
        private String address;

        @Column(unique = true, nullable = false, length = 100)
        private String username;

        @Column(nullable = false)
        private String passwordHash;

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "role_id", nullable = false)
        private Role role;

        @Column(nullable = false)
        private boolean isApproved = false; // Staff/Admin need owner approval

        @Column(nullable = false)
        private int ordersCount = 0;

        @Column(nullable = false, length = 50)
        private String membershipLevel = "NONE"; // SILVER, GOLD, PLATINUM
    }

    @Entity
    @Table(name = "food_categories")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FoodCategory {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true, nullable = false, length = 100)
        private String name;

        @Column(columnDefinition = "TEXT")
        private String description;
    }

    @Entity
    @Table(name = "foods")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FoodItem {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 150)
        private String name;

        @ManyToOne
        @JoinColumn(name = "category_id", nullable = false)
        private FoodCategory category;

        @Column(columnDefinition = "TEXT")
        private String description;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal price;

        private String imagePath;

        private BigDecimal rating = BigDecimal.valueOf(4.0);

        private boolean isAvailable = true;

        private int preparationTimeMins = 15;
    }

    @Entity
    @Table(name = "orders")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Order {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal subtotal;

        @Column(precision = 10, scale = 2)
        private BigDecimal discount = BigDecimal.ZERO;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal tax;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal total;

        private String couponCode;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private OrderStatus status;

        @Column(nullable = false)
        private String paymentMethod; // UPI, GOOGLE_PAY, PhonePe, Paytm, etc.

        @Column(nullable = false)
        private String paymentStatus; // PAID, UNPAID

        private LocalDateTime timestamp = LocalDateTime.now();

        @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<OrderItem> items;
    }

    @Entity
    @Table(name = "order_items")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItem {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "order_id", nullable = false)
        private Order order;

        @ManyToOne
        @JoinColumn(name = "food_id", nullable = false)
        private FoodItem foodItem;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal price;

        @Column(nullable = false)
        private int quantity;
    }

    @Entity
    @Table(name = "restaurant_tables")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RestaurantTable {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true, nullable = false)
        private int tableNumber;

        @Column(nullable = false)
        private int capacity;

        @Enumerated(EnumType.STRING)
        private TableStatus status = TableStatus.AVAILABLE;
    }

    @Entity
    @Table(name = "table_bookings")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TableBooking {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @ManyToOne
        @JoinColumn(name = "table_id", nullable = false)
        private RestaurantTable table;

        @Column(nullable = false)
        private LocalDate bookingDate;

        @Column(nullable = false)
        private LocalTime bookingTime;

        @Column(nullable = false)
        private int guestCount;

        @Column(nullable = false)
        private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED
    }

    @Entity
    @Table(name = "buffet_bookings")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BuffetBooking {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private BuffetType buffetType;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal price;

        @Column(nullable = false)
        private int seatsCount;

        @Column(nullable = false)
        private LocalDate bookingDate;

        @Column(nullable = false)
        private String timeSlot; // e.g. "12:00 PM - 03:00 PM"

        @Column(nullable = false)
        private String status = "PENDING";
    }

    @Entity
    @Table(name = "inventory")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InventoryItem {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, length = 150)
        private String ingredient;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal stockQuantity;

        @Column(nullable = false, length = 20)
        private String unit;

        @Column(nullable = false, precision = 10, scale = 2)
        private BigDecimal consumptionRate;

        @Column(nullable = false)
        private LocalDate expiryDate;
    }
}

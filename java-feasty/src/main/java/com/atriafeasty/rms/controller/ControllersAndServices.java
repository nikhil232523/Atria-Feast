package com.atriafeasty.rms.controller;

import com.atriafeasty.rms.model.SecurityAndModels.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public class ControllersAndServices {

    // =========================================================
    // REPOSITORIES
    // =========================================================

    @Repository
    public interface UserRepository extends JpaRepository<User, Long> {
        Optional<User> findByUsername(String username);
        Optional<User> findByEmail(String email);
        List<User> findByIsApprovedFalse();
    }

    @Repository
    public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
        List<FoodItem> findByCategory_Name(String categoryName);
    }

    @Repository
    public interface OrderRepository extends JpaRepository<Order, Long> {
        List<Order> findByUser_Username(String username);
        
        // Custom revenue analytics queries
        @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = 'DELIVERED'")
        BigDecimal calculateTotalRevenue();
    }

    @Repository
    public interface TableBookingRepository extends JpaRepository<TableBooking, Long> {
        List<TableBooking> findByBookingDate(LocalDate date);
        
        // Double booking check: checks if there is already a table reservation for specific table at that date/time
        @Query("SELECT COUNT(tb) FROM TableBooking tb WHERE tb.table.id = :tableId AND " +
               "tb.bookingDate = :date AND tb.status = 'CONFIRMED'")
        long countOverlapBookings(Long tableId, LocalDate date);
    }

    @Repository
    public interface BuffetBookingRepository extends JpaRepository<BuffetBooking, Long> {}

    @Repository
    public interface InventoryRepository extends JpaRepository<InventoryItem, Long> {
        @Query("SELECT i FROM InventoryItem i WHERE i.stockQuantity < i.consumptionRate * 3")
        List<InventoryItem> findLowStockIngredients();
    }

    // =========================================================
    // SERVICES
    // =========================================================

    @Service
    public static class OrderService {
        @Autowired
        private OrderRepository orderRepository;
        @Autowired
        private UserRepository userRepository;

        public Order createOrder(Order order) {
            // Write core ordering logic
            Order savedOrder = orderRepository.save(order);
            
            // Check & upgrade user loyalties
            User user = order.getUser();
            user.setOrdersCount(user.getOrdersCount() + 1);
            
            int count = user.getOrdersCount();
            if (count >= 30) {
              user.setMembershipLevel("PLATINUM");
            } else if (count >= 15) {
              user.setMembershipLevel("GOLD");
            } else if (count >= 5) {
              user.setMembershipLevel("SILVER");
            }
            
            userRepository.save(user);
            return savedOrder;
        }
    }

    @Service
    public static class BookingService {
        @Autowired
        private TableBookingRepository tableBookingRepository;

        public boolean bookTable(TableBooking booking) {
            long matches = tableBookingRepository.countOverlapBookings(
                booking.getTable().getId(), 
                booking.getBookingDate()
            );
            if (matches > 0) {
                return false; // Prevent double booking on same table & date
            }
            booking.setStatus("CONFIRMED");
            tableBookingRepository.save(booking);
            return true;
        }
    }

    // =========================================================
    // CONTROLLERS
    // =========================================================

    @RestController
    @RequestMapping("/api/orders")
    @CrossOrigin(origins = "*")
    public static class OrderController {
        @Autowired
        private OrderService orderService;
        @Autowired
        private OrderRepository orderRepository;

        @PostMapping("/place")
        public ResponseEntity<?> placeOrder(@RequestBody Order order) {
            try {
                Order placed = orderService.createOrder(order);
                return ResponseEntity.ok(placed);
            } catch(Exception e) {
                return ResponseEntity.badRequest().body("Error placing order: " + e.getMessage());
            }
        }

        @GetMapping("/history/{username}")
        public ResponseEntity<List<Order>> getHistory(@PathVariable String username) {
            return ResponseEntity.ok(orderRepository.findByUser_Username(username));
        }

        @PutMapping("/status/{id}")
        public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
            Optional<Order> orderOpt = orderRepository.findById(id);
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
                orderRepository.save(order);
                return ResponseEntity.ok().body("Order status successfully updated to " + status);
            }
            return ResponseEntity.notFound().build();
        }
    }

    @RestController
    @RequestMapping("/api/tables")
    @CrossOrigin(origins = "*")
    public static class ReservationController {
        @Autowired
        private BookingService bookingService;

        @PostMapping("/book")
        public ResponseEntity<String> reserveTable(@RequestBody TableBooking booking) {
            boolean success = bookingService.bookTable(booking);
            if (success) {
                return ResponseEntity.ok("Table successfully reserved and double-booking protections verified.");
            } else {
                return ResponseEntity.badRequest().body("Table is already reserved for this date. Double booking prevented.");
            }
        }
    }
}

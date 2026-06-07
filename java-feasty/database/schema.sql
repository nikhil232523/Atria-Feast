-- =========================================================
-- DATABASE SCHEMA: Atria Feasty Restaurant Management System
-- Dialect: MySQL 8.0+
-- Prepared for Restaurant Owners: Shrishti, Krish, and Nikhil
-- =========================================================

CREATE DATABASE IF NOT EXISTS atria_feasty_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atria_feasty_db;

-- Disable foreign key checks while structuring
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables under deep update (clean slate execution)
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS buffet_bookings;
DROP TABLE IF EXISTS table_bookings;
DROP TABLE IF EXISTS restaurant_tables;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS food_categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. ROLES TABLE
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 2. USERS TABLE
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT UNSIGNED NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE, -- Approved by Owner (Staff/Admin)
    orders_count INT UNSIGNED DEFAULT 0,
    membership_level VARCHAR(50) DEFAULT 'Bronze', -- Bronze, Silver, Gold, Platinum
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. FOOD CATEGORIES TABLE
CREATE TABLE food_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL,
    image_path VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 4. FOODS TABLE
CREATE TABLE foods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_path VARCHAR(255) NULL,
    rating DECIMAL(3,2) DEFAULT 4.5,
    is_available BOOLEAN DEFAULT TRUE,
    preparation_time VARCHAR(50) DEFAULT '15 mins',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. COUPONS TABLE
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL,
    discount_percentage INT NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. ORDERS TABLE
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY, -- String IDs like 'INV-748291'
    user_id BIGINT UNSIGNED NULL, -- Can be NULL for guest checkout or unlinked users
    username VARCHAR(100) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    coupon_code_used VARCHAR(50) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Accepted, Preparing, Ready, Served, Delivered, Cancelled
    payment_method VARCHAR(50) NOT NULL, -- UPI, Google Pay, PhonePe, Paytm, Credit Card, Debit Card, Cash
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- Paid, Unpaid
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_code_used) REFERENCES coupons(code) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    food_id BIGINT UNSIGNED NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. PAYMENTS TABLE (Explicitly requested separate table)
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- Paid, Unpaid, Refunded, Failed
    transaction_id VARCHAR(100) UNIQUE NULL,
    amount DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. RESTAURANT TABLES
CREATE TABLE restaurant_tables (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    status VARCHAR(50) DEFAULT 'Available' -- Available, Reserved, Occupied
) ENGINE=InnoDB;

-- 10. TABLE BOOKINGS
CREATE TABLE table_bookings (
    id VARCHAR(50) PRIMARY KEY, -- String IDs like 'RES-8930'
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests INT NOT NULL CHECK (guests > 0),
    table_number INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_number) REFERENCES restaurant_tables(table_number) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 11. BUFFET BOOKINGS
CREATE TABLE buffet_bookings (
    id VARCHAR(50) PRIMARY KEY, -- String IDs like 'BUFA-1205'
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    buffet_type VARCHAR(50) NOT NULL, -- Veg, Premium, Family
    price DECIMAL(10,2) NOT NULL,
    seats_count INT NOT NULL CHECK (seats_count > 0),
    booking_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL, -- e.g., '12:00 PM - 03:00 PM (Royal Lunch)'
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 12. CUSTOMER REVIEWS
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    food_name VARCHAR(150) NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    image_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. INVENTORY TRACKING
CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ingredient VARCHAR(150) NOT NULL,
    stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(20) NOT NULL, -- kg, litres, grams, units
    consumption_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Daily average usage
    expiry_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 15. REPORTS & METRICS LOGS
CREATE TABLE reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- SALES_DAILY, SALES_WEEKLY, SALES_MONTHLY, INVENTORY, CUSTOMERS
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- =========================================================
-- OPTIMIZING INDEXES FOR FASTER RETRIEVAL (DML / DQL)
-- =========================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_foods_category ON foods(category_id);
CREATE INDEX idx_foods_available ON foods(is_available);
CREATE INDEX idx_orders_username ON orders(username);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_timestamp ON orders(timestamp);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_table_bookings_date ON table_bookings(booking_date);
CREATE INDEX idx_buffet_bookings_date ON buffet_bookings(booking_date);
CREATE INDEX idx_inventory_expiry ON inventory(expiry_date);
CREATE INDEX idx_notifications_unread ON notifications(is_read);


-- =========================================================
-- COMPLETE SEED DATA PACK
-- =========================================================

-- 1. Roles Seed
INSERT INTO roles (id, name, description) VALUES 
(1, 'OWNER', 'Full administrative control over restaurant operations and configurations'),
(2, 'ADMIN', 'Supervises transactions, tables, menus, and staff approvals'),
(3, 'STAFF', 'Manages live order workflows, kitchen status, and bookings'),
(4, 'CUSTOMER', 'Guest checkout or self-registered loyalty customer')
ON DUPLICATE KEY UPDATE name=name;

-- 2. Users Seed (Matched with owners and staff)
-- Passwords encrypted via standard BCrypt
INSERT INTO users (id, full_name, email, phone, address, username, password_hash, role_id, is_approved, orders_count, membership_level) VALUES 
(1, 'Shrishti', 'shrishti@atriafeasty.com', '+91 99999 88811', 'Hebbal, Bengaluru', 'shrishti_owner', '$2a$10$WnbeYlEepX20M6zGq991kuzGstQkexO6K2jT8n.y/gAtXGqCj1Bki', 1, TRUE, 42, 'Platinum'),
(2, 'Krish', 'krish@atriafeasty.com', '+91 99999 88822', 'Hebbal, Bengaluru', 'krish_owner', '$2a$10$89yFvP8g196wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 1, TRUE, 42, 'Platinum'),
(3, 'Nikhil', 'nikhil@atriafeasty.com', '+91 99999 88833', 'Hebbal, Bengaluru', 'nikhil_owner', '$2a$10$22n9vB8p207wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 1, TRUE, 42, 'Platinum'),
(4, 'Rahul Chef', 'rahul@atriafeasty.com', '+91 88888 77766', 'RT Nagar, Bangalore', 'rahul_staff', '$2a$10$89yFvP8g196wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 3, TRUE, 0, 'Bronze'),
(5, 'Pooja Waitress', 'pooja@atriafeasty.com', '+91 88888 77755', 'Yeshwantpur, Bangalore', 'pooja_staff', '$2a$10$89yFvP8g196wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 3, FALSE, 0, 'Bronze'),
(6, 'Shanti Admin', 'shanti@atriafeasty.com', '+91 88888 77744', 'Sanjay Nagar, Bangalore', 'shanti_admin', '$2a$10$89yFvP8g196wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 2, FALSE, 0, 'Bronze')
ON DUPLICATE KEY UPDATE username=username;

-- 3. Food Categories Seed
INSERT INTO food_categories (id, name, description, image_path) VALUES
(1, 'Indian Foods', 'Traditional and aromatic Indian culinary delights', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d'),
(2, 'Indian Street Foods', 'Delectable chaats, rolls and mouthwatering bites from Indian lanes', 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78'),
(3, 'Italian Foods', 'Wood-fired pizzas and homemade pastas', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca'),
(4, 'Spanish Foods', 'Authentic Spanish tapas and Paellas', 'https://images.unsplash.com/photo-1512058564366-18510be2db19'),
(5, 'Arabian Foods', 'Middle-Eastern aromatic rice dishes and Shawarmas', 'https://images.unsplash.com/photo-1561651823-34feb02250e4'),
(6, 'Japanese Foods', 'Traditional Sushi, Ramen, and soups', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
(7, 'Chinese Foods', 'Indo-Chinese sizzling wok favorites', 'https://images.unsplash.com/photo-1585032226651-759b368d7246'),
(8, 'Desserts', 'Sweet traditional and continental desserts', 'https://images.unsplash.com/photo-1587314168485-3236d6710814'),
(9, 'Ice Creams', 'Scoops of chilled perfection', 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc'),
(10, 'Juices', 'Cold-pressed fresh fruit juices and mocktails', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87')
ON DUPLICATE KEY UPDATE name=name;

-- 4. Foods Seed
INSERT INTO foods (id, name, category_id, description, price, image_path, rating, is_available, preparation_time) VALUES
(1, 'Paneer Butter Masala', 1, 'Cubes of cottage cheese cooked in a rich, creamy, and mildly sweet tomato gravy with aromatic spices.', 280.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7', 4.8, TRUE, '15 mins'),
(2, 'Palak Paneer', 1, 'Fresh spinach greens pureed and simmered with soft paneer cubes, garlic, and traditional spices.', 260.00, 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4', 4.6, TRUE, '15 mins'),
(3, 'Dal Tadka', 1, 'Yellow lentils cooked to perfection, tempered with ghee, dry red chilies, garlic, and cumin.', 190.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d', 4.4, TRUE, '10 mins'),
(4, 'Chicken Biryani', 1, 'Slow-cooked aromatic basmati rice layered with juicy pieces of chicken, fried onions, mint, and saffron flavor.', 320.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8', 4.9, TRUE, '25 mins'),
(5, 'Naan / Butter Naan', 1, 'Soft and fluffy leavened flatbread freshly baked in tandoor (clay oven), slathered with pure butter.', 60.00, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78', 4.7, TRUE, '8 mins'),
(6, 'Pani Puri', 2, 'Crispy hollow puris filled with spicy potatoes and submersed in flavored tangy mint and sweet tamarind waters.', 80.00, 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78', 4.9, TRUE, '5 mins'),
(7, 'Pav Bhaji', 2, 'Thick, spicy mixed vegetable mesh simmered on a flat top, served piping hot with buttered soft bread buns.', 130.00, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027', 4.8, TRUE, '10 mins'),
(8, 'Margherita Pizza', 3, 'Simple and elegant artisan thin crust topped with classic tomato sauce, fresh buffalo mozzarella, and basil.', 320.00, 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca', 4.6, TRUE, '15 mins'),
(9, 'Chicken Shawarma', 5, 'Juicy spit-roasted chicken wrapped inside fluffy pita bread with pickled cucumbers and rich toum garlic paste.', 160.00, 'https://images.unsplash.com/photo-1561651823-34feb02250e4', 4.8, TRUE, '10 mins'),
(10, 'Shoyu Ramen Bowl', 6, 'Noodles in a savory soy-sauce infused steaming vegetable broth with spring onions, sweet corn, and soft egg halves.', 390.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', 4.8, TRUE, '18 mins'),
(11, 'Chocolate Lava Cake', 8, 'Indulgent baked chocolate mini cake filled with hot, luscious liquid chocolate center that oozes out upon touch.', 150.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c', 4.8, TRUE, '10 mins'),
(12, 'Fresh Mint Lemonade', 10, 'Crisp hand-squeezed lemon juice blended with refreshing fresh garden mint leaves and a hint of rock salt.', 80.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87', 4.5, TRUE, '5 mins')
ON DUPLICATE KEY UPDATE name=name;

-- 5. Coupons Seed
INSERT INTO coupons (code, description, discount_percentage, minimum_amount, is_active, expiry_date) VALUES 
('SILVER20', 'Loyalty Bronze/Silver reward coupon - 20% OFF', 20, 500.00, TRUE, '2026-12-31'),
('GOLD25', 'Loyalty Gold reward coupon - 25% OFF', 25, 1000.00, TRUE, '2026-12-31'),
('PLATINUM30', 'Loyalty Platinum reward coupon - 30% OFF', 30, 1500.00, TRUE, '2026-12-31'),
('WELCOME10', 'New comer introductory - 10% OFF', 10, 0.00, TRUE, '2027-01-01')
ON DUPLICATE KEY UPDATE code=code;

-- 6. Restaurant Tables Seed
INSERT INTO restaurant_tables (table_number, capacity, status) VALUES 
(1, 2, 'Available'),
(2, 2, 'Available'),
(3, 4, 'Occupied'),
(4, 4, 'Available'),
(5, 6, 'Available'),
(6, 6, 'Occupied'),
(7, 8, 'Available'),
(8, 12, 'Available')
ON DUPLICATE KEY UPDATE capacity=capacity;

-- 7. Table Bookings Seed
INSERT INTO table_bookings (id, customer_name, phone, booking_date, booking_time, guests, table_number, status) VALUES 
('RES-8930', 'Siddharth Patel', '+91 98888 12345', '2026-06-19', '20:00:00', 4, 3, 'Approved')
ON DUPLICATE KEY UPDATE id=id;

-- 8. Buffet Bookings Seed
INSERT INTO buffet_bookings (id, customer_name, phone, buffet_type, price, seats_count, booking_date, time_slot, status) VALUES 
('BUFA-1205', 'Megha Sharma', '+91 97777 24680', 'Premium', 3996.00, 4, '2026-06-20', '12:00 PM - 03:00 PM (Royal Lunch)', 'Approved')
ON DUPLICATE KEY UPDATE id=id;

-- 9. Sample Orders Seed
INSERT INTO orders (id, user_id, username, customer_name, subtotal, discount, tax, total, coupon_code_used, status, payment_method, payment_status, timestamp) VALUES 
('INV-748291', 1, 'shrishti_owner', 'Siddharth Patel', 800.00, 0.00, 144.00, 944.00, NULL, 'Delivered', 'Instant UPI (Scan)', 'Paid', '2026-06-06 12:15:00'),
('INV-183025', 2, 'krish_owner', 'Priya Krishnan', 470.00, 0.00, 85.00, 555.00, NULL, 'Preparing', 'Google Pay', 'Paid', '2026-06-06 13:45:00')
ON DUPLICATE KEY UPDATE id=id;

-- 10. Sample Order Items Seed
INSERT INTO order_items (order_id, food_id, food_name, price, quantity) VALUES 
('INV-748291', 1, 'Paneer Butter Masala', 280.00, 2),
('INV-748291', 5, 'Naan / Butter Naan', 60.00, 4),
('INV-183025', 8, 'Margherita Pizza', 320.00, 1),
('INV-183025', 11, 'Chocolate Lava Cake', 150.00, 1);

-- 11. Sample Payments Seed
INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, amount, timestamp) VALUES 
('INV-748291', 'Instant UPI (Scan)', 'Paid', 'TXN-982103829103', 944.00, '2026-06-06 12:16:00'),
('INV-183025', 'Google Pay', 'Paid', 'TXN-103829592038', 555.00, '2026-06-06 13:46:00');

-- 12. Pre-fill Reviews Seed
INSERT INTO reviews (customer_name, food_name, rating, comment, image_path) VALUES 
('Siddharth Patel', 'Paneer Butter Masala', 5, 'Outstanding Paneer Butter Masala! Soft paneer, perfectly sweet-creamy gravy. Absolutely recommended!', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7'),
('Priya Krishnan', 'Chocolate Lava Cake', 4, 'Loved the molten lava texture flowing out of the chocolate cake. Heaven in a plate.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c')
ON DUPLICATE KEY UPDATE rating=rating;

-- 13. Inventory Seed (Including warnings representation)
INSERT INTO inventory (id, ingredient, stock_quantity, unit, consumption_rate, expiry_date) VALUES 
(1, 'Amul Cheese Block', 4.50, 'kg', 3.00, '2026-07-20'),
(2, 'Aromatic Basmati Rice', 12.00, 'kg', 8.00, '2026-12-15'),
(3, 'Kashmiri Red saffron threads', 200.00, 'grams', 20.00, '2026-10-10'),
(4, 'Tandoori Paneer Block', 25.00, 'kg', 5.00, '2026-06-25'),
(5, 'Refined Olive Oil', 65.00, 'litres', 10.00, '2026-09-01')
ON DUPLICATE KEY UPDATE ingredient=ingredient;

-- 14. Sample Notifications Seed
INSERT INTO notifications (id, title, message, is_read) VALUES 
(1, 'New Booking Received', 'Table booking RES-8930 for Siddharth Patel has been pending approval.', FALSE),
(2, 'Inventory Warning', 'Stock of Basmati Rice is low based on the daily consumption average.', FALSE),
(3, 'System Live', 'Atria Feasty RMS integration is online and operational for all owners.', TRUE);

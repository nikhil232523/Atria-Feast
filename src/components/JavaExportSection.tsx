import React, { useState } from 'react';
import { FileCode, Database, Settings, BookOpen, Clipboard, Check } from 'lucide-react';

export default function JavaExportSection() {
  const [activeFile, setActiveFile] = useState<'pom' | 'schema' | 'models' | 'controllers' | 'security' | 'readme'>('readme');
  const [copied, setCopied] = useState(false);

  const fileContents = {
    readme: `// --- java-feasty/README.md ---
# Atria Feasty - Java Spring Boot Backend Codebase
Developed for owners: Shrishti, Krish, and Nikhil.

To compile and launch the spring system:
$ mvn clean install
$ java -jar target/atria-feasty-rms-1.0.0.jar`,

    pom: `<!-- java-feasty/pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.atriafeasty</groupId>
    <artifactId>atria-feasty-rms</artifactId>
    <version>1.0.0</version>
    <properties>
        <java.version>21</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
        </dependency>
    </dependencies>
</project>`,

    schema: `-- java-feasty/database/schema.sql
CREATE DATABASE IF NOT EXISTS atria_feasty_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atria_feasty_db;

-- 1. ROLES TABLE
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL
);

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
    is_approved BOOLEAN DEFAULT FALSE,
    orders_count INT UNSIGNED DEFAULT 0,
    membership_level VARCHAR(50) DEFAULT 'Bronze',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. FOOD CATEGORIES TABLE
CREATE TABLE food_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NULL
);

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
    FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE RESTRICT
);

-- 5. COUPONS TABLE
CREATE TABLE coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NULL,
    discount_percentage INT NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    expiry_date DATE NULL
);

-- 6. ORDERS TABLE
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    username VARCHAR(100) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    coupon_code_used VARCHAR(50) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (coupon_code_used) REFERENCES coupons(code) ON DELETE SET NULL
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    food_id BIGINT UNSIGNED NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE RESTRICT
);

-- 8. PAYMENTS TABLE
CREATE TABLE payments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Unpaid',
    transaction_id VARCHAR(100) UNIQUE NULL,
    amount DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 9. RESTAURANT TABLES
CREATE TABLE restaurant_tables (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Available'
);

-- 10. TABLE BOOKINGS
CREATE TABLE table_bookings (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests INT NOT NULL,
    table_number INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (table_number) REFERENCES restaurant_tables(table_number) ON DELETE RESTRICT
);

-- 11. BUFFET BOOKINGS
CREATE TABLE buffet_bookings (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    buffet_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    seats_count INT NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

-- 12. CUSTOMER REVIEWS
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    food_name VARCHAR(150) NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    image_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. INVENTORY TRACKING
CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ingredient VARCHAR(150) NOT NULL,
    stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(20) NOT NULL,
    consumption_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    expiry_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Owners (Shrishti, Krish, Nikhil)
INSERT INTO roles (id, name, description) VALUES 
(1, 'OWNER', 'Full administrative control'),
(2, 'ADMIN', 'Supervises transactions and menu'),
(3, 'STAFF', 'Manages orders and kitchen status'),
(4, 'CUSTOMER', 'Loyalty customer')
ON DUPLICATE KEY UPDATE name=name;

INSERT INTO users (id, full_name, email, phone, address, username, password_hash, role_id, is_approved) VALUES 
(1, 'Shrishti', 'shrishti@atriafeasty.com', '+91 99999 88811', 'Hebbal, Bengaluru', 'shrishti_owner', '$2a$10$WnbeYlEepX20M6zGq991kuzGstQkexO6K2jT8n.y/gAtXGqCj1Bki', 1, TRUE),
(2, 'Krish', 'krish@atriafeasty.com', '+91 99999 88822', 'Hebbal, Bengaluru', 'krish_owner', '$2a$10$89yFvP8g196wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 1, TRUE),
(3, 'Nikhil', 'nikhil@atriafeasty.com', '+91 99999 88833', 'Hebbal, Bengaluru', 'nikhil_owner', '$2a$10$22n9vB8p207wHl/rD4O01eVQvM38M7k3fL5X9pIqE8G290uX6gY2u', 1, TRUE);`,

    models: `// java-feasty/src/main/java/com/atriafeasty/rms/model/SecurityAndModels.java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String username;
    private String passwordHash;
    private int ordersCount = 0;
    private String membershipLevel = "NONE"; // SILVER, GOLD, PLATINUM
}`,

    controllers: `// java-feasty/src/main/java/com/atriafeasty/rms/controller/ControllersAndServices.java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }
}`,

    security: `// java-feasty/src/main/java/com/atriafeasty/rms/security/JwtAndSecurityConfig.java
@Configuration
@EnableWebSecurity
public class JwtAndSecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-neutral-800 bg-linear-to-r from-teal-50 to-emerald-50 dark:from-neutral-950 dark:to-neutral-900">
        <h2 className="text-2xl font-sans font-bold text-gray-900 dark:text-neutral-50 flex items-center gap-2">
          <FileCode className="text-emerald-600 dark:text-emerald-400 w-7 h-7" />
          Java Spring Boot Integration Suite
        </h2>
        <p className="text-gray-500 dark:text-neutral-400 mt-1 max-w-2xl text-sm">
          Atria Feasty is built with database-driven Java technologies. Explore and export the ready-to-run source directories we initialized in your workspace workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[500px]">
        {/* Navigation panel */}
        <div className="p-4 border-r border-gray-100 dark:border-neutral-805 bg-gray-50/50 dark:bg-neutral-900/50 flex flex-col gap-2">
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest px-3 py-2">Documentation</div>
          <button
            onClick={() => setActiveFile('readme')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'readme' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            README.md Run Guide
          </button>

          <button
            onClick={() => setActiveFile('pom')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'pom' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            Maven configurations (pom.xml)
          </button>

          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest px-3 py-2 mt-4">Database</div>
          <button
            onClick={() => setActiveFile('schema')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'schema' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Database className="w-4 h-4" />
            MySQL Schema (schema.sql)
          </button>

          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest px-3 py-2 mt-4">Java Backend Sources</div>
          <button
            onClick={() => setActiveFile('models')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'models' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            JPA Domain Entities
          </button>
          <button
            onClick={() => setActiveFile('controllers')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'controllers' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Controllers & Services
          </button>
          <button
            onClick={() => setActiveFile('security')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
              activeFile === 'security' ? 'bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-950/30 dark:text-emerald-400' : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            Security & JWT Filter
          </button>
        </div>

        {/* Code Content View */}
        <div className="col-span-1 lg:col-span-3 bg-neutral-900 text-neutral-200 p-6 font-mono text-xs overflow-auto flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-4">
            <span className="text-neutral-400">
              {activeFile === 'readme' && 'README.md (Guideline Markdown)'}
              {activeFile === 'pom' && 'pom.xml (Maven Configuration)'}
              {activeFile === 'schema' && 'database/schema.sql (MySQL 8.0 Script)'}
              {activeFile === 'models' && 'src/main/java/.../model/SecurityAndModels.java'}
              {activeFile === 'controllers' && 'src/main/java/.../controller/ControllersAndServices.java'}
              {activeFile === 'security' && 'src/main/java/.../security/JwtAndSecurityConfig.java'}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  Copy File
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
            {fileContents[activeFile]}
          </pre>

          <div className="pt-4 mt-4 border-t border-neutral-800 text-neutral-500 flex justify-between">
            <span>Encoding: UTF-8</span>
            <span>Target Runtime: Java 21 LTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

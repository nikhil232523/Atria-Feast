# Atria Feasty - Java Spring Boot Backend

Enterprise-grade, Production-quality modular Restaurant Management System developed for owners **Shrishti**, **Krish**, and **Nikhil**.

---

## Technical Stack
* **Java**: Version 21 (LTS)
* **Framework**: Spring Boot 3.2.x, Spring JPA, Hibernate
* **Security**: Spring Security + Stateful JWT Auth + BCrypt Password Hashing
* **Database**: MySQL 8.x
* **Build System**: Maven 3.x
* **Optional Modules**: Web, JWT, JPA, Validation, PDF receipts generator, and SQL triggers.

---

## Setup & Running Guide

### 1. Database Setup
1. Open MySQL Command Line Client or any tool (such as MySQL Workbench, DBeaver, phpMyAdmin).
2. Execute the entire schema containing the initial schemas and seed records:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Update database credentials in the configuration file (`src/main/resources/application.yml`):
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/atria_feasty_db
       username: <your_mysql_username>
       password: <your_mysql_password>
   ```

### 2. Auto-generated Owner Accounts
When the database seeds or executes `schema.sql`, three owner entries are initialized instantly with encrypted passwords (BCrypt strength 10):

* **Owner 1**: 
  - Username: `shrishti_owner`
  - Raw Password: `Shrishti@123`
* **Owner 2**: 
  - Username: `krish_owner`
  - Raw Password: `Krish@123`
* **Owner 3**: 
  - Username: `nikhil_owner`
  - Raw Password: `Nikhil@123`

### 3. Compilation & Launching
In the root directory of the Spring project, compile and launch using Maven Wrapper or system Maven:

```bash
# Clean project and compile source files
mvn clean compile

# Pack into a executable jar
mvn package -DskipTests

# Run the spring application
java -jar target/atria-feasty-rms-1.0.0.jar
```

Or run via the Spring Boot direct launcher:
```bash
mvn spring-boot:run
```

---

## Role-Based Authorization Privileges
* **OWNER**: Can approve staff/admin registrations, manage inventory elements, modify prices, view graphical reports + daily summaries, reset accounts.
* **ADMIN**: Can edit category menu items, manage coupon definitions, update stock levels.
* **STAFF**: Can accept or change order workflow states, assign tables, read review feedback streams.
* **CUSTOMER**: Registration, profile viewing, placing orders, applying loyalty discount codes, reservation of tables and premium slots.

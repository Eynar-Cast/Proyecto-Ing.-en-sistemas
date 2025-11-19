CREATE DATABASE IF NOT EXISTS materialpro;
USE materialpro;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'unidad',
  description TEXT,
  min_stock INT DEFAULT 10,
  image LONGTEXT,
  supplier_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  contact VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT,
  employee_id INT,
  total DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Tabla de items de ventas
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

-- Tabla de movimientos
CREATE TABLE IF NOT EXISTS movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  type ENUM('entrada', 'salida', 'venta', 'ajuste') NOT NULL,
  quantity INT NOT NULL,
  reason TEXT,
  user VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar categorías por defecto
INSERT INTO categories (name) VALUES 
  ('Cemento'), ('Arena'), ('Grava'), ('Ladrillos'), 
  ('Herramientas'), ('Pintura'), ('Madera'), ('Tubería'), 
  ('Acero'), ('Ferretería'), ('Eléctrico'), ('Plomería'), 
  ('Acabados'), ('Pisos')
ON DUPLICATE KEY UPDATE name=name;
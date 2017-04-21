CREATE DATABASE Bamazon_db;

USE Bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(7,2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT '1',
  PRIMARY KEY (item_id)
);
Select * From products;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(7,2) NOT NULL DEFAULT '0.00',
  total_sales DECIMAL(7,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (department_id)
);
Select * From departments;

ALTER TABLE products ADD COLUMN product_sales DECIMAL(7,2) DEFAULT '0.00';
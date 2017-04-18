CREATE DATABASE Bamazon_db;

USE Bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(7,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);
select * from products;
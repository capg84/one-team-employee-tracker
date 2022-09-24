-- drop database if exists
DROP DATABASE IF EXISTS one_team_employee_db;

-- create new database
CREATE DATABASE one_team_employee_db;

-- select database
USE one_team_employee_db;

-- creating tables as per requirement
-- create departments table
CREATE TABLE departments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- creat roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30) NOT NULL,
    salary DECIMAL(20,2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

-- create employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
);
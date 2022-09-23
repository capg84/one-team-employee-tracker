-- inserting values into departments table
INSERT INTO departments (name)
VALUES  ("Sales"),
        ("Customer Service"),
        ("IT"),
        ("Accounts & Finance");

-- inserting values into roles table
INSERT INTO roles (role_name, salary, department_id)
VALUES  ("IT Manager", 100000, 3),
        ("Software Engineer", 55000, 3),
        ("Accountant", 45000, 4),
        ("Sales Executive", 24000, 1),
        ("Customer Service Assistant", 24000, 2),
        ("Customer Service Supervison", 30000, 2);

-- inserting values into employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("Cyprian", "Gomes", 1, NULL),
        ("Tom", "Cruise", 2, 1),
        ("Tom", "Hanks", 3, NULL),
        ("Jason", "Bourne", 4, NULL);

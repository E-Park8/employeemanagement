USE employee_db;

INSERT INTO department (name)
VALUES ('Sales'),  ('Legal'), ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Rep', 65000, 1),
       ('Sales Manager', 100000, 1),
       ('Paralegal', 80000, 2),
       ('Senior Lawyer', 175000, 2)
       ('Stocker', 40000, 3)
       ('Warehouse Manager', 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Eric', 'Park', 2, NULL),
       ('David', 'Smith', 3, 3),
       ('Marshall', 'Eriksen', 4, NULL),
       ('Barney', 'Stinson', 1, 1)
       ('Darryl', 'Philbin' 6, NULL);
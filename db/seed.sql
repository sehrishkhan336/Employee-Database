-- Populates Departments:
USE employee_db;

INSERT INTO department (name) VALUES
  ('Finance'),
  ('Human Resources'),
  ('Marketing'),
  ('Sales'),
  ('IT'),
  ('Engineering');

-- Populate roles
INSERT INTO roles (title, salary, department_id) VALUES
  ('Finance Manager', 100000, 1),
  ('Manager Recruitment', 150000, 2),
  ('Supervisor', 65000, 5),
  ('Sales Officer', 50000, 4),
  ('Lead Engineer', 150000, 6), 
  ('Network Officer', 80000, 5),
  ('Sales Manager', 200000, 4);

-- Populate employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Sehrish', 'Khan', 4, 2);
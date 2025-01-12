INSERT INTO departments(name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');
        

INSERT INTO job_role(title, salary, department_id)
VALUES('Sales Lead', 12000, 1),
      ('Salesperson', 8000, 1),
      ('Lead Engineer', 15000, 2),
      ('Software Engineer', 12000, 2),
      ('Account Manager', 45000, 3),
      ('Accountant', 125000, 3 ),
      ('Legal Lead', 78000, 4),
      ('Lawyer', 48000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES('John', 'Doe', 1, NULL),
      ('Mike', 'Chan', 2, 1),
      ('Ashley', 'Rodriguez', 3, NULL),
      ('Kevin', 'Tupik', 4, 3),
      ('Kunal', 'Singh', 5, NULL),
      ('Malia', 'Brown', 6, 5 ),
      ('Sarah', 'Lourd', 7, NULL),
      ('Tom', 'Allen', 8, 7);

      SELECT * FROM departments
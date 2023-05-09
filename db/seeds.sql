INSERT INTO department (name)
VALUES ("Head Office"),
       ("Operations"),
       ("Finance"),
       ("Marketing"),
       ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 1000000, 1),
       ("COO", 650000, 2),
       ("CFO", 800000, 3),
       ("Head of Sales", 700000, 4),
       ("Head of HR", 350000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gareth", "Stanley", 1, NULL),
       ("Susan", "Hendricks", 2, 1),
       ("Brian", "Smith", 3, 1),
       ("Stacey", "Gavin", 4, 1),
       ("Tyler", "Chadston", 5, 1);
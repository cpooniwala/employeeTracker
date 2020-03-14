/* Use the Employee DB */
USE employeeDB;

/* Insert Rows into tables */
INSERT INTO department (name)
VALUES ("Product Management");


INSERT INTO role (title, salary,department_id)
VALUES ("Associate Product Manager","75000","1");

INSERT INTO role (title, salary,department_id)
VALUES ("Product Manager","100000","1");


INSERT INTO employee (first_name, last_name, role_id)
VALUES("Tess","Last","2")

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Cyrus","Pooniwala","2","1")
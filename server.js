const express = require("express");
const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

//
function start() {
  inquirer
    .prompt({
      name: "decision",
      type: "list",
      message: "Welcome to the Employee Tracker. What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View Departments",
        "View Roles",
        "View Employees",
        "Update Employee Role"
      ]
    })
    .then(function(data) {
      if (data.decision === "Add Department") {
        addDepartment();
      } else if (data.decision === "Add Role") {
        addRole();
      } else if (data.decision === "Add Employee") {
        addEmployee();
      } else if (data.decision === "View Departments") {
        viewDepartments();
      } else if (data.decision === "View Roles") {
        viewRoles();
      } else if (data.decision === "View Employees") {
        viewEmployees();
      } else if (data.decision === "Update Employee Role") {
        updateEmployeeRole();
      }
    });
}

function addDepartment() {
  console.log("Add Department Selected");
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Enter the department name you would like to add"
    })
    .then(function(response) {
      console.log(response.department + " will be added");
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: response.department
        },
        function(err) {
          if (err) throw err;
          console.log("Your Department was added successfully");
          viewDepartments();
        }
      );
    });
}

function addRole() {
  console.log("Here are the Department IDs for reference:");
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    console.table(results);
  });

  inquirer
    .prompt([
      {
        name: "roleName",
        type: "input",
        message: "Enter the Role name you would like to add"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "Enter the Salary for your role"
      },
      {
        name: "roleDepartment",
        type: "input",
        message: "Select the Department associated with the role"
      }
    ])
    .then(function(response) {
      console.log(response.roleName + " will be added");
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: response.roleName,
          salary: response.roleSalary,
          department_id: response.roleDepartment
        },
        function(err) {
          if (err) throw err;
          console.log("Your Role was added successfully");
          viewRoles();
        }
      );
    });
}

function addEmployee() {
  viewRoles();
  viewEmployees();
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter Employee's first name"
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter Employee's last name"
      },
      {
        name: "employeeRoleID",
        type: "input",
        message: "Enter Employee's Role ID"
      },
      {
        name: "employeeManagerID",
        type: "input",
        message: "Enter the ID of the Manager that the Employee will report to"
      }
    ])
    .then(function(response) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.employeeRoleID,
          manager_id: response.employeeManagerID
        },
        function(err) {
          if (err) throw err;
          console.log("Your Employee was added successfully");
          viewEmployees();
        }
      );
    });
}

function viewDepartments() {
  console.log("View Departments:");
  connection.query("SELECT * FROM department", function(err, results) {
    if (err) throw err;
    console.table(results);
  });
}
function viewRoles() {
  console.log("View Roles:");
  connection.query("SELECT * FROM role", function(err, results) {
    if (err) throw err;
    console.table(results);
  });
}
function viewEmployees() {
  console.log("View Employees:");
  connection.query("SELECT * FROM employee", function(err, results) {
    if (err) throw err;
    console.table(results);
  });
}

function updateEmployeeRole() {
  console.log("Update Employee Role Selected");
  viewEmployees();
  viewRoles();
  inquirer
    .prompt([
      {
        name: "employeeID",
        type: "input",
        message: "Enter the employee ID you would like to update"
      },
      {
        name: "roleID",
        type: "input",
        message: "Enter the Role ID you would like to update"
      }
    ])
    .then(function(response) {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [response.roleID, response.employeeID],
        function(err) {
          if (err) throw err;
          console.log("Employee has been Updated:");
          viewEmployees();
        }
      );
    });
}
// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
  start();
});

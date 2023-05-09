const inquirer = require("inquirer");
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password123',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

// Prompt the user to choose an option
function showMenu () {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit"
        ]
    }).then(function(answers) {
        switch (answers.action) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                console.log("Goodbye!");
                process.exit();
                break;
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

// View all departments
function viewDepartments() {
    const sql = "SELECT * FROM department";
    db.query(sql, function(err, results) {
        if (err) throw err;
        console.table(results);
        showMenu();
    });
}

// View all roles
function viewRoles() {
    const sql = "SELECT * FROM role";
    db.query(sql, function(err, results) {
        if (err) throw err;
        console.table(results);
        showMenu();
    });
}

// View all employees
function viewEmployees() {
    const sql = "SELECT * FROM employee";
    db.query(sql, function(err, results) {
        if (err) throw err;
        console.table(results);
        showMenu();
    });
}

// Add a department
function addDepartment() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "What department would you like to add?"
    }).then(function(answers) {
        const sql = "INSERT INTO department (name) VALUES (?)";
        db.query(sql, answers.department, function(err, result) {
            if (err) throw err;
            console.log(`Added department ${answers.department}`);
            showMenu();
        });
    });
}

// Add a role
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the new role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for the new role?",
        },
        {
            type: "input",
            name: "department_id",
            message: "What department ID is the role in?",
        },
    ])
    .then((answers) => {
        db.query(
            "INSERT INTO role SET ?",
            {
                title: answers.title,
                salary: answers.salary,
                department_id: answers.department_id,
            },
            (err, result) => {
                if (err) throw err;
                console.log(`Added new role: ${answers.title}`);
                showMenu();
            }
        );
    });
}

// Add an employee
function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the first name of the employee?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the last name of the employee?",
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the ID of the role they will be in?",
        },
        {
            type: "input",
            name: "manager_id",
            message: "Who is the employee's manager (use their ID)?"
        },
    ])
    .then((answers) => {
        db.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                role_id: answers.role_id,
                manager_id: answers.manager_id,
            },
            (err, result) => {
                if (err) throw err;
                console.log(`Added new employee: ${answers.first_name} ${answers.last_name}`);
                showMenu();
            }
        );
    });
}

// Update an employee's role
function updateEmployeeRole() {
    db.promise().query("SELECT * FROM employee")
    .then(([rows, fields]) => {
        const employees = rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));
        inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role do you want to update?",
                choices: employees
            },
            {
                type: "input",
                name: "newRoleId",
                message: "Enter the new role ID:"
            },
        ])
        .then(answers => {
            const { employeeId, newRoleId } = answers;
            db.promise().query(`UPDATE employee SET role_id = ${newRoleId} WHERE id = ${employeeId}`)
            .then(() => console.log("Employee role updated successfully."))
            .catch(err => console.log(err));
            showMenu();
        });
    })
    .catch(err => console.log(err));
}

// Run the menu function
showMenu();
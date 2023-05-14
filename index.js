// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Connect to database
const dbConnect = mysql.createConnection(
  {
    // on mac - localhost does not connect
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'employees'
  },
  console.log(`Connected to the employee database.`)
);

dbConnect.connect((err) => {
    if (err) throw err;
    console.log('connected as id ' + dbConnect.threadId);
    beforeDb();
});

beforeDb = () => {
    console.log(',------------------------------------------------------------,')
    console.log('|                                                            |')
    console.log('|                                                            |')
    console.log('|                      EMPLOYEE MANAGER                      |')
    console.log('|                                                            |')
    console.log('|                                                            |')
    console.log('`------------------------------------------------------------’')
    startDb();
};

const startDb = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choices',
        message: 'What would you like to do?',
        choices: [

            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add A Department',
            'Add A Role',
            'Add An Employee',
            'Update An Employee Role',
            'Quit'
        ]
    })
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View All Departments') {
            renderAllDepartments();
        }

        if (choices === 'View All Roles') {
            renderAllRoles();
        }

        if (choices === 'View All Employees') {
            renderAllEmployees();
        }

        if (choices === 'Add A Department'){
            addDepartment();
        }

        if (choices === 'Add A Role') {
            addRole();
        }

        if (choices === 'Add An Employee') {
            addEmployee();
        }

        if (choices === 'Update An Employee Role') {
            updateRole();
        }

        if (choices === 'Quit') {
            dbConnect.end()
        };
    });
};

renderAllDepartments = () => {
    dbConnect.query (
        `SELECT department.id AS id,
                department.name AS department FROM department`,

                function (err, results) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.table(results);
                    startDb();
                }
    );
};

renderAllRoles = () => {
    dbConnect.query (
        `SELECT role.id,
                role.title,
                role.salary,
                department.name AS department
        FROM role
                INNER JOIN department ON role.department_id = department.id `,

                function (err, results) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.table(results);
                    startDb();
                }
    );
};

renderAllEmployees = () => {
    dbConnect.query (
        `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department,
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`,

                function (err, results) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.table(results);
                    startDb();
                }
    );
};

addDepartment = () => {
    inquirer.prompt([{
        type: 'text',
        name: 'newDepartment',
        message: 'Please enter the new departmant you would like to add: ',
        validate: newDepartment => {
            if (newDepartment) {
                return true;
            } else {
                console.log('Please enter a new department');
                return false;
            }
        }
    }
])

    .then(data => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        dbConnect.query(sql, data.newDepartment, (err, results) => {
            if (err) throw err;
            console.log('Added ' +data.newDepartment + ' to department!');
            renderAllDepartments();
        });
    });
};
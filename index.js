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
            'View All Employees',
            // 'View All Employees By Department',
            // 'View All Employees By Manager',
            // 'Add Employee',
            // 'Remove Employee',
            // 'Update Employee Role',
            // 'Update Employee Manager',
            // 'View All Roles',
            // 'Add Role',
            // 'Remove Role',
            // 'View All Deparments',
            // 'Add Deparment',
            // 'Remove Deparment',
            // 'View Total Utilized Budget By Department',
            'Quit'
        ]
    })
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View All Employees') {
            renderAllEmployees();
        }

        // if (choices === 'View All Employees By Department') {
        //     renderEmployeeDepartment();
        // }

        if (choices === 'Quit') {
            dbConnect.end()
        };
    });
};

const renderAllEmployees = () => {
    // console.log('Viewing All Employees');
    // const sql = `SELECT employee.id, 
    //                     employee.first_name, 
    //                     employee.last_name, 
    //                     role.title, 
    //                     department.name AS department,
    //                     role.salary, 
    //                     CONCAT (manager.first_name, " ", manager.last_name) AS manager
    //             FROM employee
    //                     LEFT JOIN role ON employee.role_id = role.id
    //                     LEFT JOIN department ON role.department_id = department.id
    //                     LEFT JOIN employee manager ON employee.manager_id = manager.id`;
                        
    // dbConnect.promise().query(sql, (err, rows) => {
    //     if (err) throw err;

    //     console.table(rows);

    //     console.log('Viewed All Employees');

    //     startDb();

    // });

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

                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.table(results);
                    startDb();
                }
    );
};
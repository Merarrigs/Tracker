import express from 'express';
// import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';
import inquirer from 'inquirer';

await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());



function startQuery() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'track',
            message: 'What would you like to do?',
            choices:[
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department'
            ]
        }
    ]).then((answer) => {
        switch(answer.track) {
            case 'View All Employees':
            pool.query('SELECT * FROM employees', (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else if (result) {
                        console.table(result.rows);
                        startQuery();
                    }
                });
                break;
            case 'Add Employee':
                addEmployee();
                break;

            case 'View All Roles':
            pool.query('SELECT * FROM job_role', (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else if (result) {
                        console.table(result.rows);
                        startQuery();
                    }
                });
                break;

            case 'Add Role':
                addRole();
                break;

            case 'View All Departments':
            pool.query('SELECT * FROM departments', (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else if (result) {
                        console.table(result.rows);
                        startQuery();
                    }
                });
                break;
            case 'Add Department':
                addDepartment();
                break;
        }
    });
};


function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the new department?',
        }
    ])
    .then((answer) => {
        const dept = `INSERT INTO department(name) VALUES('${answer.department}');`
        pool.query(dept, (err, result) => {
            if (err) {
                console.log(err);
                return;
            } else {
            console.log(`${answer.department} was added to database`)
            startQuery();
            }
        });
    });
};


function addRole() {
    const newRole = `SELECT * FROM department`;
    pool.query(newRole, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let deptsList = result.rows.map(departments => ({
                name: departments.name,
                value: departments.id
            }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'New role title:',
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'New role salary:',
                },
                {
                    type: 'list',
                    name: 'depts',
                    message: 'Which Department?',
                    choices: deptsList
                }
            ])
                .then((answers) => {
                    const nuevoDept =(`INSERT INTO job_role(title, salary, department_id) VALUES ('${answers.title}', ${parseInt(answers.salary)}, ${parseInt(answers.depts)})`)
                pool.query(nuevoDept, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else if (result) {
                        console.table(`${result.rowCount} role has been added!`);
                        startQuery();
                    }
                });
            });
        }
    });
}


function addEmployee() {
    let titleRole:any;
    let managerList;
    pool.query(`SELECT * FROM job_role`, (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result) {
            titleRole = result.rows.map(job_role => ({
                name: job_role.title,
                value: job_role.department_id
            }));
            pool.query(`SELECT * FROM employees`, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    managerList = result.rows.map(employees => ({
                        name: `${employees.first_name} ${employees.last_name}`,
                        value: employees.manager_id
                    }));
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: 'New employee first name:',
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'New employee last name:',
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: `What is the employee's Role?`,
                            choices: titleRole,
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Manager of new employee:',
                            choices: managerList,
                        },
                    ])
                        .then((answers) => {
                        pool.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES  ('${answers.firstName}', '${answers.lastName}', ${parseInt(answers.role)}, ${parseInt(answers.manager)});`, (err, result) => {
                            if (err) {
                                console.log(err);
                            }
                            else if (result) {
                                console.table(`${result.rowCount} employee has been added!`);
                                startQuery();
                            }
                        });
                    });
                }
            });
        }
    });
}


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startQuery();
  });
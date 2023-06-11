const inquirer = require('inquirer');
const connection = require('./db/connection');
const util = require('util');
connection.query = util.promisify(connection.query);


// Function to start the application
function startApp() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then(async (answers) => {
      const { option } = answers;

      switch (option) {
        case 'View all departments':
          getAllDepartments();
          break;

        case 'View all roles':
          await getAllRoles();

          break;

        case 'View all employees':
          await getAllEmployees();
          break;

        case 'Add a department':
          await promptAddDepartment()
          break;

        case 'Add a role':
          await promptAddRole();
          break;

        case 'Add an employee':
          await promptAddEmployee();
          break;

        case 'Update an employee role':
          await promptUpdateEmployeeRole();
          break;

        case 'Exit':
          process.exit();

        default:
          console.log('Invalid option');
          break;
      }
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Function to retrieve all departments
async function getAllDepartments() {
  const query = 'SELECT id, name FROM department';
  const results = await connection.query(query);
  console.table(results);

  // Prompt to go back to view other options
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'goBack',
        message: 'Would you like to go back to view other options?',
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.goBack) {
        startApp(); // Start the app again
      } else {
        process.exit(); // Exit the program
      }
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Function to retrieve all roles
async function getAllRoles() {
  const query = 'SELECT roles.id, roles.title, roles.salary, department.name AS department_name FROM roles JOIN department ON department.id = roles.department_id';
  const results = await connection.query(query);
  console.table(results);
  // Prompt to go back to view other options
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'goBack',
        message: 'Would you like to go back to view other options?',
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.goBack) {
        startApp();
      } else {
        process.exit();
      }
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Function to retrieve all employees
async function getAllEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, 
      roles.title AS job_title, roles.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name,
      department.name AS department_name 
    FROM employee 
    JOIN roles ON employee.role_id = roles.id 
    JOIN department ON roles.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
  `;
  const results = await connection.query(query);
  console.table(results);

  // Prompt to go back to view other options
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'goBack',
        message: 'Would you like to go back to view other options?',
        default: true,
      },
    ])
    .then((answer) => {
      if (answer.goBack) {
        startApp();
      } else {
        process.exit();
      }
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Function to create a new department
async function createDepartment(department) {
  const query = 'INSERT INTO department SET ?';
  return await connection.query(query, department);
}
function promptAddDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
        validate: (input) => (input ? true : 'Department name is required'),
      },
    ])
    .then(async (answers) => {
      const { departmentName } = answers;
      await createDepartment({ name: departmentName });
      console.log('Department added successfully!');
      // Prompt to go back to view other options
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'goBack',
            message: 'Would you like to go back to view other options?',
            default: true,
          },
        ])
        .then((answer) => {
          if (answer.goBack) {
            startApp();
          } else {
            process.exit();
          }
        })
        .catch((error) => {
          console.log('An error occurred:', error);
        });
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}
// Function to create a new role
async function createRole(role) {
  const query = 'INSERT INTO roles SET ?'; // Use "roles" as the table name
  return await connection.query(query, role);
}
// Prompt to add a department
function promptAddRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the title of the role:',
        validate: (input) => (input ? true : 'Role title is required'),
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
        validate: (input) => {
          const isValid = /^\d+(\.\d{1,2})?$/.test(input);
          return isValid ? true : 'Invalid salary. Please enter a valid number.';
        },
      },
      {
        type: 'input',
        name: 'roleDepartmentId',
        message: 'Enter the department ID for the role:',
        validate: (input) => (input ? true : 'Department ID is required'),
      },
    ])
    .then(async (answers) => {
      const { roleTitle, roleSalary, roleDepartmentId } = answers;
      const role = {
        title: roleTitle,
        salary: parseFloat(roleSalary), // Parse the salary as a float or numeric value
        department_id: parseInt(roleDepartmentId), // Parse the department ID as an integer
      };
      await createRole(role);
      console.log('Role added successfully!');
      // Prompt to go back to view other options
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'goBack',
            message: 'Would you like to go back to view other options?',
            default: true,
          },
        ])
        .then((answer) => {
          if (answer.goBack) {
            startApp();
          } else {
            process.exit();
          }
        })
        .catch((error) => {
          console.log('An error occurred:', error);
        });
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Function to create a new employee
// Function to create an employee in the database
async function createEmployee(employee) {
  const query = 'INSERT INTO employee SET ?';
  return await connection.query(query, employee);
}

// Prompt to add an employee
function promptAddEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeFirstName',
        message: "Enter the employee's first name:",
        validate: (input) => (input ? true : "Employee's first name is required"),
      },
      {
        type: 'input',
        name: 'employeeLastName',
        message: "Enter the employee's last name:",
        validate: (input) => (input ? true : "Employee's last name is required"),
      },
      {
        type: 'input',
        name: 'employeeRole',
        message: "Enter the employee's role title:",
        validate: (input) => (input ? true : "Employee's role title is required"),
      },
      {
        type: 'input',
        name: 'departmentName',
        message: "Enter the department name:",
        validate: (input) => (input ? true : "Department name is required"),
      },
      {
        type: 'input',
        name: 'managerFirstName',
        message: "Enter the first name of the employee's manager:",
        validate: (input) => (input ? true : "First name of the employee's manager is required"),
      },
    ])
    .then(async (answers) => {
      const { employeeFirstName, employeeLastName, employeeRole, departmentName, managerFirstName } = answers;
      await createEmployee({ firstName: employeeFirstName, lastName: employeeLastName, role: employeeRole, department: departmentName, managerFirstName: managerFirstName });
      console.log('Employee added successfully!');
      // Prompt to go back to view other options
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'goBack',
            message: 'Would you like to go back to view other options?',
            default: true,
          },
        ])
        .then((answer) => {
          if (answer.goBack) {
            startApp();
          } else {
            process.exit();
          }
        })
        .catch((error) => {
          console.log('An error occurred:', error);
        });
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}


// Function to update an employee's role
function updateEmployeeRole(employeeId, newRole) {
  const query = 'UPDATE employee SET role_id = (SELECT id FROM roles WHERE title = ?) WHERE id = ?';
  return connection.query(query, [newRole, employeeId]);
}

// Prompt to update an employee's role
function promptUpdateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeId',
        message: "Enter the ID of the employee you want to update:",
        validate: (input) => (input ? true : "Employee ID is required"),
      },
      {
        type: 'input',
        name: 'newRole',
        message: "Enter the new role for the employee:",
        validate: (input) => (input ? true : "New role is required"),
      },
    ])
    .then(async (answers) => {
      const { employeeId, newRole } = answers;

      try {
        // Retrieve the role ID based on the new role title
        const roleQuery = 'SELECT id FROM roles WHERE title = ?';
        const roleResult = await connection.query(roleQuery, [newRole]);
        const roleId = roleResult[0].id;

        // Update the employee's role in the database
        const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
        await connection.query(updateQuery, [roleId, employeeId]);

        console.log('Employee role updated successfully!');
      } catch (error) {
        console.log('An error occurred:', error);
      }

      // Prompt to go back to view other options
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'goBack',
            message: 'Would you like to go back to view other options?',
            default: true,
          },
        ])
        .then((answer) => {
          if (answer.goBack) {
            startApp();
          } else {
            process.exit();
          }
        })
        .catch((error) => {
          console.log('An error occurred:', error);
        });
    })
    .catch((error) => {
      console.log('An error occurred:', error);
    });
}

// Start the application
startApp();
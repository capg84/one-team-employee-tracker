// loading node dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const asciiArtLogo = require("asciiart-logo");

// creating sql database connection
const dbConnection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "none093rare977",
    database: "one_team_employee_db",
  },

  console.log("============================================"),
  console.log(""),
  console.log("   WELCOME TO ONE TEAM EMPLOYEE DATABASE   "),
  console.log(""),
  console.log("============================================"),
  manageOneTeam()
);

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

// creating manageOneTeam function
function manageOneTeam() {
  // prompting the options for the user
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainMenu",
        message: "Please select one option",
        choices: [
          "View all departments",
          "View all roles",
          "View employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee information",
          "View departmental spend on HR",
          "Exit One Team Manager Application",
        ],
      },
    ])
    .then(function (selection) {
      // creating switch based on the selected action
      switch (selection.mainMenu) {
        // viewAllDepartment function if "View all department" is selected
        case "View all departments":
          viewAllDepartments();
          break;

        // viewAllRoles function if "View all role" is selected
        case "View all roles":
          viewAllRoles();
          break;

        // viewEmployees function if "View employees" is selected
        case "View employees":
          viewEmployees();
          break;

        // departmentAdd function if "Add a department" is selected
        case "Add a department":
          departmentAdd();
          break;

        // roleAdd function if "Add a role" is selected
        case "Add a role":
          roleAdd();
          break;

        // employeeAdd function if "Add an employee" is selected
        case "Add an employee":
          employeeAdd();
          break;

        // viewSpend function if "View departmental spend on HR" is selected
        case "View departmental spend on HR":
          viewSpend();
          break;

        // updateEmployee function if "Update an employee information" is selected
        case "Update an employee information":
          updateEmployee();
          break;

        // exit from the application
        case "Exit One Team Manager Application":
          console.log(
            "==========================================================="
          );
          console.log("");
          console.log(
            "   YOU HAVE SUCCESSFULLY LOGGED OUT FROM THE APPLICATION   "
          );
          console.log("");
          console.log(
            "==========================================================="
          );
          dbConnection.end();
          break;
      }
    });
}

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids

// viewAllDepartments function
function viewAllDepartments() {
  dbConnection.query(
    `
        SELECT 
            id AS Department_ID, 
            name AS Department 
        FROM departments;`,
    function (err, res) {
      if (err) throw err;
      console.clear();
      console.log("");
      console.log("*** LIST OF ALL DEPARTMENTS ***");
      console.log("");
      console.table(res);
      manageOneTeam();
    }
  );
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// viewAllRoles function
function viewAllRoles() {
  dbConnection.query(
    `
        SELECT 
            r.id as Role_ID, 
            r.role_name as Title, 
            d.name as Department, 
            r.salary as Salary 
        FROM roles r 
        JOIN departments d ON d.id = r.department_id Order by r.id asc;`,
    function (err, res) {
      if (err) throw err;
      console.clear();
      console.log("");
      console.log("*** LIST OF ALL ROLES ***");
      console.log("");
      console.table(res);
      manageOneTeam();
    }
  );
}

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// Bonus: View employees by manager
// Bonus: View employees by department

// viewEmployees function
function viewEmployees() {
  // options to view employees
  inquirer
    .prompt([
      {
        type: "list",
        message: "How do you want to view the employees?",
        name: "action_selection",
        choices: [
          "View all employees",
          "View employees by department",
          "View employees by manager",
          "Go back to main menu",
        ],
      },
    ])
    .then(function (selection) {
      // creating switch based on the selected action
      switch (selection.action_selection) {
        // viewAllEmployees function if "View all employees" is selected
        case "View all employees":
          viewAllEmployees();
          break;

        // viewEmpByDept function if "View employees by department" is selected
        case "View employees by department":
          viewEmpByDept();
          break;

        // viewEmpByManager function if "View employees by manager" is selected
        case "View employees by manager":
          viewEmpByManager();
          break;

        // viewEmpByManager function if "View employees by manager" is selected
        case "Go back to main menu":
          console.clear();
          manageOneTeam();
          break;
      }
    });

  // function to view all employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
  function viewAllEmployees() {
    dbConnection.query(
      `
        SELECT 
            e.id as Employee_ID, 
            e.first_name as First_Name,
            e.last_name as Last_Name, 
            r.role_name as Title,
            d.name as Department, 
            r.salary as Salary, 
            (SELECT CONCAT(m.first_name, ' ', m.last_name)
                FROM employees m WHERE m.id = e.manager_id) as Manager
        FROM employees e
        JOIN roles r on r.id = e.role_id
        JOIN departments d ON d.id = r.department_id
        
        Order by r.id asc;`,
      function (err, res) {
        if (err) throw err;
        console.clear();
        console.log("");
        console.log("*****************************");
        console.log("*** LIST OF ALL EMPLOYEES ***");
        console.log("*****************************");
        console.log("");
        console.table(res);
        viewEmployees();
      }
    );
  }

  // function to view all department-wise employee data
  function viewEmpByDept() {
    dbConnection.query(
      `
        SELECT 
            d.name as Department, 
            e.id as Employee_ID, 
            e.first_name as First_Name,
            e.last_name as Last_Name, 
            r.role_name as Title,
            r.salary as Salary, 
            (SELECT CONCAT(m.first_name, ' ', m.last_name)
                FROM employees m WHERE m.id = e.manager_id) as Manager
        FROM employees AS e
        JOIN roles r on r.id = e.role_id
        JOIN departments d ON d.id = r.department_id
        Order by d.name asc;`,
      function (err, res) {
        if (err) throw err;
        console.clear();
        console.log("");
        console.log("*******************************************");
        console.log("*** LIST OF ALL EMPLOYEES BY DEPARTMENT ***");
        console.log("*******************************************");
        console.log("");
        console.table(res);
        viewEmployees();
      }
    );
  }

  // function to view manager-wise employee data
  function viewEmpByManager() {
    dbConnection.query(
      `
        SELECT 
            (SELECT CONCAT(m.first_name, ' ', m.last_name)
                FROM employees m WHERE m.id = e.manager_id) as Manager,
            e.id as Employee_ID, 
            e.first_name as First_Name,
            e.last_name as Last_Name, 
            r.role_name as Title,
            d.name as Department,
            r.salary as Salary
        FROM employees AS e
        JOIN roles r on r.id = e.role_id
        JOIN departments d ON d.id = r.department_id
        Order by Manager asc;`,
      function (err, res) {
        if (err) throw err;
        console.clear();
        console.log("");
        console.log("****************************************");
        console.log("*** LIST OF ALL EMPLOYEES BY MANAGER ***");
        console.log("****************************************");
        console.log("");
        console.table(res);
        viewEmployees();
      }
    );
  }
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// departmentAdd fuction
function departmentAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addNewDepartment",
        message: "What is the name of the department you need to add?",
      },
    ])
    .then((response) => {
      let newDeparmentName = response.addNewDepartment;
      console.log(`New department: ` + newDeparmentName);
      dbConnection.query(
        `INSERT INTO departments (name) VALUES ("${newDeparmentName}");`,
        function (err, res) {
          if (err) throw err;
          console.clear();
          console.log("");
          console.log("*****************************************");
          console.log("*** NEW DEPARTMENT SUCCESSFULLY ADDED ***");
          console.log("*****************************************");
          console.log("");
          console.table(res);
          viewAllDepartments();
        }
      );
    });
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// roleAdd function
function roleAdd() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRoleName",
        message: "What is the name of the role you need to add?",
      },

      {
        type: "input",
        name: "newRoleSalary",
        message: "What is the salary of the new role?",
      },

      {
        type: "input",
        name: "newRoleDept",
        message:
          "Which department does the new role belong to? Please enter DEPARTMENT ID only.",
      },
    ])
    .then((response) => {
      let newRoleName = response.newRoleName;
      let newRoleSalary = response.newRoleSalary;
      let newRoleDept = response.newRoleDept;
      console.log(`New role name: ` + newRoleName);
      console.log(`New role salary: ` + newRoleSalary);
      console.log(`New role department ID: ` + newRoleDept);
      dbConnection.query(
        `INSERT INTO roles (role_name, salary, department_id) VALUES ("${newRoleName}", ${newRoleSalary}, ${newRoleDept});`,
        function (err, res) {
          if (err) throw err;
          console.clear();
          console.log("");
          console.log("***********************************");
          console.log("*** NEW ROLE SUCCESSFULLY ADDED ***");
          console.log("***********************************");
          console.log("");
          console.table(res);
          viewAllRoles();
        }
      );
    });
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// employeeAdd function
async function employeeAdd() {
  // adding all available roles in an array
  const [roles] = await dbConnection.promise().query(`SELECT * FROM roles;`);
  // creating roles list
  const roleChoices = roles.map(({ role_name, id }) => ({
    name: role_name,
    value: id,
  }));

  // adding all available managers in an array
  const [managers] = await dbConnection
    .promise()
    .query(`SELECT * FROM employees WHERE manager_id IS NULL;`);
  // creating managers list
  const managerChoices = managers.map(({ first_name, last_name, id }) => ({
    name: first_name + " " + last_name,
    value: id,
  }));

  inquirer
    .prompt([
      {
        type: "input",
        name: "newEmpFirstName",
        message: "What is the first name of the employee you need to add?",
      },

      {
        type: "input",
        name: "newEmpLastName",
        message: "What is the last name of the employee you need to add?",
      },

      {
        type: "list",
        name: "newEmpRole",
        choices: roleChoices,
        message: "What is the role of the new employee?",
      },

      {
        type: "list",
        name: "isSupervised",
        choices: ["Yes", "No"],
        message: "Is the new employee going to be supervised?",
      },
    ])
    .then((response) => {
      let newEmpFirstName = response.newEmpFirstName;
      let newEmpLastName = response.newEmpLastName;
      let newEmpRole = response.newEmpRole;
      let isSupervised = response.isSupervised;
      console.log(`New employee first name: ` + newEmpFirstName);
      console.log(`New employee last name: ` + newEmpLastName);
      console.log(`New employee role ID: ` + newEmpRole);
      console.log(`Is the new employee supervised: ` + isSupervised);
      if (isSupervised === "No") {
        dbConnection.query(
          `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${newEmpFirstName}", "${newEmpLastName}", ${newEmpRole}, null);`
        );
      } else {
        inquirer
          .prompt([
            {
              type: "list",
              name: "newEmpManager",
              choices: managerChoices,
              message: "Who is the manager of the new employee?",
            },
          ])
          .then((response) => {
            let newEmpManager = response.newEmpManager;
            console.log(`New employee manager ID: ` + newEmpManager);
            dbConnection.query(
              `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${newEmpFirstName}", "${newEmpLastName}", ${newEmpRole}, ${newEmpManager});`
            );

            console.clear();
            console.log("");
            console.log("***************************************");
            console.log("*** NEW EMPLOYEE SUCCESSFULLY ADDED ***");
            console.log("***************************************");
            console.log("");
            console.table(response);
            viewEmployees();
          });
      }
    });
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// Bonus: Update employee managers

// updateEmployee function
async function updateEmployee() {
  // adding all available roles in an array
  const [roles] = await dbConnection.promise().query(`SELECT * FROM roles;`);
  // creating roles list
  const roleChoices = roles.map(({ role_name, id }) => ({
    name: role_name,
    value: id,
  }));

  // adding all available managers in an array
  const [managers] = await dbConnection
    .promise()
    .query(`SELECT * FROM employees WHERE manager_id IS NULL;`);
  // creating managers list
  const managerChoices = managers.map(({ first_name, last_name, id }) => ({
    name: first_name + " " + last_name,
    value: id,
  }));

  // adding all available employees in an array
  const [employees] = await dbConnection
    .promise()
    .query(`SELECT * FROM employees;`);
  // creating managers list
  const employeeChoices = employees.map(({ first_name, last_name, id }) => ({
    name: first_name + " " + last_name,
    value: id,
  }));

  inquirer
    .prompt([
      {
        type: "list",
        name: "updateEmployee",
        message: "What information do you want to update?",
        choices: [
          "Update their first name",
          "Update their last name",
          "Update their job title",
          "Update their manager information",
          "Go back to main menu",
        ],
      },
    ])
    .then(function (selection) {
      // creating switch based on the selected action
      switch (selection.updateEmployee) {
        // updateEmployeeFirstName function if "Update their first name" is selected
        case "Update their first name":
          updateEmployeeFirstName();
          break;

        // updateEmployeeLastName function if "Update their last name" is selected
        case "Update their last name":
          updateEmployeeLastName();
          break;

        // updateEmployeeRole function if "Update their job title" is selected
        case "Update their job title":
          updateEmployeeRole();
          break;

        // updateEmployeeManager function if "Update their manager information" is selected
        case "Update their manager information":
          updateEmployeeManager(); // need to be added
          break;

        // exit from the application
        case "Go back to main menu":
          manageOneTeam();
          break;
      }
    });

  // function to run if first name to be updated
  function updateEmployeeFirstName() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedEmployee",
          choices: employeeChoices,
          message: "First name of which employee needs to be updated?",
        },

        {
          type: "input",
          name: "updatedFirstName",
          message: "What is the updated first name of the employee?",
        },
      ])
      .then((response) => {
        let selectedEmployee = response.selectedEmployee;
        let updatedFirstName = response.updatedFirstName;
        console.log(`The employee to be updated: ` + selectedEmployee);
        console.log(`The updated first name: ` + updatedFirstName);

        //update statement needs to be added
        dbConnection.query(
          `UPDATE employees SET first_name = "${updatedFirstName}" WHERE id = ${selectedEmployee};`
        );
        console.clear();
        console.log("");
        console.log("*************************************************");
        console.log("*** EMPLOYEE FIRST NAME UPDATED SUCCESSFULLY  ***");
        console.log("*************************************************");
        console.log("");
        console.table(response);
        viewEmployees();
      });
  }

  // function to run if last name to be updated
  function updateEmployeeLastName() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedEmployee",
          choices: employeeChoices,
          message: "Last name of which employee needs to be updated?",
        },

        {
          type: "input",
          name: "updatedLastName",
          message: "What is the updated last name of the employee?",
        },
      ])
      .then((response) => {
        let selectedEmployee = response.selectedEmployee;
        let updatedLastName = response.updatedFirstName;
        console.log(`The employee to be updated: ` + selectedEmployee);
        console.log(`The updated last name: ` + updatedLastName);

        //update statement needs to be added
        dbConnection.query(
          `UPDATE employees SET last_name = "${updatedLastName}" WHERE id = ${selectedEmployee};`
        );
        console.clear();
        console.log("");
        console.log("************************************************");
        console.log("*** EMPLOYEE LAST NAME UPDATED SUCCESSFULLY  ***");
        console.log("************************************************");
        console.log("");
        console.table(response);
        viewEmployees();
      });
  }

  //function to run if role to be updated
  function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedEmployee",
          choices: employeeChoices,
          message: "Role of which employee needs to be updated?",
        },

        {
          type: "list",
          name: "updatedEmpRole",
          choices: roleChoices,
          message: "What is the updated role of the employee?",
        },
      ])
      .then((response) => {
        let selectedEmployee = response.selectedEmployee;
        let updatedEmpRole = response.updatedEmpRole;
        console.log(`The employee to be updated: ` + selectedEmployee);
        console.log(`The updated role: ` + updatedEmpRole);

        //update statement needs to be added
        dbConnection.query(
          `UPDATE employees SET role_id = ${updatedEmpRole} WHERE id = ${selectedEmployee};`
        );
        console.clear();
        console.log("");
        console.log("**********************************************");
        console.log("*** EMPLOYEE ROLE ID UPDATED SUCCESSFULLY  ***");
        console.log("**********************************************");
        console.log("");
        console.table(response);
        viewEmployees();
      });
  }

  //function to be if manager to be updated
  function updateEmployeeManager() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "selectedEmployee",
          choices: employeeChoices,
          message: "Role of which employee needs to be updated?",
        },

        {
          type: "list",
          name: "isSupervised",
          choices: ["Yes", "No"],
          message: "Is the new employee going to be supervised?",
        },
      ])
      .then((response) => {
        let selectedEmployee = response.selectedEmployee;
        let isSupervised = response.isSupervised;
        let updatedEmpRole = response.updatedEmpRole;
        console.log(`The employee to be updated: ` + selectedEmployee);
        console.log(`The employee is going to be supervised: ` + isSupervised);

        if (isSupervised === "No") {
          dbConnection.query(
            `UPDATE employees SET manager_id = null WHERE id = ${selectedEmployee};`
          );
        } else {
          inquirer
            .prompt([
              {
                type: "list",
                name: "updatedEmpManager",
                choices: managerChoices,
                message: "Who is the updated manager of the employee?",
              },
            ])
            .then((response) => {
              let updatedEmpManager = response.updatedEmpManager;

              dbConnection.query(
                `UPDATE employees SET manager_id = ${updatedEmpManager} WHERE id = ${selectedEmployee};`
              );
              console.clear();
              console.log("");
              console.log("************************+++**********************");
              console.log("*** EMPLOYEE MANAGER ID UPDATED SUCCESSFULLY  ***");
              console.log("*************************************************");
              console.log("");
              console.table(response);
              viewEmployees();
            });
        }
      });
  }
}

// Bonus: View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.

// viewSpend function
function viewSpend() {
  dbConnection.query(
    `
    SELECT 
        d.name AS Department,
        COUNT(e.id) as Employees_in_Dept,
        FORMAT(SUM(salary),2) as Total_Spend 
    FROM employees e
    JOIN roles r ON r.id = e.role_id
    JOIN departments d ON d.id = r.department_id
    GROUP BY d.name
    ORDER by d.name ASC;
    `,
    function (err, res) {
      if (err) throw err;
      console.clear();
      console.log("");
      console.log("******************************");
      console.log("*** HR SPEND BY DEPARMENT  ***");
      console.log("******************************");
      console.log("");
      console.table(res);
      manageOneTeam();
    }
  );
}

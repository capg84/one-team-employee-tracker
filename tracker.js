// loading node dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const asciiArtLogo = require("asciiart-logo");

// creating sql database connection
const dbConnection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'none093rare977',
      database: 'one_team_employee_db'
    },
    
    console.log ("============================================"),
    console.log (""),
    console.log ("   WELCOME TO ONE TEAM EMPLOYEE DATABASE   "),
    console.log (""),
    console.log ("============================================"),
    manageOneTeam()
);

// creating manageOneTeam function
function manageOneTeam() {
    // prompting the options for the user
    inquirer.prompt ([
        {
        type: "list",
        name: "action_selection",
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
            "Delete a department, role or employee",
            "Exit One Team Manager Application"
            ]
        }
        ]).then(function(selection){
            // creating switch based on the selected action
            switch(selection.action_selection) {
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

                // updateEmployee function if "Update an employee information" is selected
                case "Update an employee information":
                    updateEmployee();
                break;

                // viewSpend function if "View departmental spend on HR" is selected
                case "View departmental spend on HR":
                    viewSpend();
                break;

                // deleteInfo function if "Delete a department, role or employee" is selected
                case "Delete a department, role or employee":
                    deleteInfo();
                break;

                // exit from the application
                case "Exit One Team Manager Application":
                    console.log ("===========================================================");
                    console.log ("");
                    console.log ("   YOU HAVE SUCCESSFULLY LOGGED OUT FROM THE APPLICATION   ");
                    console.log ("");
                    console.log ("===========================================================");
                    dbConnection.end();
                break;
            }
        }
    )
};

// viewAllDepartments function
function viewAllDepartments() {
    dbConnection.query(`
        SELECT 
            id AS Department_ID, 
            name AS Department 
        FROM departments;`,
    function(err, res) {
      if (err) throw err
      console.log("")
      console.log("*** LIST OF ALL DEPARTMENTS ***")
      console.log("")
      console.table(res)
      manageOneTeam()
    });
};

// viewAllRoles function
function viewAllRoles() {
    dbConnection.query(`
        SELECT 
            r.id as Role_ID, 
            r.role_name as Title, 
            d.name as Department, 
            r.salary as Salary 
        FROM roles r 
        JOIN departments d ON d.id = r.department_id Order by r.id asc;`,
    function(err, res) {
      if (err) throw err
      console.log("")
      console.log("*** LIST OF ALL ROLES ***")
      console.log("")
      console.table(res)
      manageOneTeam()
    });
};

// viewEmployees function
function viewEmployees() {
    // options to view employees
    inquirer.prompt ([
        {
        type: "list",
        message: "How do you want to view the employees?",
        name: "action_selection",
        choices: [
            "View all employees",
            "View employees by department",
            "View employees by manager",
            "Go back to main menu"
            ]
        }
        ]).then(function(selection){
            // creating switch based on the selected action
            switch(selection.action_selection) {
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
                    manageOneTeam();
                break;
            }
        }
    )

    // function to view all employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    function viewAllEmployees() {
        dbConnection.query(`
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
        function(err, res) {
        if (err) throw err
        console.log("")
        console.log("*****************************")
        console.log("*** LIST OF ALL EMPLOYEES ***")
        console.log("*****************************")
        console.log("")
        console.table(res)
        viewEmployees()
        });
    };

    // function to view all department-wise employee data 
    function viewEmpByDept() {
        dbConnection.query(`
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
        function(err, res) {
        if (err) throw err
        console.log("")
        console.log("*******************************************")
        console.log("*** LIST OF ALL EMPLOYEES BY DEPARTMENT ***")
        console.log("*******************************************")
        console.log("")
        console.table(res)
        viewEmployees()
        });
    };

    // function to view manager-wise employee data
    function viewEmpByManager() {
        dbConnection.query(`
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
        function(err, res) {
        if (err) throw err
        console.log("")
        console.log("****************************************")
        console.log("*** LIST OF ALL EMPLOYEES BY MANAGER ***")
        console.log("****************************************")
        console.log("")
        console.table(res)
        viewEmployees()
        });
    };
};

function departmentAdd() {
    inquirer.prompt([
        {type: 'input',
        name: 'addNewDepartment',
        message: 'What is the name of the department you need to add?'
        }
    ]).then((response)=> {
        let newDeparmentName = response.addNewDepartment;
        console.log(`New department: ` + newDeparmentName);
        dbConnection.query(`INSERT INTO departments (name) VALUES ("${newDeparmentName}");`,
        function(err, res) {
            if (err) throw err
            console.log("")
            console.log("*****************************************")
            console.log("*** NEW DEPARTMENT SUCCESSFULLY ADDED ***")
            console.log("*****************************************")
            console.log("")
            console.table(res)
            viewAllDepartments()
        });
    });
};

function roleAdd() {
    inquirer.prompt([
        {type: 'input',
        name: 'newRoleName',
        message: 'What is the name of the role you need to add?'
        },

        {type: 'input',
        name: 'newRoleSalary',
        message: 'What is the salary of the new role?'
        },

        {type: 'input',
        name: 'newRoleDept',
        message: 'Which department does the new role belong to? Please enter DEPARTMENT ID only.'
        }
    ]).then((response)=> {
        let newRoleName = response.newRoleName;
        let newRoleSalary = response.newRoleSalary;
        let newRoleDept = response.newRoleDept;
        console.log(`New role name: `+ newRoleName);
        console.log(`New role salary: `+ newRoleSalary);
        console.log(`New role department ID: `+ newRoleDept);
        dbConnection.query(`INSERT INTO roles (role_name, salary, department_id) VALUES ("${newRoleName}", ${newRoleSalary}, ${newRoleDept});`,
        function(err, res) {
            if (err) throw err
            console.log("")
            console.log("***********************************")
            console.log("*** NEW ROLE SUCCESSFULLY ADDED ***")
            console.log("***********************************")
            console.log("")
            console.table(res)
            viewAllRoles()
        });
    });
}

async function employeeAdd() {
    const [roles] = await dbConnection.promise().query(`SELECT * FROM roles;`)
    const roleChoices = roles.map(({role_name, id}) => (
        {name: role_name, value: id}
    ));

    const [managers] = await dbConnection.promise().query(`SELECT * FROM employees WHERE manager_id IS NULL;`)
    const managerChoices = managers.map(({first_name, last_name, id}) => (
        {name: first_name + " " + last_name, value: id}
    ));
    
    inquirer.prompt([
        {type: 'input',
        name: 'newEmpFirstName',
        message: 'What is the first name of the employee you need to add?'
        },

        {type: 'input',
        name: 'newEmpLastName',
        message: 'What is the last name of the employee you need to add?'
        },

        {type: 'list',
        name: 'newEmpRole',
        choices: roleChoices,
        message: 'What is the role of the new employee?'
        },

        {type: 'list',
        name: 'isSupervised',
        choices: ['Yes', 'No'],
        message: 'Is the new employee going to be supervised?'
        },

        // {type: 'list',
        // name: 'newEmpManager',
        // choices: managerChoices,
        // message: 'Who is the manager of the new employee?',
        // // when: (answer) => answer.isSupervised === 'Yes'
        // }

    ]).then((response)=> {
        let newEmpFirstName = response.newEmpFirstName;
        let newEmpLastName = response.newEmpLastName;
        let newEmpRole = response.newEmpRole;
        let isSupervised = response.isSupervised;
        console.log(`New employee first name: `+ newEmpFirstName);
        console.log(`New employee last name: `+ newEmpLastName);
        console.log(`New employee role ID: `+ newEmpRole);
        console.log(`Is the new employee supervised: ` + isSupervised);
        if (isSupervised === 'No') {
        dbConnection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${newEmpFirstName}", "${newEmpLastName}", ${newEmpRole}, null);`)
        // viewEmployees();
        } else {
            inquirer.prompt([
                {type: 'list',
                name: 'newEmpManager',
                choices: managerChoices,
                message: 'Who is the manager of the new employee?'
                }
            ]).then((response) => {
                let newEmpManager = response.newEmpManager;
                console.log(`New employee manager ID: `+ newEmpManager);
                dbConnection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${newEmpFirstName}", "${newEmpLastName}", ${newEmpRole}, ${newEmpManager});`)

                // viewEmployees();
            });    
        }
            console.log("")
            console.log("***************************************")
            console.log("*** NEW EMPLOYEE SUCCESSFULLY ADDED ***")
            console.log("***************************************")
            console.log("")
            console.table(response)
            viewEmployees()
            
    });
}


// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
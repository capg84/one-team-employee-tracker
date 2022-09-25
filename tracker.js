// loading node dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const asciiArtLogo = require("asciiart-logo");
const dbConnection = require("./config/connection");

// const PORT = process.env.PORT || 3001;

//   dbConnection.connect(function(err) {
//     if (err) throw err;
   
//     console.log("Connected as ID " + dbConnection.threadId);
//     console.clear();
//     console.log ("============================================");
//     console.log ("");
//     console.log ("   WELCOME TO ONE TEAM EMPLOYEE DATABASE   ");
//     console.log ("");
//     console.log ("============================================");
//     manageOneTeam();
//   }),
// );

// creating manageOneTeam function
function manageOneTeam() {
// prompting the options for the user
inquirer.prompt ([
    {
    type: "list",
    massage: "Please select one option",
    name: "action",
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
        switch(selection.action) {
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
                connection.end();
            break;

        }
    })
};
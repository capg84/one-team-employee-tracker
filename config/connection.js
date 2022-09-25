// Import and require mysql2
const mysql = require("mysql2");
require("dotenv").config();

// Connect to my database
const dbConnection = mysql.createConnection(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    // MySQL username,
    user: DB_USER,
    // MySQL password
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 3306,
  },
  console.log(`Connected to the one_team_employee_db database.`)
);

module.exports = dbConnection;
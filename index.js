const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
  });

  function runProgram(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Deparments",
        "Add Department",
        "End"]
    })
    .then(function(answer){
        console.log(answer)
        if (answer.task === "View Employees"){
          connection.query("SELECT * FROM employee", function(err, result){
            if (err) throw err;
            console.table(result)
            runProgram()
          })
        }
        if (answer.task === "View All Deparments"){
          connection.query("SELECT * FROM department", function(err, result){
            if (err) throw err;
            console.table(result)
            runProgram()
          })
        }
        if (answer.task === "View All Roles"){
          connection.query("SELECT * FROM role", function(err, result){
            if (err) throw err;
            console.table(result)
            runProgram()
          })
        }
        if (answer.task === "Add Department"){
          inquirer
          .prompt({
            type: "input",
            name: "name",
            message: "Would you like name this department?",
          })
          .then(function(data){
            connection.query(`INSERT INTO department (name) VALUES ("${data.name}")`, function(err, result){
              if (err) throw err;
            console.table(result)
            runProgram()
            })
          })
        }
        if (answer.task === "Add Employee"){
          inquirer
          .prompt({
            type: "input",
            name: "name",
            message: "What is the employee info?",
          })
          .then(function(data){
            connection.query(`INSERT INTO employee (title, salary, department_id) VALUES ("${data.title}", ${data.salary}, ${data.department_id})`, function(err, result){
              if (err) throw err;
            console.table(result)
            runProgram()
            })
          })
        }
    })
  }
  runProgram()
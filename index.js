const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
  });

  const roles = {
    1: "Sales Lead",
    2: "Salesperson",
    3: "Lead Engineer",
    4: "Software Engineer",
    5: "Account Manager",
    6: "Accountant",
    7: "Legal Team Lead",
    8: "Lawyer"
  };

  function runProgram(){
    inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Deparments",
        "Add Department",
        "Update Employee Role",
        "Exit"]
    })
    .then(function(answer){
        console.log(answer)
        if (answer.task === "View All Employees"){
          connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id", function(err, result){
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
        if (answer.task === "Add Role"){
          inquirer
          .prompt([
            {
              type: "input",
              name: "title",
              message: "What is the role title?",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the role salary?",
            },
            {
              type: "list",
              name: "department_id",
              message: "What is the department ID?",
              choices: ["1", "2", "3", "4"] 
            }
          ])
          .then(function(data){
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.title}", ${data.salary}, ${data.department_id})`, function(err, result){
              if (err) throw err;
            console.table(result)
            runProgram()
            })
          })
        }
        if (answer.task === "Add Employee"){
          inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is their fist name?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What is their last name?",
            },
            {
              type: "list",
              name: "role_id",
              message: "What is their role ?",
              choices: Object.keys(roles).map(key => ({
                name: `${roles[key]} (${key})`,
                value: key
              }))
            },
            {
              type: "list",
              name: "manager_id",
              message: "What is the manager ID?",
              choices: ["1", "2", "3", "4"] 
            }
          ])
          .then(function(data){
            const roleId = data.role_id;
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.first_name}", "${data.last_name}", ${roleId}, ${data.manager_id})`, 
            function(err, result) {
              if (err) throw err;
              console.table(result)
              runProgram()
            })
          })
        }
      if (answer.task === "Update Employee Role") {
        connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function (err, result) {
          if (err) throw err;

          inquirer
            .prompt({
              type: "list",
              name: "employeeId",
              message: "Which employee would you like to update?",
              choices: result.map(row => ({ name: row.name, value: row.id }))
            })
            .then(function (employeeAnswer) {
              connection.query("SELECT * FROM role", function (err, result) {
                if (err) throw err;

                inquirer
                  .prompt({
                    type: "list",
                    name: "roleId",
                    message: "What is the new role?",
                    choices: result.map(row => ({ name: row.title, value: row.id }))
                  })
                  .then(function (roleAnswer) {
                    connection.query(`UPDATE employee SET role_id = ${roleAnswer.roleId} WHERE id = ${employeeAnswer.employeeId}`, function (err, result) {
                      if (err) throw err;

                      console.log(`Updated employee`);
                      runProgram();
                    });
                  });
              });
            });
        });
        }
        if (answer.task === "Exit"){
          connection.end();
          process.exit(0);
       }
    })
  }
  runProgram()
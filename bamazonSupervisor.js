// The superview module is part of bamazon.
// Supervisors can view product sales for each department.
// They can also add new departments.

// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

// Connects to database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Root is default username.
  user: "root",
  // Password is empty string.
  password: "",
  database: "Bamazon_db"
});

// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Lets supervisor pick action.
  selectAction();

});

// Supervisor selects to view product sales or create department.
var selectAction = function() {
	inquirer.prompt([
	{
		type: 'list',
		name: 'action',
		message: 'What would you like to do?',
		choices: [
			"View Product Sales by Department",
			"Create New Department"
		]
	}
	]).then(function(answer) {

		// Functions called based on supervisor's selection.
		switch (answer.action) {
		    case "View Product Sales by Department":
		    	viewDepartmentSales();
		      	break;

		    case "Create New Department":
		    	createDepartment();
		      	break;
		}
	});
};

// Supervisor views product sales by department.
// The total profit is calculated based on total sales minus overhead costs.
// Total profit added to table using aliases.
var viewDepartmentSales = function() {
	var query = "Select department_id AS department_id, department_name AS department_name," +
				"over_head_costs AS over_head_costs, total_sales AS total_sales," +
				"(total_sales - over_head_costs) AS total_profit FROM departments";
	connection.query(query, function(err, res) {

		if (err) throw err;

		// Product sales displayed in neat table in console.
		console.table(res);
		selectAction();
	});
};

//Supervisor creates new department.
var createDepartment = function() {
		inquirer.prompt([{
		name: "department_name",
		type: "input",
		message: "What is the new department name?"
	}, {
		name: "over_head_costs",
		type: "input",
		message: "What are the overhead costs for this department?"
	}]).then(function(answer) {

		// Department added to departments database.
		connection.query("INSERT INTO departments SET ?", {
			department_name: answer.department_name,
			over_head_costs: answer.over_head_costs
		}, function(err, res) {
			if (err) {
				throw err;
			} else {
				console.log("Your department was added successfully!");
				selectAction();
			}
		});
	});
};

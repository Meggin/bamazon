// Required node modules.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Connects to the database.
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "Bamazon_db"
});


// If connection doesn't work, throws error, else...
connection.connect(function(err) {
  if (err) throw err;

  // Displays list of available products.
  displayProducts();

});

// Displays list of all available products.
var displayProducts = function() {
	var query = "Select * FROM products";
	connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
		}

		// Requests product and number of product items user wishes to purchase.
  		requestProduct();
	});
};

// Requests product and number of product items user wishes to purchase.
var requestProduct = function() {
	inquirer.prompt([{
		name: "productID",
		type: "input",
		message: "Please enter product ID for product you want.",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false;
		}
	}, {
		name: "productUnits",
		type: "input",
		message: "How many units do you want?",
		validate: function(value) {
			if (isNaN(value) === false) {
				return true;
			}
			return false
		}
	}]).then(function(answer) {

		// Query database for selected product.
		var query = "Select stock_quantity, price FROM products WHERE ?";
		connection.query(query, { item_id: answer.productID}, function(err, res) {
			var available_stock = res[0].stock_quantity;
			var price_per_unit = res[0].price;

			// Check there's enough stock to process user's request.
			if (available_stock >= answer.productUnits) {

				// Process user's request passing in data to complete purchase.
				completePurchase(available_stock, price_per_unit, answer.productID, answer.productUnits);
			} else {

				// Tell user there isn't enough stock left.
				console.log("There isn't enough stock left!");

				// Let user request a new product and try again.
				requestProduct();
			}
		});
	});
};


// Complete user's request to purchase product.
var completePurchase = function(availableStock, price, selectedProductID, selectedProductUnits) {
	
	// This will be the updated stock quantity once purchase complete.
	var updatedStockQuantity = availableStock - selectedProductUnits;
	
	// Update stock quantity based on user's purchase.
	var query = "UPDATE products SET ? WHERE ?";
	connection.query(query, [{
		stock_quantity: updatedStockQuantity
	}, {
		item_id: selectedProductID
	}], function(err, res) {

		// Calculate total price for purchase based on unit price, and number of units.
		var totalPrice = price * selectedProductUnits;

		// Tell user purchase a success, and display the total price for that purchase.
		console.log("Yay, your purchase is almost complete. You owe: " + totalPrice);
	});

	// Displays products so user can make a new selection.
	displayProducts();
};


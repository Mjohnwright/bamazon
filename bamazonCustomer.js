var mysql = require("mysql"); //must instal from NPM
var inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Retreat4400",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //   afterConnection(); //terminates the connection so Node is not waiting
});

displayCatalog();

//*********************************************************************************** */
// FUNCTION DISPLAY CATALOG
//function that displays the items available in the store
function displayCatalog() {
  connection.query("SELECT * FROM products", function(err, results) {
    console.log(" ITEM ID ");
    console.log("---------------------------------------------");
    for (var i = 0; i < results.length; i++) {
      var price = results[i].price;
      console.table([
        {
          "Item Id": results[i].item_id,
          "Product Name": results[i].product_name,
          Price: "$" + price.toFixed(2),
          "Stock Quantity": results[i].stock_quantity
        }
      ]);
      console.log("----------------------------------------------");
    }
    start();
  });
}

//********************************************************************************************************** */
// FUNCTION START
//function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var itemIdInNode = answer.productID;
      var quantitySelected = answer.quantity;
 
      connection.query(
        "SELECT * FROM products WHERE item_id = ?",
        [itemIdInNode],
        function(err, results) {
          // console.log("ID: " + itemIdInNode);
          // console.log("QTY: " + quantitySelected);
          // console.log("OUTER RESULTS = " + JSON.stringify(results));
          if (err) throw err;
          var itemIdInNode = answer.productID;
          var quantitySelected = answer.quantity;
          console.log(
            "You would like " + quantitySelected + " pairs of " + results[0].product_name + ", which is Item ID # " + itemIdInNode + ".");

          var isThereEnough = results[0].stock_quantity;

          if (quantitySelected <= isThereEnough) {
            // console.log(
            //   JSON.stringify("Results = " + results[0].stock_quantity)
            // ); // [ RowDataPacket { stock_quantity: 4 } ]

            console.log("Sorry, we have that quantity in stock.  Please choose another item.");
            makePurchase(itemIdInNode, quantitySelected);
          } else {
            console.log("We do not have your order in stock");
            displayCatalog();
          }
        }
      );
    });
}

// ********************************************************************************************
// THIS FUNCTION UPDATES THE DATABASE STOCK QUANTITY REFELECTING THE USER PURCHASE
// FUNCTION MAKEPURCHASE
function makePurchase(itemIdInNode, quantitySelected) {
  connection.query(
    "UPDATE PRODUCTS SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantitySelected, itemIdInNode],
    function(err, results) {
      if (err) throw err;
      // displayCatalog();
      userReceipt(itemIdInNode, quantitySelected);
    }
  );
}

/********************************************************************************* */
// FUNCTION USERRECEIPT
// function that displays user receipt after DB is updates
function userReceipt(itemIdInNode, quantitySelected) {
  connection.query(
    "SELECT * FROM products WHERE item_id = ?",
    [itemIdInNode],
    function(err, results) {
      if (err) throw err;
      // results = JSON.stringify(results);
      price = results[0].price;
      total = price * quantitySelected;
      console.log("Your final cost for today is:");
      console.table([
        {
          "Item Id": results[0].item_id,
          "Product Name": results[0].product_name,
          "Quanity Selected": quantitySelected,
          Price: "$" + price.toFixed(2),
          TOTAL: "$" + total.toFixed(2)
        }
      ]);
      console.log("Thank you for shopping with Bamazon!");
      connection.end();
    }
  );
}

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Created db in MySql called 'bamazon'
// created table in bamazon called 'products'
// added  10 items to the table 'products'
// created Node application called bamazonCustomer.js

// required inquirer and MySql npms and assigned them variables.

// established connection with the MySql Server

// Initialize App
//   function to display the DB and call the start function

// Start Function
//   displays a question asking user for product ID
//   assign a variable to their answer
//   displays a second question asking how many units they want to buy;
//   assign a varianble to their answer.

// checkOrder function
//   compared the 2 answers with database to see if item is in stock;
//     IF the item is not in stock display "insufficient quantity" and call initialize app function;
//

//  IF the item IS in stock then:
//         This means updating the SQL database to reflect the remaining quantity.
//         Once the update goes through, show the customer the total cost of their purchase.
//         Initialize db function;

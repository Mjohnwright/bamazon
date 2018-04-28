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
    console.log("---------------------------------------------");
    for (var i = 0; i < results.length; i++) {
      var price = results[i].price;
      console.table([
        {
          "Item Id": results[i].item_id,
          "Product Name": results[i].product_name,
          Price: "$" + price.toFixed(2),
          // "Stock Quantity": results[i].stock_quantity
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
          if (err) throw err;
          var itemIdInNode = answer.productID;
          var quantitySelected = answer.quantity;
          console.log(
            "You would like " +
              quantitySelected +
              " pairs of " +
              results[0].product_name +
              ", which is Item ID # " +
              itemIdInNode +
              "."
          );

          var isThereEnough = results[0].stock_quantity;

          if (quantitySelected <= isThereEnough) {
            // console.log(
            //   JSON.stringify("Results = " + results[0].stock_quantity)
            // ); // [ RowDataPacket { stock_quantity: 4 } ]

            console.log("Great new!  We have that quantity in stock.  ");
            // setTimeout(makePurchase(itemIdInNode, quantitySelected), 3000); //THIS DOES NOT WORK!
            // setTimeout(makePurchase(itemIdInNode, quantitySelected), 3000); //THIS DOES NOT WORK!
            // makePurchase(itemIdInNode, quantitySelected);

            makePurchase(itemIdInNode, quantitySelected);
          } else {
            console.log(
              "We are sorry.  We do not have your order in stock.  Please choose another item."
            );
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

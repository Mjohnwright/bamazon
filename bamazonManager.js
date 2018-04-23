var mysql = require("mysql"); //must instal from NPM
var inquirer = require("inquirer");
var cTable = require("console.table");
var prompt = require("prompt");

prompt.start();

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
  managerView();
});

//********************************************************************************************************** */
// FUNCTION START
//function which prompts the user for what action they should take
function managerView() {
  inquirer
    .prompt([
      {
        name: "managerMenu",
        type: "rawlist",
        message: "Hello, what would you like to do??",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add new Product"
        ],
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(value) {
      console.log(value);
      switch (value.managerMenu) {
        //    console.log(value);
        case "View Products for Sale":
          console.log("You chose 1");
          viewProductsforSale();
          break;
        case "View Low Inventory":
          console.log("You chose 2");
          viewLowInventory();
          break;
        case "Add to Inventory":
          console.log("You chose 3");
          addToInventory();
          break;
        case "Add new Product":
          console.log("You chose 4");
          addNewProduct();
      }
    });
}

//*********************************************************************************** */
// FUNCTION DISPLAY CATALOG
//function that displays the items available in the store
function viewProductsforSale() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
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
  });
  connection.end();
}

//*********************************************************************************** */
// FUNCTION VIEW LOW INVENTORY
//function that displays where inventory is low
function viewLowInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 30", function(
    err,
    results
  ) {
    if (err) throw err;
    console.log("These are the products with less than 30 items in stock")
    for (var i = 0; i < results.length; i++) {
      console.table([
        {
          "Item Id": results[i].item_id,
          "Product Name": results[i].product_name,
          "Stock Quantity": results[i].stock_quantity
        }
      ]);
    }
  });
  connection.end();
}

//*********************************************************************************** */
// FUNCTION ADD TO INVENTORY
//function that enables manager to add more products to exisiting product line
function addToInventory() {
  console.log("Add new Inventory to the store");
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message:
          "What is the name of the product you would like to add to the inventory?"
      },
      {
        name: "productQuantity",
        type: "input",
        message: "How many pairs would you like to add?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      var productInNode = answer.productName;
      var quantityInNode = answer.productQuantity;

      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?",
        [quantityInNode, productInNode],
        function(err, results) {
          if (err) throw err;





          // console.log("The updated quantity for " + ProductInNode + " is: " + quantityInNode);  WHY DOES THIS CAUSE AN ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
      );
    });
    myFunction();
    var delay;
    function myFunction() {
      delay = setTimeout(purchase, 10000);
    }

    function purchase() {
      viewProductsforSale(); //  THIS IS NO GOOD SINCE I AM WAITING FOR THE USER INPUT...NOT A TIME LAPSE
      
    }


  // connection.end();
}

//*********************************************************************************** */
// FUNCTION ADD NEW PRODUCT
//function that enables manager to add a new product to inventory
function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message:
          "What is the name of the product you would like to add to the Product Line?"
      },
      {
        name: "productQuantity",
        type: "input",
        message: "How many pairs would you like to add to the Product Line?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "productPrice",
        type: "input",
        message: "What is the price you want to set?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "productDepartment",
        type: "input",
        message: "What Department will the new Product be listed in?"
      }
    ])
    .then(function(answer) {
      var productInNode = answer.productName;
      var quantityInNode = answer.productQuantity;
      var priceInNode = answer.productPrice;
      var departmentInNode = answer.productDepartment;

      connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)",
        [productInNode, departmentInNode, priceInNode, quantityInNode],
        

        function(err, results) {
        }
      );
      

    });
}

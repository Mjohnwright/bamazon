# :department_store: Bamazon!

### Overview
Amazon-like storefront using MySQL and Node.js. It is comprised of two apps - one for customer orders and one for manager actions.

### Functionality

* BamazonCustomer:
    ** Displays a table with the current store inventory
    ** Takes a customer's order
    ** Computes the cost and prints a receipt
    ** Updates the inventory subtracting the latest purchase

* BamazonManager 
    ** View current inventory
    ** View low inventory (set to < 20)
    ** Add to Inventory
    ** Add a new product line

### Technology

* MySql: Relational Database
* JavaScript: Functional program for logic
* Using the following NPM add-ons:
    ** var inquirer = require("inquirer") for asking the user questions
    ** var cTable = require("console.table") for organizing and displaying the console output neatly.

### Video Link
<strong>[Bamazon store app](https://drive.google.com/open?id=1myM5Ycymp9T8ULY79YtZSIFycjTSSPl3)</strong>

### Screenshot
![Full Size](assets/bamazon.png)


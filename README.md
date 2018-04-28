
MySQL-Node-Bamazon

Amazon-like storefront using MySQL and Node.js. It is comprised of two apps - one for customer orders and one for manager actions.

BamazonCustomer:

displays a table with the inventory
takes a customer's order
computes the cost
depletes the stock from the store's inventory
BamazonManager - allows a manager to:

View Products for Sale
View Low Inventory
Add to Inventory
Add New Product
Delete a Product

Using the following NPM add-ons:
var inquirer = require("inquirer") for asking the user questions
var cTable = require("console.table") for organizing and displaying the console output neatly.

Link to the video demonstrating the Bamazon:
https://drive.google.com/open?id=1myM5Ycymp9T8ULY79YtZSIFycjTSSPl3
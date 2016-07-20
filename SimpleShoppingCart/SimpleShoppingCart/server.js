"use strict";

var constFolderPublic = ""; //"/public";
var constFolderNodeModules = "/node_modules";
var serverPortToListen = "3000";

var express = require("express");
var app = express();

app.use(
    constFolderPublic,
    express.static(__dirname + constFolderPublic)
);

app.use(
    constFolderNodeModules,
    express.static(__dirname + constFolderNodeModules)
);
//-----------------------------------------------------------------------
//GET
//app.get("/", function (req, res) {
//    res.sendFile(
//                "main.html",
//                { "root": __dirname + constFolderPublic }
//            )
//});

//-----------------------------------------------------------------------
//API SPECIFIC
//GET
app.get("/api/product", function (req, res) {
    var jsonObj = require(__dirname + "/fake-database/products.json");
    res.json(jsonObj);
});
//-----------------------------------------------------------------------
//API SPECIFIC
//POST
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.post("/api/cart/calculateTaxes", function (req, res) {
    var products = req.body;
    var subtotal = 0; var tax = 0;
    products.forEach(function (item) {
        subtotal += item.UnitCost;
        //Henry, I am using tax by product because some countries might have a different tax % for a tabaco products, for instance.
        tax += item.UnitCost * (item.Tax / 100);
    });
    res.send(
        {
            subtotal: subtotal,
            tax: tax,
            total: subtotal + tax
        }
    );
});
//-----------------------------------------------------------------------
app.listen(
    serverPortToListen,
        function () {
            console.info("-------------------------------");
            console.info("__dirname: " + __dirname);
            console.info("-------------------------------");
            console.info("Server read to listen at http://localHost:" + serverPortToListen);
        }
);
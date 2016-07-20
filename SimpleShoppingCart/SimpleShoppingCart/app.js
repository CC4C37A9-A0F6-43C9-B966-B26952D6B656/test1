﻿"use strict";

var myFirstKorporateKApp = angular.module("myFirstKorporateKApp", ["ui.router"]);

myFirstKorporateKApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");//will redirect unknow urls to home

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state("home", {
            url: "/home",
            templateUrl: "/templates/products.html",
            controller: "homeController"
        })
        .state("checkout", {
            url: "/checkout",
            templateUrl: "/templates/checkout.html",
            controller: "cartController"
        })
})

myFirstKorporateKApp.factory("dataBaseFactory", ["$http", function ($http) {
    var serviceUrl = "/api/product";
    var dataFactory = {};
    dataFactory.geProducts = function () {
        return $http.get(serviceUrl);
    };
    return dataFactory;
}]);

//in memory cart
myFirstKorporateKApp.factory("cartFactory", ["$http", function ($http) {
        var dataFactory = {};
        var inMemoryCart = {};
        inMemoryCart.list = [];
        dataFactory.getAll = function () {
            //console.info("reading inMemoryCart...");
            return inMemoryCart.list;
        };
        dataFactory.add = function (product) {
            //if (!inMemoryCart.list.contains(product)) {
            inMemoryCart.list.push(product);
            //console.info("added length= " + inMemoryCart.list.length);
            //}
        };
        dataFactory.remove = function (product) {
            inMemoryCart.list.splice(
                inMemoryCart.list.indexOf(product),
                1
            );
        };

        dataFactory.calculateTaxes = function () {
            return $http.post("/api/cart/calculateTaxes", dataFactory.getAll());
            //$http.post("/api/cart/calculateTaxes", dataFactory.getAll()).success(function (data) {
            //    console.info(data);
            //    console.info("**********************");
            //    return data;
            //}).error(function (data) {
            //    console.info("----------- error: " + data);
            //});
        };

        return dataFactory;    

}]);

myFirstKorporateKApp.controller("homeController", ["$scope", "cartFactory", "dataBaseFactory",
    function ($scope, cartFactory, dataBaseFactory) {

    getProducts();

    //get database products
    function getProducts() {
        dataBaseFactory.geProducts()
            .then(function (response) {
                //console.info(response.data.products);
                $scope.Products = response.data.products;
            }, function (error) {
                $scope.message = {
                    success: false,
                    text: "Well this is embarrassing. We can't process your request :"
                    + error.message
                };
            });
    }

    $scope.cartAdd = function (product) {
        //console.info("trying to add");
        cartFactory.add(product);
        //toaster.pop('success', '', 'added to cart');
    };
    }]);

myFirstKorporateKApp.controller("cartController", ["$scope","$http", "cartFactory",
    function ($scope,$http, cartFactory) {
    //remove from in memory cart
    $scope.cartRemove = function (product) {
        console.info("trying to remove");
        cartFactory.remove(product);
        $scope.CalculateTaxes();
    };        

    //calculate taxes
    $scope.CalculateTaxes = function () {
        console.info("trying to CalculateTaxes");

        cartFactory.calculateTaxes()
            .then(function (response) {
                $scope.subTotal = response.data.subtotal;
                $scope.tax = response.data.tax;
                $scope.total = response.data.total;
                console.info("COMPLETED..............")
            }, function (error) {
                $scope.message = {
                    success: false,
                    text: "Well this is embarrassing. We can't process your request :"
                    + error.message
                };
            });

    };

    $scope.CalculateTaxes();

    //on page load
    $scope.subTotal = 0;
    $scope.tax = 0;
    $scope.total = 0;

    $scope.ProductsOnCart = cartFactory.getAll();

}]);

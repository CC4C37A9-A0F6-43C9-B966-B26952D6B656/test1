"use strict";

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
        // nested list with custom controller
        .state("home.list", {
            url: "/list",
            templateUrl: "/templates/partial-home-list.html",
            controller: function ($scope) {
                $scope.dogs = ["Bernese", "Husky", "Goldendoodle"];
            }
        })
        // nested list with just some random string data
        .state("home.paragraph", {
            url: "/paragraph",
            template: "I could sure use a drink right now."
        })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state("about", {
            url: "/about",
            views: {
                // the main template will be placed here (relatively named)
                "": { templateUrl: "/templates/partial-about.html" },

                // the child views will be defined here (absolutely named)
                "columnOne@about": { template: "Look I am a column!" },

                // for column two, we"ll define a separate controller
                "columnTwo@about": {
                    templateUrl: "/templates/table-data.html",
                    controller: "scotchController"
                }
            }
        });// closes $myFirstKorporateKApp.config()
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
myFirstKorporateKApp.factory("productsOnCart", ["$http", function ($http) {
        var dataFactory = {};
        var inMemoryCart = {};
        inMemoryCart.list = [];
        dataFactory.getAll = function () {
            console.info("reading inMemoryCart...");
            return inMemoryCart.list;
        };
        dataFactory.add = function (product) {
            //if (!inMemoryCart.list.contains(product)) {
            inMemoryCart.list.push(product);
            console.info("added length= " + inMemoryCart.list.length);
            //}
        };
        dataFactory.remove = function (product) {
            var index = inMemoryCart.list.indexOf(product);
            inMemoryCart.list.splice(index, 1);
        };

        return dataFactory;    

}]);

myFirstKorporateKApp.controller("homeController", ["$scope", "productsOnCart", "dataBaseFactory",
    function ($scope, productsOnCart, dataBaseFactory) {

    getProducts();

    //get database products
    function getProducts() {
        dataBaseFactory.geProducts()
            .then(function (response) {
                console.info(response.data.products);
                $scope.Products = response.data.products;
            }, function (error) {
                $scope.message = {
                    success: false,
                    text: "Well this is embarrassing. We can't process your request :"
                    + error.message
                };
            });
    }

    //add product to in memory cart
    //$scope.cartAdd_BACKUP = function (product) {
    //    console.info("trying to add");
    //    productsOnCart.add(product);
    //    //toaster.pop('success', '', 'added to cart');
    //};
    $scope.cartAdd = function (product) {
        console.info("trying to add");
        productsOnCart.add(product);
        //toaster.pop('success', '', 'added to cart');
    };
    }]);

myFirstKorporateKApp.controller("cartController", ["$scope", "productsOnCart",
    function ($scope, productsOnCart) {

    //on page load
    $scope.subTotal = 0;
    $scope.tax = 0;
    $scope.total = 0;
    $scope.ProductsOnCart = productsOnCart.getAll();
    //-----------------------
    //remove from in memory cart
    $scope.RemoveToCart = function (product) {
        console.info("trying to remove");
        productsOnCart.remove(product);
        //this.CalculateTaxes($scope.ProductsOnCart);
    };        



    }]);

 //let"s define the scotch controller that we call up in the about state
//myFirstKorporateKApp.controller("scotchController",
//    function ($scope) {
//    $scope.message = "test";
//    $scope.scotches = [
//        {
//            name: "Macallan 12",
//            price: 50
//        },
//        {
//            name: "Chivas Regal Royal Salute",
//            price: 10000
//        },
//        {
//            name: "Glenfiddich 1937",
//            price: 20000
//        }
//    ];
//});
"use strict";



var routerApp = angular.module("routerApp", ["ui.router"]);

routerApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");//will redirect unknow urls to home

    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state("home", {
            url: "/home",
            templateUrl: "/templates/partial-home.html",
            controller: "homeController"
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
        });// closes $routerApp.config()
})

routerApp.factory("dataFactory", ["$http", function ($http) {
    var serviceUrl = "/api/product";
    var dataFactory = {};
    dataFactory.getDatabaseProducts = function () {
        return $http.get(serviceUrl);
    };
    return dataFactory;
}]);


 //let"s define the scotch controller that we call up in the about state
routerApp.controller("scotchController", function ($scope) {
    $scope.message = "test";
    $scope.scotches = [
        {
            name: "Macallan 12",
            price: 50
        },
        {
            name: "Chivas Regal Royal Salute",
            price: 10000
        },
        {
            name: "Glenfiddich 1937",
            price: 20000
        }
    ];
});

routerApp.controller("homeController", ["$scope", "dataFactory", function ($scope, dataFactory) {
    getProducts();

    function getProducts() {
        dataFactory.getDatabaseProducts().then(function (response) {
            $scope.products = response.data;
        }, function (error) {
            $scope.status =
                "Well this is embarrassing. We can't process your request :"
                + error.message;
        })
    }
}]);
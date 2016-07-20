//"use strict";



//var cartApp = angular.module("cart")
    //.controller('scotchController', function ($scope) {
    routerApp.controller("scotchController", ["$scope", "$http", function ($scope, $http) {

    $scope.message = 'test';

    $scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
}]);
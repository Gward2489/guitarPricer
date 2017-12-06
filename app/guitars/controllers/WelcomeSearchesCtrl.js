angular
.module("GuitarPricerApp")
.controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory) {

    $scope.getBasicPrice = function () {
        console.log("hey")
        GuitarFactory.basicSearch()
    }

})
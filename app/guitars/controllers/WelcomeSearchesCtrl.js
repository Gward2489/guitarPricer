angular
.module("GuitarPricerApp")
.controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory, $location) {
 
    $scope.getBasicPrice = function (searchInput) {
        let convertedSearch = searchInput.replace(/  /g, "+").replace(/ /g, "+")
        GuitarFactory.basicSearch(convertedSearch)
        console.log(convertedSearch)
    }

    $scope.toAdvancedSearch = function () {
        $location.url("/guitars/advancedSearch")
    }

})
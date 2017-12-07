angular
.module("GuitarPricerApp")
.controller("UserHomePageCtrl", function ($scope, GuitarFactory) {

    
    $scope.getBasicPrice = function (searchInput) {
        let removedDoublespaces = searchInput.replace(/  /g, "+")
        let convertedSearch = removedDoublespaces.replace(/ /g, "+")
        GuitarFactory.basicSearch(convertedSearch)
        console.log(convertedSearch)
    }

})
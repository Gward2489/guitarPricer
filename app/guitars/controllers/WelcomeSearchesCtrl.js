angular
.module("GuitarPricerApp")
.controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory) {

    

    $scope.getBasicPrice = function (searchInput) {
        let removedDoublespaces = searchInput.replace(/  /g, "+")
        let convertedSearch = removedDoublespaces.replace(/ /g, "+")
        GuitarFactory.basicSearch(convertedSearch)
        console.log(convertedSearch)
    }

})
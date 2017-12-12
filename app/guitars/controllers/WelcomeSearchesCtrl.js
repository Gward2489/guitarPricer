angular
.module("GuitarPricerApp")
.controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory, $location) {
    
    $scope.resultsArray = []
    $scope.userSearchTitle = ""

    $scope.getBasicPrice = function (searchInput) {
        $scope.userSearchTitle = searchInput
        let convertedSearch = searchInput.replace(/  /g, "+").replace(/ /g, "+")
        GuitarFactory.basicSearch(convertedSearch).then(results => {
            $scope.resultsArray = results
            console.log($scope.resultsArray)
        })      
    }


    $scope.toAdvancedSearch = function () {
        $location.url("/guitars/advancedSearch")
    }

})
angular
    .module("GuitarPricerApp")
    .controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory, $location) {
    
        $scope.resultsArray = []
        $scope.userSearchTitle = ""

        $scope.isItTrue = function (objProp) {
            if (objProp !== false) {
                return true
            } else {
                return false
            }
        }

        $scope.isItFalse = function (objProp) {
            if (objProp === false) {
                return true
            } else {
                return false 
            }
        }

        $scope.getBasicPrice = function (searchInput) {
            $scope.userSearchTitle = searchInput
            let convertedSearch = searchInput.replace(/ {2}/g, "+").replace(/ /g, "+")
            GuitarFactory.basicSearch(convertedSearch).then(results => {
                $scope.resultsArray = results
                console.log($scope.resultsArray)
            })      
        }


        $scope.toAdvancedSearch = function () {
            $location.url("/guitars/advancedSearch")
        }

    })
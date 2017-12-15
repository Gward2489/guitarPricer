angular
    .module("GuitarPricerApp")
    .controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory, $location) {
    
        $scope.loading = false
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
            $scope.loading = true
            $scope.userSearchTitle = searchInput
            let convertedSearch = searchInput.replace(/ {2}/g, "+").replace(/ /g, "+")
            GuitarFactory.basicSearch(convertedSearch).then(results => {
                $scope.loading = false
                $scope.resultsArray = results
            })      
        }


        $scope.toAdvancedSearch = function () {
            $location.url("/guitars/advancedSearch")
        }

    })
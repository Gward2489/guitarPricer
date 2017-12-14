angular
    .module("GuitarPricerApp")
    .controller("AdvancedSearchCtrl", function($scope, $location, GuitarFactory) {

    
        $scope.conditionValues = ["Excellent", "Good", "Usable"]
        
        $scope.mainPrices = {}
        $scope.yearPrices = {}
        $scope.conditionPrices = {}
        $scope.finishPrices = {}

        $scope.toBasicSearch = function () {
            $location.url("/guitars/welcomePage")
        }
    
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
        
        $scope.isItMain = function (priceCategory) {
            if (priceCategory === "main") {
                return true
            } else {
                return false
            }
        }

        $scope.isItYear = function (priceCategory) {
            if (priceCategory === "year") {
                return true
            } else {
                return false
            }
        }

        $scope.isItFinish = function (priceCategory) {
            if (priceCategory === "finish") {
                return true
            } else {
                return false
            }
        }

        $scope.isItCondition = function (priceCategory) {
            if (priceCategory === "condition") {
                return true
            } else {
                return false
            }
        }

        $scope.searchedGuitarYear = ""
        $scope.searchedGuitarCondition = ""
        $scope.searchedGuitarFinish = ""

        $scope.makeScopes = function (priceArray) {
            priceArray.forEach(function (price) {
                if (price.priceCategory === "main") {
                    $scope.mainPrices = price
                }
                if (price.priceCategory === "year") {
                    $scope.yearPrices = price
                }
                if (price.priceCategory === "condition") {
                    $scope.conditionPrices = price
                }
                if (price.priceCategory === "finish") {
                    $scope.finishPrices = price
                }
            })
        }

        $scope.searchResults = []
        $scope.getAdvancedPrice = function (guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {
        
            $scope.searchedGuitarYear = year
            $scope.searchedGuitarCondition = condition
            $scope.searchedGuitarFinish = finish
        

            $scope.guitarUserSearchedFor = guitarBrand + " " + guitarModel

            GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel, 
                acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass).then(data => {
                $scope.searchResults = data
                console.log(data)
                $scope.makeScopes(data)
            })

        }
    })
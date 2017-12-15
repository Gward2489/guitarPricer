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

        $scope.isItCountry = function (priceCategory) {
            if (priceCategory === "country") {
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
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
            
            $scope.searchedGuitarYear = year
            $scope.searchedGuitarCondition = condition
            $scope.searchedGuitarFinish = finish
            $scope.searchedGuitarCountry = country

            if (year === undefined || ""|| "  ") {
                $scope.searchedGuitarYear = "n/a"
            }

            if (finish === undefined || "" || "  ") {
                $scope.searchedGuitarFinish = "n/a"
            }

            if (country === undefined || "" || "  ") {
                $scope.searchedGuitarCountry = "n/a"
            }
        
            $scope.guitarUserSearchedFor = guitarBrand + " " + guitarModel

            if (guitarBrand !== undefined && guitarModel !== undefined && guitarOrBass !== undefined && condition !== null && vintageCheck !== undefined) {
                GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, $scope.searchedGuitarFinish, $scope.searchedGuitarYear, guitarOrBass, $scope.searchedGuitarCountry).then(data => {
                    $scope.searchResults = data
                    $scope.makeScopes(data)
                })
            } else {
                alert("please complete all required fields")
            }

        }
    })
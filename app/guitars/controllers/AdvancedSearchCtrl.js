angular
.module("GuitarPricerApp")
.controller("AdvancedSearchCtrl", function($scope, $location, GuitarFactory) {


    $scope.conditionValues = ["Excellent", "Good", "Usable"]

    $scope.toBasicSearch = function () {
        $location.url('/guitars/welcomePage')
    }

    $scope.searchResults = []
    $scope.getAdvancedPrice = function (guitarBrand, guitarModel, 
        acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {
        
        $scope.guitarUserSearchedFor = guitarBrand + " " + guitarModel

        GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass).then(data => {
                $scope.searchResults = data
                console.log(data)
            })

        }
})
angular
.module("GuitarPricerApp")
.controller("AdvancedSearchCtrl", function($scope, $location, GuitarFactory) {


    $scope.conditionValues = ["Excellent", "Good", "Usable"]

    $scope.toBasicSearch = function () {
        $location.url('/guitars/welcomePage')
    }

    
    $scope.getAdvancedPrice = function (guitarBrand, guitarModel, 
        acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {
        GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass)
    }
})
angular
    .module("GuitarPricerApp")
    .controller("GuitarIntakeCtrl", function($scope, $location, UserGearFactory) {

        $scope.conditionValues = ["Excellent", "Good", "Usable"]

        $scope.storeGuitarInfo = function (guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
        
            let guitarObject = UserGearFactory.createGuitarObject(guitarBrand, guitarModel, 
                acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country)

            UserGearFactory.storeGuitar(guitarObject)
        }

    })
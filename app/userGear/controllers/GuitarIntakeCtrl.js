angular
    .module("GuitarPricerApp")
    .controller("GuitarIntakeCtrl", function($scope, $location, UserGearFactory) {


        $scope.conditionValues = ["Excellent", "Good", "Usable"]

        

        $scope.storeGuitarInfo = function (guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
                
            $scope.searchedGuitarYear = year
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

            if (guitarBrand !== undefined && guitarModel !== undefined && guitarOrBass !== undefined && condition !== null && vintageCheck !== undefined) {
                let guitarObject = UserGearFactory.createGuitarObject(guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, $scope.searchedGuitarFinish, $scope.searchedGuitarYear, guitarOrBass, $scope.searchedGuitarCountry)

                UserGearFactory.storeGuitar(guitarObject)
            } else {
                alert("please fill out all required fields")
            }
        }

    })
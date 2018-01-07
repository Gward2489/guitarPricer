angular
    .module("GuitarPricerApp")
    .controller("GuitarIntakeCtrl", function($scope, $route, $location, UserGearFactory) {

        // array to hold string data for the title of guitar
        // condition options
        $scope.conditionValues = ["Excellent", "Good", "Usable"]

        // define a function to store a new guitar into the users
        // collection of tracked guitars
        $scope.storeGuitarInfo = function (guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
            // store the user entries for the optional entries into variables
            $scope.searchedGuitarYear = year
            $scope.searchedGuitarFinish = finish
            $scope.searchedGuitarCountry = country
            // use if statements to see if the user left any of the optional
            // fields blank, and if so, store the string 'n/a' into the
            // corresponding variable
            if (year === undefined || year === "" || year === " ") {
                $scope.searchedGuitarYear = "n/a"
            }
    
            if (finish === undefined || finish === "" || finish === " ") {
                $scope.searchedGuitarFinish = "n/a"
            }
    
            if (country === undefined || country === "" || country === " ") {
                $scope.searchedGuitarCountry = "n/a"
            }

            // use an if statement to make sure the user completed all 
            // required fields to enter a new guitar into their collection
            if (guitarBrand !== undefined && guitarModel !== undefined && guitarOrBass !== undefined && condition !== null && vintageCheck !== undefined) {
                // invoke the create guitar object function from the 
                // user gear factory to make an object representing
                // a detailed description of the users guitar
                let guitarObject = UserGearFactory.createGuitarObject(guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, $scope.searchedGuitarFinish, $scope.searchedGuitarYear, guitarOrBass, $scope.searchedGuitarCountry)
                
                // invoke the store guitar function from the user gear
                // factory, and pass in the newly created guitar object
                // to send the user's new guitar to firebase and add
                // it to their collection
                UserGearFactory.storeGuitar(guitarObject)
            // if the user did not complete all of the required fields
            // let them know. ᕙ (° ~͜ʖ~ °) ᕗ
            } else {
                alert("please fill out all required fields")
            }
        }
    })
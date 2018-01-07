angular
    .module("GuitarPricerApp")
    .controller("AdvancedSearchCtrl", function($scope, $location, GuitarFactory) {

        // create a variable set to boolean false. It will be set to true
        // when search results are returned and used with ng-if
        // to display search results
        $scope.showResultsTitle = false

        // create a variable set to boolean false. It will be set to true 
        // after a search is initiated and then set to false again when 
        // the search is completed. It will be used with ng-if to display
        // the 'loading results' icon before the search data is delivered
        $scope.loading = false

        // create an array that holds strings representing the titles of
        // guitar condition options.
        $scope.conditionValues = ["Excellent", "Good", "Usable"]
        // create empty variables to hold the price objects 
        // returned by the search
        $scope.mainPrices = {}
        $scope.yearPrices = {}
        $scope.conditionPrices = {}
        $scope.finishPrices = {}

        // define a variable that will hold a function that will 
        // route to the welcomePage(basic search partial)
        $scope.toBasicSearch = function () {
            $location.url("/guitars/welcomePage")
        }
    
        // define a variable that will hold a function that returns a boolean
        // value. It will return true if the object property passed in holds
        // anything other than false. Otherwise the function will return 
        // boolean false.
        // this function will be used with ng-if within an ng-repeat to 
        // only print prices categories to the dom that contain succesfull
        // search results.
        $scope.isItTrue = function (objProp) {
            if (objProp !== false) {
                return true
            } else {
                return false
            }
        }

        // define a variable to hold a function that returns true
        // if object property passed in to the function holds the 
        // boolean value false. If the property holds anything else
        // it will return true
        // This function will be used with ng-if within ng-repeat to hide
        // price categories that had no search results returned.
        $scope.isItFalse = function (objProp) {
            if (objProp === false) {
                return true
            } else {
                return false 
            }
        }
        
        // define a variable holding a function that returns true if the 
        // parameter passed in containes a string value of 'main'. Otherwise 
        // it returns false. 
        // this function will be used ng-if within ng-repeat to check for
        // the title of the price category and display the proper correspinding
        // title text if it is the main price category
        $scope.isItMain = function (priceCategory) {
            if (priceCategory === "main") {
                return true
            } else {
                return false
            }
        }

        // same purpose as isItMain function for country category
        $scope.isItCountry = function (priceCategory) {
            if (priceCategory === "country") {
                return true
            } else {
                return false
            }
        }

        // same purpose as isItMain function for year category        
        $scope.isItYear = function (priceCategory) {
            if (priceCategory === "year") {
                return true
            } else {
                return false
            }
        }

        // same purpose as isItMain function for finish category        
        $scope.isItFinish = function (priceCategory) {
            if (priceCategory === "finish") {
                return true
            } else {
                return false
            }
        }

        // same purpose as isItMain function for condition category        
        $scope.isItCondition = function (priceCategory) {
            if (priceCategory === "condition") {
                return true
            } else {
                return false
            }
        }

        // create variables that hold empty strings. These variable will
        // be filled with string data containing the year, condition, and finish
        // of the guitar the user searched for
        $scope.searchedGuitarYear = ""
        $scope.searchedGuitarCondition = ""
        $scope.searchedGuitarFinish = ""

        // define a variable that holds a function that will itterate through
        // the array of prices returned by the search and fill the prefined
        // price variables with their corresponding price data.
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

        // create an empty array to hold the search results
        $scope.searchResults = []

        // define the a variable to hold a function that will retreive search
        // results for the user entered data. This function takes in several
        // varaibales as parameters defined by two way binding with input fields
        // in the html. 
        $scope.getAdvancedPrice = function (guitarBrand, guitarModel, 
            acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
            // set loading variable to true to display loading icon   
            $scope.loading = true
            // fill predefined variables with corresponding user entered data
            $scope.searchedGuitarYear = year
            $scope.searchedGuitarCondition = condition
            $scope.searchedGuitarFinish = finish
            $scope.searchedGuitarCountry = country

            // define if statments that set that data of predefined variables to
            // 'n/a' if the user did not enter anything into the input field
            // correspinding with the variable
            if (year === undefined || year === "" || year === " ") {
                $scope.searchedGuitarYear = "n/a"
            }

            if (finish === undefined || finish === "" || finish === " ") {
                $scope.searchedGuitarFinish = "n/a"
            }

            if (country === undefined || country === "" || country === " ") {
                $scope.searchedGuitarCountry = "n/a"
            }
        
            // fill predefined variable holding the full title of the guitar the
            // user searche for
            $scope.guitarUserSearchedFor = guitarBrand + " " + guitarModel

            // create an if statement to check if the user entered all required fields
            if (guitarBrand !== undefined && guitarModel !== undefined && guitarOrBass !== undefined && condition !== null && vintageCheck !== undefined) {
                // invoke the advanced search filter function from the guitar factory
                GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, $scope.searchedGuitarFinish, $scope.searchedGuitarYear, guitarOrBass, $scope.searchedGuitarCountry).then(data => {
                    // after search data is delivered, fill predefined
                    // variable with search results
                    $scope.searchResults = data
                    // remove loading icon
                    $scope.loading = false
                    // reveal results
                    $scope.showResultsTitle = true
                    // invoke makeScopes function to fill predefined variables
                    // with search results categories, if those categories
                    // returned data. ng-if uses the category checking functions
                    // defined at the top of the controller to show only
                    // price categories that returned search data. 
                    $scope.makeScopes(data)
                })
            } else {
                // remove loading icon
                $scope.loading = false
                // if the user did not complete all required fields.
                // TELL THEM TO FINISH THE QUESTIONS! ( ͡◉ ͜ʖ ͡◉)
                alert("please complete all required fields")
            }

        }
    })
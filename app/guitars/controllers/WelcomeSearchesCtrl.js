angular
    .module("GuitarPricerApp")
    .controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory, $location) {
    
        // variable that hold boolean value used with ng-if to show
        // loading icon when async events are happening
        $scope.loading = false
        // define empty variable to hold array of results prices
        $scope.resultsArray = []
        // empty variable to hold title of guitar user searched for
        $scope.userSearchTitle = ""

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

        // define variable that holds a function that will handle all
        // basic possible events needed when basic search button is clicked
        $scope.getBasicPrice = function (searchInput) {
            //show loading icon
            $scope.loading = true
            // fill predefined variable with user search data
            // passed into the function
            $scope.userSearchTitle = searchInput
            // replace spaces with plus signs within the users search input.
            // this is done so the string may be passed into the ebay API call
            let convertedSearch = searchInput.replace(/ {2}/g, "+").replace(/ /g, "+")
            // invoke basicSearch from the guitar factory.
            GuitarFactory.basicSearch(convertedSearch).then(results => {
                // remove loading icon
                $scope.loading = false
                // fill predefined array with results data returned from function
                $scope.resultsArray = results
            })      
        }

        // define a function that will reroute the partial to the advanced
        // search page
        $scope.toAdvancedSearch = function () {
            $location.url("/guitars/advancedSearch")
        }

    })
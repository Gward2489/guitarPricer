angular
    .module("GuitarPricerApp")
    .controller("DisplayUserGuitarsCtrl", 
        function($scope, $route, $location, UserGearFactory, GuitarFactory) {
            
            // define variables that will work with ng-hide
            // to hide and show the average, high, and low prices
            $scope.showAverages = true
            $scope.showHighs = false
            $scope.showLows = false
            // define a variable that will work with ng-if to 
            // hide and show the loading icon
            $scope.loading = true
            // define empty arrays that will hold the user guitars,
            // the rows of guitars to be printed to the dom, 
            // and an array of guitars with the current value added to the objects
            $scope.guitars = []
            $scope.guitarRows = []
            $scope.guitarsWithPriceArray = []

            // function to show average prices
            $scope.showAveragesFunction = function () {
                $scope.showAverages = true
                $scope.showHighs = false
                $scope.showLows = false
            }

            // function to high prices
            $scope.showHighsFunction = function () {
                $scope.showAverages = false
                $scope.showHighs = true
                $scope.showLows = false
            }

            // function to show low prices
            $scope.showLowsFunction = function () {
                $scope.showAverages = false
                $scope.showHighs = false
                $scope.showLows = true
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

    
            // define a function to generate arrays holding three
            // user guitars each so that we can print rows of three
            // guitars to the dom.
            let makeRowsArray = function (guitarsArray) {
                // create an empty array to hold the rows
                let arrayOfRows = []
                // determine the amount of rows needed by divided the amount
                // of guitars by three
                let numberOfRows = Math.ceil(guitarsArray.length / 3 )
                // make a counter that will help generate rows of three
                let j = 0
                // use a for loop to run once for each needed row
                for (let i = 0; i < numberOfRows; i++) {
                    // slice up to the three items from the guitars array
                    // use the previously defined counter as the starting 
                    // index, and the ending index will be the counter
                    // plus three
                    let currentRowArray = guitarsArray.slice(j, (j + 3))
                    // push the row of guitars into the array that was
                    // previously defined to hold the rows
                    arrayOfRows.push(currentRowArray)
                    // add three to the counter, so that on the next
                    // pass of the for loop, the slice will occur
                    // in the proper location
                    j += 3
                }
                // return the array with rows of guitars
                return arrayOfRows
            }

            // invoke the get guitars function from the user gear factory
            UserGearFactory.getGuitars().then(data => {
                // store the users guitars in the 'guitars' variable
                $scope.guitars = data
                // create an empty array to hold the guitar objects
                // after the current prices have been added in 
                let newGuitarsArray = []
                // create a counter to help us itterate through the guitar array
                let guitarCounter = 0
                // store the length of the guitar array in a variable
                let guitarArrayLength = data.length
                // use a .forEach() method to pass each user guitar into the
                // advanced price function
                data.forEach(guitar => {
                    // declare variables and store the paramaters for the advanced
                    // search in them by extracting those paramaters from the 
                    // guitar object with dot notation
                    let guitarBrand = guitar.guitarBrand
                    let guitarModel = guitar.guitarModel
                    let acousticOrElectric = guitar.acousticOrElectric
                    let vintageCheck = guitar.vintageCheck
                    let condition = guitar.condition
                    let finish = guitar.finish
                    let year = guitar.year
                    let guitarOrBass = guitar.guitarOrBass
                    let guitarCountry = guitar.country

                    // invoke the advanced search functions from the guitar factory
                    GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel,
                        acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, guitarCountry).then(data => {
                        // use a forEach.() method to add the information  
                        // from each price category to the guitar object
                        data.forEach(priceObj => {
                            // use an if statement to select the priceObj by its price
                            // category title, so we can title the information
                            // we are storing on the guitar object with the correct
                            // price category title for the corresponding prices.
                            if (priceObj.priceCategory === "main") {
                                guitar.mainAvgPrice = priceObj.avgPrice
                                guitar.mainLowPrice = priceObj.lowPrice
                                guitar.mainHighPrice = priceObj.highPrice
                                guitar.numberOfMatches = priceObj.numberOfMatches
                            }
                        
                            if (priceObj.priceCategory === "condition") {
                                guitar.conditionAvgPrice = priceObj.avgPrice
                                guitar.conditionLowPrice = priceObj.lowPrice
                                guitar.conditionHighPrice = priceObj.highPrice
                                guitar.conditionMatches = priceObj.numberOfMatches
                            }
                        
                            if (priceObj.priceCategory === "year") {
                                guitar.yearAvgPrice = priceObj.avgPrice
                                guitar.yearLowPrice = priceObj.lowPrice
                                guitar.yearHighPrice = priceObj.highPrice
                                guitar.yearMatches = priceObj.numberOfMatches
                            }
                        
                            if (priceObj.priceCategory === "finish") {
                                guitar.finishAvgPrice = priceObj.avgPrice
                                guitar.finishLowPrice = priceObj.lowPrice
                                guitar.finishHighPrice = priceObj.highPrice
                                guitar.finishMatches = priceObj.numberOfMatches
                            }
                            
                            if (priceObj.priceCategory === "country") {
                                guitar.countryAvgPrice = priceObj.avgPrice
                                guitar.countryLowPrice = priceObj.lowPrice
                                guitar.countryHighPrice = priceObj.highPrice
                                guitar.countryMatches = priceObj.numberOfMatches
                            }
                        })

                        // push the guitar object that now holds the current
                        // market prices for all of the price categories into
                        // the previously declared array 
                        newGuitarsArray.push(guitar)
                    
                        // add a plus one to the guitar counter, since we have added one to the array
                        guitarCounter ++

                        // once the guitar counter matches the total
                        // amount of user guitars, invoke the makerowsArray
                        // function and store the guitar rows in a variable.
                        // angular is watching the guitarRows variable so once
                        // it is filled, the portion of the dom holding the 
                        // search results is populated.
                        // Since each user guitar requires its own asynchronous 
                        // event, we use this if statement to make sure the
                        // function to produce rows is not invoked until
                        // each guitar object promise is returned.
                        if (guitarCounter === guitarArrayLength) {
                            $scope.loading = false
                            $scope.guitarRows = makeRowsArray(newGuitarsArray)
                        }
                    })
                })
            })

            // define a function that will invoke the delete guitar function
            // from the user gear factory, and then reload the partial 
            // so the users guitars will print to the dom without the deleted
            // guitar
            $scope.removeGuitar = function (key) {
                UserGearFactory.deleteGuitar(key).then(function () {
                    $route.reload()
                })
            }
        })
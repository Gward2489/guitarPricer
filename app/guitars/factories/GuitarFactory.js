angular
    .module("GuitarPricerApp")
    .factory("GuitarFactory", function ($http, $sce) {

        return Object.create(null, {
            // function to remove outliers from search results
            "removeOutliers": {
                // pass in array of prices and standard deviation of those prices
                value: function (array, standardDeviation) {
                    // get the average of the prices passed in 
                    let avgPrice = this.getAverage(array)
                    // use the .filter() method to remove prices from the array
                    // that do not fall within the standard deviation 
                    return array.filter( price => {
                        if (price > (avgPrice - standardDeviation) || price < (avgPrice + standardDeviation)) {
                            return price
                        }
                    })
                }
            },

            // function that returns standard deviation
            "getStandardDeviation": {
                // pass in an array of prices
                value: function (array) {
                    // set divisor to the number of prices in the array
                    let divisor = array.length
                    //  get the average price of the prices
                    let avgPrice = this.getAverage(array)
                    // create a new array holding squared value of the
                    // difference between each price in the price array
                    // and the average price
                    let squaredDifferences = array.map(price => {
                        let difference = price - avgPrice
                        let squaredDifference = difference * difference
                        return squaredDifference
                    })
                    // use the .reduce() method to get the sum of all of the squared
                    // differences
                    let dividend = squaredDifferences.reduce(function (accumulator, currentValue ) {
                        return accumulator + currentValue
                    })
                    // firt step of final calculation, divide sum of squared differences
                    // by the length of the array.
                    let stdDevAvg = (dividend/divisor)
                    // get the square root of qoutient and remove any uneeded 
                    // decimals and then return the standard deviation
                    return Math.sqrt(stdDevAvg).toFixed(2)
                }
            },

            // function to get the average price
            "getAverage": {
                // pass in an array of prices
                value: function (array) {
                    // set divisor to length of array
                    let divisor = array.length
                    // set divident to sum of the prices with the help of 
                    // .reduce() method
                    let dividend = array.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue
                    })
                    // get the qoutient and remove uneeded decimals
                    // and return the average price
                    return (dividend/divisor).toFixed(2)
                }
            },

            // function to convert the object returned by the ebay API call
            // into an array of just guitar objects
            "ebayObjToGuitarArray": {
                // pass in the object from ebay
                value: function (fatObject) {
                    // use dot notation to retreive the array of guitars from the object
                    let searchResultsArray = fatObject.data.findCompletedItemsResponse.searchResult.item
                    // return that array of guitars
                    return searchResultsArray
                }
            },

            // function that will convert the array of guitars
            // into an array of prices
            "guitarsToPrices": {
                // pass in the array of guitars
                value: function (array) {
                    // use .map() method to create a new array containing prices
                    return array.map(guitar => {
                        // define a variable to hold the price of each
                        // guitar passed into the map method
                        // use dot notation to retreive the price from the 
                        // guitar object
                        let guitarPrice = parseFloat(guitar.sellingStatus.convertedCurrentPrice["#text"])
                        // return the price to the new array
			return guitarPrice
			})
                }
            },

            // function to remove results from the search results
            // that are not guitars or are broken guitars
            "titleFilter": {
                // pass in the array of guitars
                value: function (array) {

                    // function that returns a variable holding
                    // a boolean true if the guitar title is ok.
                    // the function returns false if the title
                    // holds any string data representing words
                    // that indicate the item is either not
                    // a guitar or a broken guitar
                    let titleCheck = function (title) {
                        // variable to hold boolean
                        let titleClearance = true
                        // list of words that will set title clearance
                        // to false
                        let titleRestrictions = [
                            "parts", 
                            "for parts", 
                            "lawsuit", 
                            "wiring harness", 
                            "truss rod cover", 
                            "thumb rest",
                            "broken",
                            "mute for",
                            "case for",
                            "repair"
                        ]

                        // use a for loop to to itterate through the list of 
                        // restriced words and check the title agaisnt them
                        for (let i = 0; i < titleRestrictions.length; i++) {
                            // use .search() method within an if statement to 
                            // check and see if the title contains a restriced
                            // word
                            if (title.search(`${titleRestrictions[i]}`) !== -1) {
                                titleClearance = false
                            }
                        }

                        // Epiphone is the subsidiary company of gibson
                        // that produces cheaper models of gibson guitars.
                        // ebay users will include gibson in the title
                        // of the their epiphone in an attempt to make it
                        // seem more valuable. 
                        // Use an if statement to set title clearance to 
                        // false if the guitar title has been subjected to
                        // such trickery. We don't epiphone guitars being
                        // included in results for Gibson guitars, that would
                        // give an innacurate search result.
                        // use the .search() method to check the title for gibson,
                        // then again for epiphone, if it contains both, set 
                        // title clearance to false
                        if (title.search("gibson") !== -1) {
                            if (title.search("epiphone") !== -1) {
                                titleClearance = false
                            }
                        }
                        // return title clearance
                        return titleClearance
                    }

                    // use .filter() method to return an array of guitars
                    // whose title clearance evaluates to true. 
                    return array.filter(guitar => {
                        // title data is not a string when extracted
                        // make it one with JSON.stringify
                        let guitarTitle = JSON.stringify(guitar.title.toLowerCase())

                        let titleClearance = titleCheck(guitarTitle)

                        if (titleClearance === true) {
                            return guitar
                        }
                    })
                }
            },

            // create a function a prepares the users advanced search entry
            // for the beay API call
            "filterAdvancedSearch": {
                // pass in the user search data
                value: function (guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
                            
                    // an array of objects. Each object contains similiar 
                    // ebay condition IDs for guitar conditions 
                    let valueObjects = [
                        {
                            "value1": 4000,
                            "value2": 2000
                        },
                        {
                            "value1": 5000,
                            "value2": 3000
                        },
                        {
                            "value1": 6000
                        },
                    ]

                    // empty array to hold ebay category IDs 
                    // guitar user searched for
                    let categoriesArray = []
                    // empty variable to hold price category of users guitar
                    let selectedValueObj = null
                    // empty variable to hold the condtion values of the users
                    // guitar
                    let conditionValuesArray = []
                    // empty variable to hold keywords for ebay API call
                    let keyWordsString = ""
                    // empty variable to hold categories for ebay API call
                    let categoriesString = ""

                    // use if statements to check data the user has entered 
                    // about the guitar and push the corresponding ebay 
                    // category IDs into the predefined category array
                    if (vintageCheck === "yes") {
                        if (guitarOrBass === "bass") {
                            categoriesArray.push(118984)
                        } else if (guitarOrBass === "guitar") {
                            if (acousticOrElectric === "acoustic") {
                                categoriesArray.push(118979, 181164)
                            } else if (acousticOrElectric === "electric") {
                                categoriesArray.push(118985)
                            }
                        } else {
                            categoriesArray.push(3858)
                        }
                    }

                    if (vintageCheck === "no") {
                        if (guitarOrBass === "bass") {
                            categoriesArray.push(4713)
                        } else if (guitarOrBass === "guitar") {
                            if (acousticOrElectric === "acoustic") {
                                categoriesArray.push(33021, 119544)
                            } else if (acousticOrElectric === "electric") {
                                categoriesArray.push(33034)
                            }
                        } else {
                            categoriesArray.push(118985)
                        }
                    }

                    // use if statements to assign the value object
                    // the corresponds with the inputed condition of the users
                    // guitar to the predfined variable
                    if (condition === "Excellent") {
                        selectedValueObj = valueObjects[0]
                    } else if (condition === "Good") {
                        selectedValueObj = valueObjects[1]
                    } else if (condition === "Usable") {
                        selectedValueObj = valueObjects[2]
                    }

                    // use a for in loop to itterate through the value
                    // object and push the values into the predefined
                    // condition value array.
                    // this array will contain all the ebay condition IDs
                    // that correspond to the users guitar
                    for (key in selectedValueObj) {
                        conditionValuesArray.push(selectedValueObj[key])
                    }

                    // use the .replace() method to convert all spaces to to plus signs
                    // in the user inputed fields. This prepares the strings
                    // for the ebay API call.
                    let brandString = guitarBrand.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let modelString = guitarModel.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let finishString = finish.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let yearString = year.replace(/ {2}/g, "").replace(/ /g, "").replace(/'/g, "")

                    // contruct the keyword string to be sent to the API call
                    keyWordsString = brandString + "+" + modelString

                    // use .forEach() to itterate through the 
                    // categories array. build a string to pass into the 
                    // ebay API call containing the guitars category.
                    let i = 0
                    categoriesArray.forEach( category => {
                        // if there is more than one category, ebay requires we
                        // number the categories, starting with 0. use an if statement
                        // to check if there is more than one category and build
                        // the string accordingly.
                        if (categoriesArray.length > 1) {
                            categoriesString += `categoryId(${i})=${category}&`
                            i++
                        // if there is just one category, we don't needs to number it
                        } else {
                            categoriesString += `categoryId=${category}&`
                        }
                    })

                    // pass the prepared search info into the advanced search function.
                    // after the search completes, return the search data
                    return this.advancedSearch(keyWordsString, categoriesString, finishString, yearString, conditionValuesArray, country).then(data => {
                        return data
                    })

                }
            },

            // function for basic search
            "basicSearch":{
                // pass in the user's search (it is a string)
                value: function (userSearch) {
                    // construct target URL for api call.
                    // use interpolation to pass in the ebay
                    //  api key and the search keywords
                    let url = "https://serve.guitarpricer.site/api/Guitars/" + userSearch
                    
                    // since ebay requires jsonp,
                    // we will need to use angular's security directive 
                    // to create a trusted url that the angular will accept.
                    // invoke API request on return
                    return $http.get(url)
                        .then(response => {
                            console.log(response)
                            // convert object returned by ebay into an array of guitars
                            let initialSearchResults = this.ebayObjToGuitarArray(response)

                            // if there were search results, began to peform logic on them
                            if (response.data.findCompletedItemsResponse.searchResult.item) {
                                
                                // filter out guitars whose titles contain restricted words
                                let refinedResultsArray = this.titleFilter(initialSearchResults)

                                // if there is more than once search result, perform the contained logic
                                if (refinedResultsArray.length > 1) {
                                    // convert array of guitars to an array of prices
                                    let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 
                                    // get standard deviation of guitar prices
                                    let stdDev = this.getStandardDeviation(guitarPricesArray)
                                    // empty array to hold prices
                                    let refinedPriceArray = []
                                    // on very rare occasions the search will return two guitars of
                                    // the same value, resulting in a standard deviation of 0
                                    // if this happens, we can not remove outliers because there
                                    // are none. use the predefined refinedPriceArray variable
                                    // to hold the new array without outliers,
                                    // or the rare case when we do not need to remove outliers
                                    if (stdDev !== "0.00") {
                                        refinedPriceArray = this.removeOutliers(guitarPricesArray, stdDev)
                                    } else {
                                        refinedPriceArray = guitarPricesArray
                                    }

                                    // create a variable to hold the number of search results
                                    let numberOfMatches = parseInt(refinedPriceArray.length)
                                    // if there was more than one search result(post removing outliers
                                    // and restriced title guitars) perform logic
                                    if (numberOfMatches > 1 ) {
                                        // get average price
                                        let avgPrice = this.getAverage(refinedPriceArray)
                                        // get price range low
                                        let lowPrice = (parseFloat(avgPrice) - parseFloat(stdDev)).toFixed(2)
                                        if (lowPrice < 0) {
                                            lowPrice = .99
                                        }
                                        // get price range high
                                        let highPrice = (parseFloat(avgPrice) + parseFloat(stdDev)).toFixed(2)
                                        // put search results in an object
                                        let results = [
                                            {
                                                "avgPrice": avgPrice,
                                                "highPrice": highPrice,
                                                "lowPrice": lowPrice,
                                                "searchCount": numberOfMatches
                                            }
                                        ]
                                        // return the search results
                                        return results
                                    // if there was only one search refined result, perform this logic
                                    } else {
                                        // set average price to the only search result
                                        let avgPrice = refinedPriceArray[0]
                                        // set the price range high and low to false
                                        let results = [
                                            {
                                                "avgPrice": avgPrice,
                                                "highPrice": false,
                                                "lowPrice": false,
                                                "searchCount": 1  
                                            }
                                        ]
                                        // return the price
                                        return results
                                    }
                                // if there was just one result, return the price
                                } else {

                                    let prices = this.guitarsToPrices(refinedResultsArray)
                                    let avgPrice = prices[0]

                                    let results = [
                                        {
                                            "avgPrice": avgPrice,
                                            "highPrice": false,
                                            "lowPrice": false,
                                            "searchCount": 1
                                        }
                                    ]

                                    return results
                                }
                            // if the search returned to results let the user know ヽ(͡◕ ͜ʖ ͡◕)ﾉ
                            } else {
                                alert("no search results")
                            }

                        })  
                }
            },

            // create a function that will return the advanced search prices
            "advancedSearch":{
                // pass in the required data for the API call
                value: function (keyWords, categories, finish, year, conditionValues, country) {
                    // construct the taret url for the API call

                    let url = "https://serve.guitarpricer.site/api/Guitars/" + categories + "/" + keyWords;
                    // use the angular security directive to make the
                    // url trusted
                    // invoke the api call on function return
                    return $http.get(url)
                        .then(response => {
                            // convert ebay object to object of guitars
                            let initialSearchResults = this.ebayObjToGuitarArray(response)
                            // create an empty array to hold the final prices
                            let finalPrices = []

                            // if there were search results, perform the logic
                            // if there were no search results a single object containing all boolean falses
                            // will be pushed into the final prices array
                            if (response.data.findCompletedItemsResponse.searchResult.item) {
                                // filter out guitars with restricted title words
                                let refinedResultsArray = this.titleFilter(initialSearchResults)
                                // if there is more than once search result perform the logic
                                // if there is only one guitar found, a single object with the lone
                                // price will be pushed into the final prices array
                                if (refinedResultsArray.length > 1) {
                                    // get an array of guitar prices
                                    let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 
                                    
                                    let stdDev = this.getStandardDeviation(guitarPricesArray)
                                    // empty variable to hold refined prices
                                    let refinedPriceArray = []

                                    // on very rare occasions the search will return two guitars of
                                    // the same value, resulting in a standard deviation of 0
                                    // if this happens, we can not remove outliers because there
                                    // are none. use the predefined refinedPriceArray variable
                                    // to hold the new array without outliers,
                                    // or the rare case when we do not need to remove outliers
                                    if (stdDev !== "0.00") {
                                        refinedPriceArray = this.removeOutliers(guitarPricesArray, stdDev)
                                    } else {
                                        refinedPriceArray = guitarPricesArray
                                    }

                                    // capture number of search results
                                    let mainNumberOfMatches = refinedPriceArray.length

                                    // if there were more than one search result, perform logic
                                    if (mainNumberOfMatches > 1) {
                                        // get average price
                                        let mainAvgPrice = this.getAverage(refinedPriceArray)
                                        // get highs and lows
                                        let lowPrice = (parseFloat(mainAvgPrice) - parseFloat(stdDev)).toFixed(2)
                                        let highPrice = (parseFloat(mainAvgPrice) + parseFloat(stdDev)).toFixed(2)

                                        if (lowPrice < 0) {
                                            lowPrice = .99
                                        }

                                        // put prices in an object
                                        let mainPrices = {
                                            "priceCategory": "main",
                                            "avgPrice": mainAvgPrice,
                                            "lowPrice": lowPrice,
                                            "highPrice": highPrice,
                                            "numberOfMatches": mainNumberOfMatches
                                        }

                                        // push main prices into the final prices array
                                        finalPrices.push(mainPrices)

                                        // make a new array with .filter() method that contains
                                        // only guitars made in the country the user specified
                                        let matchingCountryArray = refinedResultsArray.filter(guitar => {
                                            let lowerCaseTitle = guitar.title.toLowerCase()
                                            let lowerCaseCountry = country.toLowerCase()
                                            if (lowerCaseTitle.search(lowerCaseCountry) !== -1) {
                                                return guitar
                                            }
                                        })
                                        
                                        // do the same for the year of production
                                        let matchingYearsArray = refinedResultsArray.filter(guitar => {
                                            if (guitar.title.search(year) !== -1) {
                                                return guitar
                                            }  
                                        })
                                        
                                        // and for the guitar finish
                                        let matchingFinishesArray = refinedResultsArray.filter(guitar => {
                                            let lowerCaseTitle = guitar.title.toLowerCase()
                                            let lowerCaseFinish = finish.toLowerCase()
                                            if (lowerCaseTitle.search(lowerCaseFinish) !== -1) {
                                                return guitar
                                            }    
                                        })
                                        
                                        // and also for the condition of the guitar
                                        let matchingConditionArray = refinedResultsArray.filter(guitar => {
                                            if (guitar.hasOwnProperty("condition") === true) {
                                                let guitarCondition = parseInt(guitar.condition.conditionId)
                                                let conditionClearance = false
                                                conditionValues.forEach(condition => {
                                                    if (condition === guitarCondition) {
                                                        conditionClearance = true
                                                    }
                                                })
                                                if (conditionClearance === true) {
                                                    return guitar
                                                }
                                            }
                                        })
                                        
                                        // if a country of origin was inputed by the user, perform
                                        // the same logic perform for the main prices to gather price
                                        // info on the guitars from the country of origin and then
                                        // push that into the final prices array.
                                        // if there was only one result, or no results,
                                        // the object pushed into the final prices array will
                                        // contain boolean false in place of absent price info
                                        if (country !== "n/a") {
                                            
                                            if (matchingCountryArray.length > 0) {
                                                
                                                let matchingCountryPrices = this.guitarsToPrices(matchingCountryArray)
    
                                                if (matchingCountryPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingCountryPrices)

                                                    let refinedCountryArray = []

                                                    if (stdDev !== "0.00") {
                                                        refinedCountryArray = this.removeOutliers(matchingCountryPrices, stdDev)
                                                    } else {
                                                        refinedCountryArray = matchingCountryPrices
                                                    }

                                                    let numberOfMatches = parseInt(refinedCountryArray.length)

                                                    if (numberOfMatches > 1) {

                                                        let avgCountryPrice = this.getAverage(refinedCountryArray)
    
                                                        let lowPrice = (parseFloat(avgCountryPrice) - parseFloat(stdDev)).toFixed(2)
                                                        let highPrice = (parseFloat(avgCountryPrice) + parseFloat(stdDev)).toFixed(2)
    
                                                        if (lowPrice < 0) {
                                                            lowPrice = .99
                                                        }
    
                                                        let countryPrices = {
                                                            "priceCategory": "country",
                                                            "avgPrice": avgCountryPrice,
                                                            "lowPrice": lowPrice,
                                                            "highPrice": highPrice,
                                                            "numberOfMatches": numberOfMatches
                                                        }
    
                                                        finalPrices.push(countryPrices)

                                                    } else {

                                                        let avgCountryPrice = refinedCountryArray[0]

                                                        let countryPrices = {
                                                            "priceCategory": "country",
                                                            "avgPrice": avgCountryPrice,
                                                            "lowPrice": false,
                                                            "highPrice": false,
                                                            "numberOfMatches": numberOfMatches
                                                            
                                                        }

                                                        finalPrices.push(countryPrices)
                                                    }
    
                                                } else {
    
                                                    let avgPrice = matchingCountryPrices[0]
                                                    let avgCountryPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let countryPrices = {
                                                        "priceCategory": "country",
                                                        "avgPrice": avgCountryPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false,
                                                        "numberOfMatches": false
                                                        
                                                    }
                                                    finalPrices.push(countryPrices)
                                                }
                                            }  else {
                                            
                                                let countryPrices = {
                                                    "priceCategory": "country",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false,
                                                    "numberOfMatches": false                                                    

                                                }
                                                finalPrices.push(countryPrices)
                                            }
                                        }
                                        
                                        // if the condition array has results, perform the same
                                        // log we performed on the country of origin results
                                        if (matchingConditionArray.length > 0 ) {

                                            let matchingConditionPrices = this.guitarsToPrices(matchingConditionArray)
    
                                            if (matchingConditionPrices.length > 1) {
    
                                                let stdDev = this.getStandardDeviation(matchingConditionPrices)

                                                let refinedConditionArray = []

                                                if (stdDev !== "0.00") {
                                                    refinedConditionArray = this.removeOutliers(matchingConditionPrices, stdDev)
                                                } else {
                                                    refinedConditionArray = matchingConditionPrices
                                                }

                                                let numberOfMatches = parseInt(refinedConditionArray.length)

                                                if (numberOfMatches > 1 ) {

                                                    let avgConditionPrice = this.getAverage(refinedConditionArray)
    
                                                    let lowPrice = (parseFloat(avgConditionPrice) - parseFloat(stdDev)).toFixed(2)
                                                    let highPrice = (parseFloat(avgConditionPrice) + parseFloat(stdDev)).toFixed(2)
    
                                                    if (lowPrice < 0) {
                                                        lowPrice = .99
                                                    }
    
                                                    let conditionPrices = {
                                                        "priceCategory": "condition",
                                                        "avgPrice": avgConditionPrice,
                                                        "lowPrice": lowPrice,
                                                        "highPrice": highPrice,
                                                        "numberOfMatches": numberOfMatches                                                        
                                                    }
    
                                                    finalPrices.push(conditionPrices)

                                                } else {

                                                    let avgConditionPrice = refinedConditionArray[0]

                                                    let conditionPrices = {
                                                        "priceCategory": "condition",
                                                        "avgPrice": avgConditionPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false,
                                                        "numberOfMatches": numberOfMatches                                                        
                                                    }
    
                                                    finalPrices.push(conditionPrices)
                                                }
    
                                            } else {
    
                                                let avgPrice = matchingConditionPrices[0]
    
                                                let avgConditionPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                let conditionPrices = {
                                                    "priceCategory": "condition",
                                                    "avgPrice": avgConditionPrice,
                                                    "lowPrice": false,
                                                    "highPrice": false,
                                                    "numberOfMatches": false                              
                                                }
                                                finalPrices.push(conditionPrices)
                                            }
                                        } else {
    
                                            let conditionPrices = {
                                                "priceCategory": "condition",
                                                "avgPrice": false,
                                                "lowPrice": false,
                                                "highPrice": false,
                                                "numberOfMatches": false
                                                
                                            }
    
                                            finalPrices.push(conditionPrices)
                                        }
                                        
                                        // perform the same logic for the finish array as the country array
                                        if (finish !== "n/a") {

                                            if (matchingFinishesArray.length > 0) {

                                                let matchingFinishesPrices = this.guitarsToPrices(matchingFinishesArray)
    
                                                if (matchingFinishesPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingFinishesPrices)


                                                    let refinedFinishesArray = []

                                                    if (stdDev !== "0.00") {
                                                        refinedFinishesArray = this.removeOutliers(matchingFinishesPrices, stdDev)
                                                    } else {
                                                        refinedFinishesArray = matchingFinishesPrices
                                                    }

                                                    let numberOfMatches = parseInt(refinedFinishesArray.length)

                                                    if (numberOfMatches > 1 ) {
                                                        let avgFinishPrice = this.getAverage(refinedFinishesArray)
    
                                                        let lowPrice = (parseFloat(avgFinishPrice) - parseFloat(stdDev)).toFixed(2)
                                                        let highPrice = (parseFloat(avgFinishPrice) + parseFloat(stdDev)).toFixed(2)
    
                                                        if (lowPrice < 0) {
                                                            lowPrice = .99
                                                        }
    
                                                        let finishPrices = {
                                                            "priceCategory": "finish",
                                                            "avgPrice": avgFinishPrice,
                                                            "lowPrice": lowPrice,
                                                            "highPrice": highPrice,
                                                            "numberOfMatches": numberOfMatches
                                                        }
    
                                                        finalPrices.push(finishPrices)

                                                    } else {

                                                        let avgFinishPrice = refinedFinishesArray[0]

                                                        let finishPrices = {
                                                            "priceCategory": "finish",
                                                            "avgPrice": avgFinishPrice,
                                                            "lowPrice": false,
                                                            "highPrice": false,
                                                            "numberOfMatches": numberOfMatches
                                                            
                                                        }
    
                                                        finalPrices.push(finishPrices)
                                                    }
    
                                                } else {
    
                                                    let avgPrice = matchingFinishesPrices[0]
    
                                                    let avgFinishPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let finishPrices = {
                                                        "priceCategory": "finish",
                                                        "avgPrice": avgFinishPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false,
                                                        "numberOfMatches": false
                                                    }
    
                                                    finalPrices.push(finishPrices)
                                                }
    
                                            } else {
    
                                                let finishPrices = {
                                                    "priceCategory": "finish",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false,
                                                    "numberOfMatches": false
                                                    
                                                }
                                                finalPrices.push(finishPrices)
                                            }
                                        }
                                        
                                        // perform the same logic for the year array as was performed on
                                        // the finsh and country arrays
                                        if (year !== "n/a") {
                                            if (matchingYearsArray.length > 0) {
    
                                                let matchingYearsPrices = this.guitarsToPrices(matchingYearsArray)
    
                                                if (matchingYearsPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingYearsPrices)

                                                    let refinedYearsArray = []

                                                    if (stdDev !== "0.00") {
                                                        refinedYearsArray = this.removeOutliers(matchingYearsPrices, stdDev)
                                                    } else {
                                                        refinedYearsArray = matchingYearsPrices
                                                    }

                                                    let numberOfMatches = parseInt(refinedYearsArray.length)

                                                    if (numberOfMatches > 1) {

                                                        let avgYearPrice = this.getAverage(refinedYearsArray)
    
                                                        let lowPrice = (parseFloat(avgYearPrice) - parseFloat(stdDev)).toFixed(2)
                                                        let highPrice = (parseFloat(avgYearPrice) + parseFloat(stdDev)).toFixed(2)
    
                                                        if (lowPrice < 0) {
                                                            lowPrice = .99
                                                        }
    
                                                        let yearPrices = {
                                                            "priceCategory": "year",
                                                            "avgPrice": avgYearPrice,
                                                            "lowPrice": lowPrice,
                                                            "highPrice": highPrice,
                                                            "numberOfMatches": numberOfMatches                                                            
                                                        }
    
                                                        finalPrices.push(yearPrices)

                                                    } else {

                                                        let avgYearPrice = refinedYearsArray[0]

                                                        let yearPrices = {
                                                            "priceCategory": "year",
                                                            "avgPrice": avgYearPrice,
                                                            "lowPrice": false,
                                                            "highPrice": false,
                                                            "numberOfMatches": numberOfMatches                                                            
                                                        }
                                                        finalPrices.push(yearPrices)                     
                                                    }
    
                                                } else {
    
                                                    let avgPrice = matchingYearsPrices[0]
    
                                                    let avgYearPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let yearPrices = {
                                                        "priceCategory": "year",
                                                        "avgPrice": avgYearPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false,
                                                        "numberOfMatches": false
                                                        
                                                    }
    
                                                    finalPrices.push(yearPrices)
                                                }
    
                                            } else {
    
                                                let yearPrices = {
                                                    "priceCategory": "year",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false,
                                                    "numberOfMatches": false
                                                }
    
                                                finalPrices.push(yearPrices)
                                            }
                                        }

                                    } else {

                                        let mainAvgPrice = refinedPriceArray[0]

                                        let mainPrices = {
                                            "priceCategory": "main",
                                            "avgPrice": mainAvgPrice,
                                            "lowPrice": false,
                                            "highPrice": false,
                                            "numberOfMatches": false
                                        
                                        }

                                        finalPrices.push(mainPrices)
                                    }

                                } else {

                                    let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 
                                    let avgPrice = guitarPricesArray[0]
                                    let mainAvgPrice = parseFloat(avgPrice).toFixed(2)

                                    let mainPrices = {
                                        "priceCategory": "main",
                                        "avgPrice": mainAvgPrice,
                                        "lowPrice": false,
                                        "highPrice": false,
                                        "numberOfMatches": false
                                        

                                    }

                                    finalPrices.push(mainPrices)
                                }

                            }  else {
                                let mainPrices = {
                                    "priceCategory": "main",
                                    "avgPrice": false,
                                    "lowPrice": false,
                                    "highPrice": false,
                                    "numberOfMatches": false
                                }
                                finalPrices.push(mainPrices)
                            }

                            return finalPrices

                        })
                }
            }
        })
    })

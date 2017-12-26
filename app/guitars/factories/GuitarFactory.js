angular
    .module("GuitarPricerApp")
    .factory("GuitarFactory", function (ebayKey, $http, $sce) {



        return Object.create(null, {

            "removeOutliers": {
                value: function (array, standardDeviation) {
                    let avgPrice = this.getAverage(array)
                    return array.filter( price => {
                        if (price > (avgPrice - standardDeviation) || price < (avgPrice + standardDeviation)) {
                            return price
                        }
                    })
                }
            },

            "getStandardDeviation": {
                value: function (array) {
                    let divisor = array.length
                    let avgPrice = this.getAverage(array)
                    let squaredDifferences = array.map(price => {
                        let difference = price - avgPrice
                        let squaredDifference = difference * difference
                        return squaredDifference
                    })
                    let dividend = squaredDifferences.reduce(function (accumulator, currentValue ) {
                        return accumulator + currentValue
                    })
                    let stdDevAvg = (dividend/divisor)
                    return Math.sqrt(stdDevAvg).toFixed(2)
                }
            },

            "getAverage": {
                value: function (array) {
                    let divisor = array.length
                    let dividend = array.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue
                    })
                    return (dividend/divisor).toFixed(2)
                }
            },

            "ebayObjToGuitarArray": {
                value: function (fatObject) {
                    let searchResultsArray = fatObject.data.findCompletedItemsResponse[0].searchResult[0].item
                    return searchResultsArray
                }
            },

            "guitarsToPrices": {
                value: function (array) {
                    return array.map(guitar => {
                        let guitarPrice = parseFloat(guitar.sellingStatus[0].convertedCurrentPrice[0].__value__)
                        return guitarPrice
                    })
                }
            },

            "titleFilter": {
                value: function (array) {

                    let titleCheck = function (title) {
                        let titleClearance = true
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

                
                        for (let i = 0; i < titleRestrictions.length; i++) {
                            if (title.search(`${titleRestrictions[i]}`) !== -1) {
                                titleClearance = false
                            }
                        }

                        if (title.search("gibson") !== -1) {
                            if (title.search("epiphone") !== -1) {
                                titleClearance = false
                            }
                        }

                        return titleClearance
                    }

                    return array.filter(guitar => {
                        let guitarTitle = JSON.stringify(guitar.title[0].toLowerCase())

                        let titleClearance = titleCheck(guitarTitle)

                        if (titleClearance === true) {
                            return guitar
                        }
                    })
                }
            },

            "filterAdvancedSearch": {
                value: function (guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
                            
            
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

                    let categoriesArray = []
                    let selectedValueObj = null
                    let conditionValuesArray = []
                    let keyWordsString = ""
                    let categoriesString = ""

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


                    if (condition === "Excellent") {
                        selectedValueObj = valueObjects[0]
                    } else if (condition === "Good") {
                        selectedValueObj = valueObjects[1]
                    } else if (condition === "Usable") {
                        selectedValueObj = valueObjects[2]
                    }

                    for (key in selectedValueObj) {
                        conditionValuesArray.push(selectedValueObj[key])
                    }


                    let brandString = guitarBrand.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let modelString = guitarModel.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let finishString = finish.replace(/ {2}/g, "+").replace(/ /g, "+")
                    let yearString = year.replace(/ {2}/g, "").replace(/ /g, "").replace(/'/g, "")

                    keyWordsString = brandString + "+" + modelString

                    let i = 0
                    categoriesArray.forEach( category => {
                        if (categoriesArray.length > 1) {
                            categoriesString += `categoryId(${i})=${category}&`
                            i++} else {
                            categoriesString += `categoryId=${category}&`
                        }
                    })

                    return this.advancedSearch(keyWordsString, categoriesString, finishString, yearString, conditionValuesArray, country).then(data => {
                        return data
                    })

                }
            },

            "basicSearch":{
                value: function (userSearch) {
                    let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=${ebayKey}&RESPONSE-DATA-FORMAT=XML&categoryId(0)=33034&categoryId(1)=33021&categoryId(2)=4713&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value(0)=true&itemFilter(1).name=Condition&itemFilter(1).value(0)=Used&itemFilter(1).value(1)=2500&itemFilter(1).value(2)=3000&itemFilter(1).value(3)=4000&itemFilter(1).value(4)=5000&itemFilter(1).value(5)=6000&itemFilter(2).name=ExcludeCategory&itemFilter(2).value(0)=181223&itemFilter(2).value(1)=47067&REST-PAYLOAD&keywords=${userSearch}`
                    let trustedUrl = $sce.trustAsResourceUrl(url)
                    return $http.jsonp(trustedUrl, 
                        {jsonpCallbackParam: "callback"})
                        .then(response => {

                   
                            let initialSearchResults = this.ebayObjToGuitarArray(response)

                            if (response.data.findCompletedItemsResponse[0].searchResult[0].item) {
                                
                                
                                let refinedResultsArray = this.titleFilter(initialSearchResults)

                                if (refinedResultsArray.length > 1) {

                                    let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 

                                    let stdDev = this.getStandardDeviation(guitarPricesArray)
                                    let refinedPriceArray = this.removeOutliers(guitarPricesArray, stdDev)
                                    let numberOfMatches = parseInt(refinedPriceArray.length)

                                    if (numberOfMatches > 1 ) {

                                        let avgPrice = this.getAverage(refinedPriceArray)
                                        let lowPrice = (parseFloat(avgPrice) - parseFloat(stdDev)).toFixed(2)
                                        if (lowPrice < 0) {
                                            lowPrice = .99
                                        }
                                        let highPrice = (parseFloat(avgPrice) + parseFloat(stdDev)).toFixed(2)
                                        let results = [
                                            {
                                                "avgPrice": avgPrice,
                                                "highPrice": highPrice,
                                                "lowPrice": lowPrice,
                                                "searchCount": numberOfMatches
                                            }
                                        ]

                                        return results

                                    } else {
                                        let avgPrice = refinedPriceArray[0]

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

                            } else {
                                alert("no search results")
                            }

                        })  
                }
            },

            "advancedSearch":{
                value: function (keyWords, categories, finish, year, conditionValues, country) {
                    let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=${ebayKey}&RESPONSE-DATA-FORMAT=XML&${categories}itemFilter(0).name=SoldItemsOnly&itemFilter(0).value(0)=true&itemFilter(1).name=ExcludeCategory&itemFilter(1).value(0)=181223&itemFilter(1).value(1)=47067&REST-PAYLOAD&keywords=${keyWords}`
                    let trustedUrl = $sce.trustAsResourceUrl(url)
                    return $http.jsonp(trustedUrl,
                        {jsonpCallbackParam: "callback"})
                        .then(response => {

                            let initialSearchResults = this.ebayObjToGuitarArray(response)
                            let finalPrices = []

                            if (response.data.findCompletedItemsResponse[0].searchResult[0].item) {


                                let refinedResultsArray = this.titleFilter(initialSearchResults)


                            
                                if (refinedResultsArray.length > 1) {

                                    let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 
                                    let stdDev = this.getStandardDeviation(guitarPricesArray)
                                    let refinedPriceArray = this.removeOutliers(guitarPricesArray, stdDev)
                                    let numberOfMatches = refinedPriceArray.length

                                    if (numberOfMatches > 1) {

                                        let mainAvgPrice = this.getAverage(refinedPriceArray)

                                        let lowPrice = (parseFloat(mainAvgPrice) - parseFloat(stdDev)).toFixed(2)
                                        let highPrice = (parseFloat(mainAvgPrice) + parseFloat(stdDev)).toFixed(2)

                                        if (lowPrice < 0) {
                                            lowPrice = .99
                                        }

                                        let mainPrices = {
                                            "priceCategory": "main",
                                            "avgPrice": mainAvgPrice,
                                            "lowPrice": lowPrice,
                                            "highPrice": highPrice
                                        }

                                        finalPrices.push(mainPrices)

                                        let matchingCountryArray = refinedResultsArray.filter(guitar => {
                                            let lowerCaseTitle = guitar.title[0].toLowerCase()
                                            let lowerCaseCountry = country.toLowerCase()
                                            if (lowerCaseTitle.search(lowerCaseCountry) !== -1) {
                                                return guitar
                                            }
                                        })
    
                                        let matchingYearsArray = refinedResultsArray.filter(guitar => {
                                            if (guitar.title[0].search(year) !== -1) {
                                                return guitar
                                            }  
                                        })
    
                                        let matchingFinishesArray = refinedResultsArray.filter(guitar => {
                                            let lowerCaseTitle = guitar.title[0].toLowerCase()
                                            let lowerCaseFinish = finish.toLowerCase()
                                            if (lowerCaseTitle.search(lowerCaseFinish) !== -1) {
                                                return guitar
                                            }    
                                        })
    
                                        let matchingConditionArray = refinedResultsArray.filter(guitar => {
                                            if (guitar.hasOwnProperty("condition") === true) {
                                                let guitarCondition = parseInt(guitar.condition[0].conditionId[0])
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
    
                                        if (country !== "n/a") {
                                            if (matchingCountryArray.length > 0) {
                                                
                                                let matchingCountryPrices = this.guitarsToPrices(matchingCountryArray)
    
                                                if (matchingCountryPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingCountryPrices)
                                                    let refinedCountryArray = this.removeOutliers(matchingCountryPrices, stdDev)
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
                                                        "highPrice": highPrice
                                                    }
    
                                                    finalPrices.push(countryPrices)
    
                                                } else {
    
                                                    let avgPrice = matchingCountryPrices[0]
                                                    let avgCountryPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let countryPrices = {
                                                        "priceCategory": "country",
                                                        "avgPrice": avgCountryPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false
                                                    }
                                                    finalPrices.push(countryPrices)
                                                }
                                            }  else {
                                            
                                                let countryPrices = {
                                                    "priceCategory": "country",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false
                                                }
                                                finalPrices.push(countryPrices)
                                            }
                                        }
    
                                        if (matchingConditionArray.length > 0 ) {
                                            let matchingConditionPrices = this.guitarsToPrices(matchingConditionArray)
    
                                            if (matchingConditionPrices.length > 1) {
    
                                                let stdDev = this.getStandardDeviation(matchingConditionPrices)
                                                let refinedConditionArray = this.removeOutliers(matchingConditionPrices, stdDev)
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
                                                    "highPrice": highPrice
                                                }
    
                                                finalPrices.push(conditionPrices)
    
                                            } else {
    
                                                let avgPrice = matchingConditionPrices[0]
    
                                                let avgConditionPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                let conditionPrices = {
                                                    "priceCategory": "condition",
                                                    "avgPrice": avgConditionPrice,
                                                    "lowPrice": false,
                                                    "highPrice": false
                                                }
    
                                                finalPrices.push(conditionPrices)
                                            }
    
                                        } else {
    
                                            let conditionPrices = {
                                                "priceCategory": "condition",
                                                "avgPrice": false,
                                                "lowPrice": false,
                                                "highPrice": false
                                            }
    
                                            finalPrices.push(conditionPrices)
                                        }
    
                                        if (finish !== "n/a") {
                                            if (matchingFinishesArray.length > 0) {
                                                let matchingFinishesPrices = this.guitarsToPrices(matchingFinishesArray)
    
                                                if (matchingFinishesPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingFinishesPrices)
                                                    let refinedFinishesArray = this.removeOutliers(matchingFinishesPrices, stdDev)
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
                                                        "highPrice": highPrice
                                                    }
    
                                                    finalPrices.push(finishPrices)
    
                                                } else {
    
                                                    let avgPrice = matchingFinishesPrices[0]
    
                                                    let avgFinishPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let finishPrices = {
                                                        "priceCategory": "finish",
                                                        "avgPrice": avgFinishPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false
                                                    }
    
                                                    finalPrices.push(finishPrices)
                                                }
    
                                            } else {
    
                                                let finishPrices = {
                                                    "priceCategory": "finish",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false
                                                }
    
                                                finalPrices.push(finishPrices)
                                    
                                            }
                                        }
    
                                        if (year !== "n/a") {
                                            if (matchingYearsArray.length > 0) {
    
                                                let matchingYearsPrices = this.guitarsToPrices(matchingYearsArray)
    
                                                if (matchingYearsPrices.length > 1) {
    
                                                    let stdDev = this.getStandardDeviation(matchingYearsPrices)
                                                    let refinedYearsArray = this.removeOutliers(matchingYearsPrices, stdDev)
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
                                                        "highPrice": highPrice
                                                    }
    
                                                    finalPrices.push(yearPrices)
    
                                                } else {
    
                                                    let avgPrice = matchingYearsPrices[0]
    
                                                    let avgYearPrice = (parseFloat(avgPrice)).toFixed(2)
    
                                                    let yearPrices = {
                                                        "priceCategory": "year",
                                                        "avgPrice": avgYearPrice,
                                                        "lowPrice": false,
                                                        "highPrice": false
                                                    }
    
                                                    finalPrices.push(yearPrices)
                                                }
    
                                            } else {
    
                                                let yearPrices = {
                                                    "priceCategory": "year",
                                                    "avgPrice": false,
                                                    "lowPrice": false,
                                                    "highPrice": false
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
                                            "highPrice": false
    
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
                                        "highPrice": false

                                    }

                                    finalPrices.push(mainPrices)
                                }

                            }  else {
                                let mainPrices = {
                                    "priceCategory": "main",
                                    "avgPrice": false,
                                    "lowPrice": false,
                                    "highPrice": false
                                }
                                finalPrices.push(mainPrices)
                            }

                            return finalPrices

                        })
                }
            }
        })
    })











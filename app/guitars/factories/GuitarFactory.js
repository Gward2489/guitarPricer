angular
.module("GuitarPricerApp")
.factory("GuitarFactory", function ($http, $sce) {



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
                    "mute",
                    "case",
                    "repair"
                ]
                for (let i = 0; i < titleRestrictions.length; i++) {
                    if (title.search(`${titleRestrictions[i]}`) !== -1) {
                        titleClearance = false
                    }
                }
                return titleClearance
            }

            return array.filter(guitar => {
                let guitarTitle = JSON.stringify(guitar.title[0].toLowerCase())
                console.log(guitarTitle)
                console.log(guitarTitle.search("parts"))

                let titleClearance = this.titleCheck(guitarTitle)

                if (titleClearance === true) {
                    return guitar
                }
            })


        }

    },

    "basicSearch":{
        value: function (userSearch) {
            let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9&RESPONSE-DATA-FORMAT=XML&categoryId(0)=33034&categoryId(1)=33021&categoryId(2)=4713&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value(0)=true&itemFilter(1).name=Condition&itemFilter(1).value(0)=Used&itemFilter(1).value(1)=2500&itemFilter(1).value(2)=3000&itemFilter(1).value(3)=4000&itemFilter(1).value(4)=5000&itemFilter(1).value(5)=6000&itemFilter(2).name=ExcludeCategory&itemFilter(2).value(0)=181223&itemFilter(2).value(1)=47067&REST-PAYLOAD&keywords=${userSearch}`
            let trustedUrl = $sce.trustAsResourceUrl(url)
            return $http.jsonp(trustedUrl, 
                {jsonpCallbackParam: 'callback'})
                .then(response => {

                    console.log(response)
                    console.log(response.data.findCompletedItemsResponse[0].searchResult[0])

                    let initialSearchResults = this.ebayObjToGuitarArray(response)

                    if (response.data.findCompletedItemsResponse[0].searchResult[0].item) {
                        
                        let refinedResultsArray = this.titleFilter(initialSearchResults)

                        console.log(refinedResultsArray)

                        let guitarPricesArray = this.guitarsToPrices(refinedResultsArray) 

                        let stdDev = this.getStandardDeviation(guitarPricesArray)
                        let refinedPriceArray = this.removeOutliers(guitarPricesArray, stdDev)
                        let avgPrice = this.getAverage(refinedPriceArray)
                        console.log(avgPrice)
                    } else {
                        alert("no search results")
                    }

                })  
            }
        }
    })
})
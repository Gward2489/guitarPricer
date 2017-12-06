angular
.module("GuitarPricerApp")
.factory("GuitarFactory", function ($http, $sce) {



return Object.create(null, {
    "basicSearch":{
        value: function (userSearch) {
            let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9&RESPONSE-DATA-FORMAT=XML&categoryId(0)=33034&categoryId(1)=33021&categoryId(2)=4713&itemFilter.name=SoldItemsOnly&itemFilter.value=true&REST-PAYLOAD&keywords=${userSearch}`
            let trustedUrl = $sce.trustAsResourceUrl(url)
            return $http.jsonp(trustedUrl, 
                {jsonpCallbackParam: 'callback'})
                .then(response => {

                    console.log(response.data.findCompletedItemsResponse[0].searchResult[0])
                
                    let guitarPricesArray = response.data.findCompletedItemsResponse[0].searchResult[0].item.map(guitar => {
                    let guitarPrice = parseFloat(guitar.sellingStatus[0].convertedCurrentPrice[0].__value__)
                       return guitarPrice
                    })

                    let divisor = guitarPricesArray.length

                    let dividend = guitarPricesArray.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue })

                    let avgPrice = (dividend/divisor).toFixed(2)

                    let squaredDifferences = guitarPricesArray.map(price => {
                        let difference = price - avgPrice
                        let squaredDifference = difference * difference
                        return squaredDifference
                    })

                    let newDividend = squaredDifferences.reduce(function (accumulator, currentValue ) {
                        return accumulator + currentValue
                    })

                    let stdDevAvg = (newDividend/divisor)
                    let stdDeviation = Math.sqrt(stdDevAvg).toFixed(2)

                    console.log(avgPrice)
                    console.log(stdDeviation)

                    let refinedPriceArray = guitarPricesArray.filter( price => {
                        if (price > (avgPrice - stdDeviation) || price < (avgPrice + stdDeviation)) {
                            return price
                        }
                    })

                    let finalDivisor = refinedPriceArray.length

                    let finalDividend = refinedPriceArray.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue
                    })

                    let finalAverage = (finalDividend/finalDivisor).toFixed(2)

                    console.log(finalAverage)

                })  
            }
        }
    })
})
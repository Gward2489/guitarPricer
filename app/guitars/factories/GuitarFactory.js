angular
.module("GuitarPricerApp")
.factory("GuitarFactory", function ($http, $sce) {



return Object.create(null, {
    "basicSearch":{
        value: function (userSearch) {
            let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9&RESPONSE-DATA-FORMAT=XML&categoryId=33034&itemFilter.name=SoldItemsOnly&itemFilter.value=true&REST-PAYLOAD&keywords=${userSearch}`
            let trustedUrl = $sce.trustAsResourceUrl(url)
            return $http.jsonp(trustedUrl, 
                {jsonpCallbackParam: 'callback'})
                .then(response => {
                    let guitarPricesArray = response.data.findCompletedItemsResponse[0].searchResult[0].item.map(guitar => {
                    let guitarPrice = parseFloat(guitar.sellingStatus[0].convertedCurrentPrice[0].__value__)
                       return guitarPrice
                    })

                    let divisor = guitarPricesArray.length

                    let dividend = guitarPricesArray.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue })

                    let avgPrice = (dividend/divisor).toFixed(2)

                    console.log(avgPrice)

                })  
            }
        }
    })
})
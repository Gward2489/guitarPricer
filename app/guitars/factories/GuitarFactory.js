angular
.module("GuitarPricerApp")
.factory("GuitarFactory", function ($http, $sce) {



    return Object.create(null, {
        "basicSearch":{
            value: function () {
                let url = `http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9&RESPONSE-DATA-FORMAT=XML&categoryId=33034&itemFilter.name=SoldItemsOnly&itemFilter.value=true&REST-PAYLOAD&keywords=2014+Gibson+Les+Paul+Traditional`
                let trustedUrl = $sce.trustAsResourceUrl(url)
                return $http.jsonp(trustedUrl, 
                    {jsonpCallbackParam: 'callback'})
                    .then(response => {
                    console.log(response)
                }) 

            }
        }
    })
})
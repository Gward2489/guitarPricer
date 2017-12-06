

$("#searchStuff").on("click", function () {
    $.ajax({
        "url": "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.7.0&SECURITY-APPNAME=GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9&RESPONSE-DATA-FORMAT=XML&REST-PAYLOAD&keywords=Gibson+Les+Paul+Traditional",
        "method": "GET",
        "dataType": "jsonp"
    }).then(result => {
        console.log(result)
    })

})



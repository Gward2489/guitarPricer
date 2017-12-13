angular
.module("GuitarPricerApp")
.controller("DisplayUserGuitarsCtrl", 
    function($scope, $location, UserGearFactory, GuitarFactory, AuthFactory) {
    
    $scope.guitars = []
    $scope.guitarRows = []
    $scope.guitarsWithPriceArray = []
    
    $scope.isItTrue = function (objProp) {
        if (objProp !== false) {
            return true
        } else {
            return false
        }

    }

    $scope.isItFalse = function (objProp) {
        if (objProp === false) {
            return true
        } else {
            return false 
        }
    }
    
    let makeRowsArray = function (guitarsArray) {
        let arrayOfRows = []
        let numberOfRows = Math.ceil(guitarsArray.length / 3 )

        let j = 0

        for (let i = 0; i < numberOfRows; i++) {
            let currentRowArray = guitarsArray.slice(j, (j + 3))
            arrayOfRows.push(currentRowArray)
            j += 3
        }
        return arrayOfRows
    }


    UserGearFactory.getGuitars().then(data => {
        $scope.guitars = data

        let newGuitarsArray = []
        let guitarCounter = 0
        let guitarArrayLength = data.length

        data.forEach(guitar => {

            let guitarBrand = guitar.guitarBrand
            let guitarModel = guitar.guitarModel
            let acousticOrElectric = guitar.acousticOrElectric
            let vintageCheck = guitar.vintageCheck
            let condition = guitar.condition
            let finish = guitar.finish
            let year = guitar.year
            let guitarOrBass = guitar.guitarOrBass


            GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel,
                acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass).then(data => {
                    
                    data.forEach(priceObj => {
                        if (priceObj.priceCategory === "main") {
                            guitar.mainAvgPrice = priceObj.avgPrice
                            guitar.mainLowPrice = priceObj.lowPrice
                            guitar.mainHighPrice = priceObj.highPrice
                        }
                        
                        if (priceObj.priceCategory === "condition") {
                            guitar.conditionAvgPrice = priceObj.avgPrice
                            guitar.conditionLowPrice = priceObj.lowPrice
                            guitar.conditionHighPrice = priceObj.highPrice
                        }
                        
                        if (priceObj.priceCategory === "year") {
                            guitar.yearAvgPrice = priceObj.avgPrice
                            guitar.yearLowPrice = priceObj.lowPrice
                            guitar.yearHighPrice = priceObj.highPrice
                        }
                        
                        if (priceObj.priceCategory === "finish") {
                            guitar.finishAvgPrice = priceObj.avgPrice
                            guitar.finishLowPrice = priceObj.lowPrice
                            guitar.finishHighPrice = priceObj.highPrice
                        }          
                    })

                    newGuitarsArray.push(guitar)
                    
                    guitarCounter ++

                    if (guitarCounter === guitarArrayLength) {
                        $scope.guitarRows = makeRowsArray(newGuitarsArray)
                        console.log("rowsknow", $scope.guitarRows)
                    }
            })
        })
    })
})
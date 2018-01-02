angular
    .module("GuitarPricerApp")
    .controller("DisplayUserGuitarsCtrl", 
        function($scope, $route, $location, UserGearFactory, GuitarFactory) {
            
            $scope.showAverages = true
            $scope.showHighs = false
            $scope.showLows = false
            $scope.loading = true
            $scope.guitars = []
            $scope.guitarRows = []
            $scope.guitarsWithPriceArray = []

            $scope.showAveragesFunction = function () {
                $scope.showAverages = true
                $scope.showHighs = false
                $scope.showLows = false
            }

            $scope.showHighsFunction = function () {
                $scope.showAverages = false
                $scope.showHighs = true
                $scope.showLows = false
            }

            $scope.showLowsFunction = function () {
                $scope.showAverages = false
                $scope.showHighs = false
                $scope.showLows = true
            }
    
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
                    let guitarCountry = guitar.country


                    GuitarFactory.filterAdvancedSearch(guitarBrand, guitarModel,
                        acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, guitarCountry).then(data => {
                    
                        data.forEach(priceObj => {
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

                        newGuitarsArray.push(guitar)
                    
                        guitarCounter ++

                        if (guitarCounter === guitarArrayLength) {
                            $scope.loading = false
                            $scope.guitarRows = makeRowsArray(newGuitarsArray)
                        }
                    })
                })
            })

            $scope.removeGuitar = function (key) {
                UserGearFactory.deleteGuitar(key).then(function () {
                    $route.reload()
                })
            }
        })
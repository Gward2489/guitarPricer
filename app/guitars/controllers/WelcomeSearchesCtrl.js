angular
.module("GuitarPricerApp")
.controller("WelcomeSearchesCtrl", function ($scope, GuitarFactory) {

    
    $scope.getBasicPrice = function (searchInput) {
        let convertedSearch = searchInput.replace(/  /g, "+").replace(/ /g, "+")
        GuitarFactory.basicSearch(convertedSearch)
        console.log(convertedSearch)
    }

    $scope.conditionValues = ["Excellent", "Good", "Usable"]

    $scope.valueObjects = [
        {
            "value1": 4000,
            "value2": 2500
        },
        {
            "value1": 5000,
            "value2": 3000
        },
        {
            "value1": 6000
        },
    ]

    $scope.getAdvancedPrice = function (guitarBrand, guitarModel, 
        acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {


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
                }
            }


            if (condition === "Excellent") {
                selectedValueObj = $scope.valueObjects[0]
            } else if (condition === "Good") {
                selectedValueObj = $scope.valueObjects[1]
            } else if (condition === "Usable") {
                selectedValueObj = $scope.valueObjects[2]
            }

            for (key in selectedValueObj) {
                conditionValuesArray.push(selectedValueObj[key])
            }


            let brandString = guitarBrand.replace(/  /g, "+").replace(/ /g, "+")
            let modelString = guitarModel.replace(/  /g, "+").replace(/ /g, "+")
            let finishString = finish.replace(/  /g, "+").replace(/ /g, "+")
            let yearString = year.replace(/  /g, "").replace(/ /g, "")

            keyWordsString = brandString + "+" + modelString

            let i = 0
            categoriesArray.forEach( category => {
                if (categoriesArray.length > 1) {
                categoriesString += `categoryId(${i})=${category}&`
                i++} else {
                categoriesString += `categoryId=${category}&`
                }
            })

            console.log(categoriesString)
            console.log(keyWordsString)
            console.log(finishString)
            console.log(yearString)

            GuitarFactory.advancedSearch(keyWordsString, categoriesString, finishString, yearString, conditionValuesArray)
        
    }

    
    
    
    
    


})
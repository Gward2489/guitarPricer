angular
.module("GuitarPricerApp")
.controller("DisplayUserGuitarsCtrl", function($scope, $location, UserGearFactory, AuthFactory) {
    
    $scope.guitars = []
    $scope.guitarRows = []
    
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

    $scope.guitarsWithPriceArray = []

    UserGearFactory.getGuitars().then(data => {
        $scope.guitars = data
        $scope.guitarRows = makeRowsArray($scope.guitars)
        data.forEach(guitar => {
            
        })
    })

})
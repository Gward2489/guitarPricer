angular.module("GuitarPricerApp")
.controller("UserNavCtrl", function($scope, $location, AuthFactory) {


$scope.isAuthenticated = () => AuthFactory.isAuthenticated()

$scope.toGuitarIntakeForm = function() {
    $location.url('/userGear/guitarIntakeForm')
}

$scope.toDisplayUserGuitars = function () {
    $location.url('/userGear/displayUserGuitars')
}

$scope.toSearches = function() {
    $location.url('/guitars/welcomePage')
}

})
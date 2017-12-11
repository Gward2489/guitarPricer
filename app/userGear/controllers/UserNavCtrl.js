angular.module("GuitarPricerApp")
.controller("UserNavCtrl", function($scope, $location, AuthFactory) {


$scope.isAuthenticated = () => AuthFactory.isAuthenticated()

$scope.toGuitarIntakeForm = function() {
    $location.url('/userGear/guitarIntakeForm')
}

$scope.toSearches = function() {
    $location.url('/guitars/welcomePage')
}

})
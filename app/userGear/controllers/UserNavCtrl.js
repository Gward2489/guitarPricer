angular.module("GuitarPricerApp")
.controller("UserNavCtrl", function($scope, $location, AuthFactory) {


$scope.isAuthenticated = () => AuthFactory.isAuthenticated()

$scope.toSearches = function() {
    $location.url('/guitars/welcomePage')
}

})
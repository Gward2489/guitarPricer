angular.module("GuitarPricerApp")
    .controller("UserNavCtrl", function($scope, $location, AuthFactory) {
        // store the boolean result of the is authenticated function in 
        // a variable. This variable will be used with
        // ng-if to only show the user nav partial
        // if the user is logged in
        $scope.isAuthenticated = () => AuthFactory.isAuthenticated()

        // define functions to navigate to each partial of the site
        // that the logged in user may want to utilize
        $scope.toGuitarIntakeForm = function() {
            $location.url("/userGear/guitarIntakeForm")
        }

        $scope.toDisplayUserGuitars = function () {
            $location.url("/userGear/displayUserGuitars")
        }

        $scope.toSearches = function() {
            $location.url("/guitars/welcomePage")
        }

    })
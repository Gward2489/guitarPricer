angular.module("GuitarPricerApp")
.controller("AuthCtrl", function($scope, $location, AuthFactory) {
    $scope.auth = {}

    $scope.logoutUser = function () {
        AuthFactory.logout()
        $location.url('/guitars/welcomePage')
    }

    $scope.logMeIn = function () {
        AuthFactory.authenticate($scope.auth).then(function (didLogin) {
            $scope.login = {}
            $location.url("/userGear/displayUserGuitars")
        })
    }

    $scope.registerUser = function(registerNewUser) {
      AuthFactory.registerWithEmail(registerNewUser).then(function (didRegister) {
        logMeIn(registerNewUser)
      })
    }

})
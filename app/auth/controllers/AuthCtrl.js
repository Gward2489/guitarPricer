angular.module("GuitarPricerApp")
    .controller("AuthCtrl", function($scope, $location, AuthFactory) {
        $scope.auth = {}

        // define a function that will invoke the logout function in the auth
        // factory and then reroute to the welcome page partial
        $scope.logoutUser = function () {
            AuthFactory.logout()
            $location.url("/guitars/welcomePage")
        }

        // define a function that that will invoke the authenticate function in 
        // the auth factory, then reroute to the display user guitars partial
        $scope.logMeIn = function () {
            AuthFactory.authenticate($scope.auth).then(function (didLogin) {
                $scope.login = {}
                $location.url("/userGear/displayUserGuitars")
            })
        }

        // define a function that will invoke the auth factory register
        // function which will register the user, then invoke the log me in 
        // function to immediately log the new user in.
        $scope.registerUser = function(registerNewUser) {
            AuthFactory.registerWithEmail(registerNewUser).then(function (didRegister) {
                logMeIn(registerNewUser)
            })
        }

    })
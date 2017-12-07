app.constant("FIREBASE_CONFIG", {
    apiKey: "AIzaSyAgUOagFXOeau7UUqdgGZuvPjqJbCZPf3U",
    authDomain: "guitar-pricer.firebaseapp.com",
    databaseURL: "https://guitar-pricer.firebaseio.com",
    projectId: "guitar-pricer",
    storageBucket: "guitar-pricer.appspot.com",
    messagingSenderId: "918852501510"
  })

angular.module("GuitarPricerApp").run(function (FIREBASE_CONFIG) {
    firebase.initializeApp(FIREBASE_CONFIG)
})

angular.module("GuitarPricerApp").config(function ($routeProvider) {
    /**
     * Configure all Angular application routes here
     */
    $routeProvider.
        when('/welcomePage', {
            templateUrl: 'app/guitars/partials/welcomePage.html',
            controller: 'WelcomeSearchesCtrl',
        })
        .when('/auth/register', {
            templateUrl: 'app/auth/partials/register.html',
            controller: 'AuthCtrl',
        })
        .when('/guitars/userHomePage', {
            templateUrl: 'app/guitars/partials/userHomePage.html',
            controller: 'UserHomePageCtrl'
        })
        .otherwise('/welcomePage')

})
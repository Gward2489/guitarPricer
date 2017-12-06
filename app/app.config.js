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
        .otherwise('/welcomePage')

})
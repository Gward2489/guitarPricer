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

angular.module("GuitarPricerApp").constant("ebayKey", "GarrettW-KellyBlu-PRD-e132041a0-8df2cdd9")

const isAuth = AuthFactory => new Promise ((resolve, reject) => {
    if (AuthFactory.isAuthenticated()){
        console.log("User is authenticated, resolve route promise")
        resolve()
    } else {
        console.log("User is not authenticated, reject route promise")
        reject()
    }
})

angular.module("GuitarPricerApp").config(function ($routeProvider) {
    /**
     * Configure all Angular application routes here
     */
    $routeProvider.
        when("/welcomePage", {
            templateUrl: "app/guitars/partials/welcomePage.html",
            controller: "WelcomeSearchesCtrl"
        })
        .when("/auth/register", {
            templateUrl: "app/auth/partials/register.html",
            controller: "AuthCtrl"
        })
        .when("/guitars/userHomePage", {
            templateUrl: "app/guitars/partials/userHomePage.html",
            controller: "UserHomePageCtrl",
            resolve: { isAuth }
        })
        .when("/guitars/advancedSearch", {
            templateUrl: "app/guitars/partials/advancedSearch.html",
            controller:"AdvancedSearchCtrl",
        })
        .when("/userGear/guitarIntakeForm", {
            templateUrl: "app/userGear/partials/guitarIntakeForm.html",
            controller: "GuitarIntakeCtrl",
            resolve: { isAuth }
        })
        .when("/userGear/displayUserGuitars", {
            templateUrl: "app/userGear/partials/displayUserGuitars.html",
            controller: "DisplayUserGuitarsCtrl",
            resolve: { isAuth }
        })
        .otherwise("/welcomePage")

})
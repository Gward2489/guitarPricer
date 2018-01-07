angular.module("GuitarPricerApp")
    .factory("AuthFactory", function ($http, $timeout, $location, $route) {

        // define a variable that will hold the current user data
        let currentUserData = null
    
        // create a firebase authentication state change observer
        // that will pass the current user info into the current user data
        // variable if the user is logs in. 
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                currentUserData = user
                console.log("user is authenticated")
                // reroute the user to the proper partial if logged in
                if ($location.url() !== "/userGear/displayUserGuitars") {
                    $timeout(function () {
                        $location.url("/userGear/displayUserGuitars")
                    }, 100)
                } else {
                    $route.reload()
                }
        
            } else {
                currentUserData = null
                console.log("User is not authenticated")
                // reroute the user the welcome page if they are not logged in
                $timeout(function () {
                    $location.url("/guitars/welcomePage")
                }, 100)
            }
        })
    
        // define the object that will be returned when AuthFactory is invoked in a controller
        return Object.create(null, {
            // define key value pair that will hold a function. when invoked,
            // the function will return the current user data is a user is logged in
            currentUserCache: {
                value: function () {
                    return currentUserData
                },
                enumerable: true,
                writable: true
            },
            // define a key value pair the will return a boolean
            // indication whether or not the user is authenticated
            isAuthenticated: {
                value: () => {
                    const user = currentUserData
                    return user ? true : false
                }
            },
            // define a key value pair that will hold a function to return 
            // the current user object
            getUser: {
                value: () => firebase.auth().currentUser
            },
            // define a key value pair that will invoke a function that will
            // sign the user out
            logout: {
                value: () => firebase.auth().signOut()
            },
            // key value pair with function to log user in
            authenticate: {
                value: credentials =>
                    firebase.auth()
                        .signInWithEmailAndPassword(
                            credentials.email,
                            credentials.password
                        )
            },
            // key value pair with function to register a new user with an
            // email and password
            registerWithEmail: {
                value: user =>
                    firebase.auth()
                        .createUserWithEmailAndPassword(
                            user.email,
                            user.password
                        )
            }
        })
    })
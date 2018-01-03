angular.module("GuitarPricerApp")
    .factory("AuthFactory", function ($http, $timeout, $location, $route) {

        let currentUserData = null
    
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                currentUserData = user
                console.log("user is authenticated")
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
                $timeout(function () {
                    $location.url("/guitars/welcomePage")
                }, 100)
            }
        })
    
        return Object.create(null, {
            currentUserCache: {
                value: function () {
                    return currentUserData
                },
                enumerable: true,
                writable: true
            },
            isAuthenticated: {
                value: () => {
                    const user = currentUserData
                    return user ? true : false
                }
            },
            getUser: {
                value: () => firebase.auth().currentUser
            },
            logout: {
                value: () => firebase.auth().signOut()
            },
            authenticate: {
                value: credentials =>
                    firebase.auth()
                        .signInWithEmailAndPassword(
                            credentials.email,
                            credentials.password
                        )
            },
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
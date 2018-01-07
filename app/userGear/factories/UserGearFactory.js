angular
    .module("GuitarPricerApp")
    .factory("UserGearFactory", function ($http, $location, AuthFactory) {
        // define the object that the user gear factory will return when it is
        // invoked in a function
        return Object.create(null, {
            // an object to serve a cache to store
            // the users guitars once they are retreived
            "cache": {
                value: null,
                enumerable: true,
                writable: true
            },
            // a function to create an object representing the 
            // users guitar. This object will hold all the data
            // needed to invoke the advanced search function
            // so we can later get the price information for the guitar
            "createGuitarObject": {
                value: function (guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass, country) {
                    // store the current user's acount info
                    // in a variable
                    let user = AuthFactory.getUser()
                    
                    // define the object returned by the function
                    return Object.create(null, {
                        // each object property will be a paramater
                        // needed for the adv search functions
                        // except for the user id, which will be used
                        // to sort the users guitars out of the guitar
                        // collection
                        "guitarBrand": {
                            value: guitarBrand,
                            writable: true,
                            enumerable: true
                        },
                        "guitarModel": {
                            value: guitarModel,
                            writable: true,
                            enumerable: true
                        },
                        "country": {
                            value: country,
                            writable: true,
                            enumerable: true
                        },
                        "acousticOrElectric": {
                            value: acousticOrElectric,
                            writable: true,
                            enumerable: true
                        },
                        "vintageCheck": {
                            value: vintageCheck,
                            writable: true,
                            enumerable: true                 
                        },
                        "condition": {
                            value: condition,
                            writable: true,
                            enumerable: true
                        },
                        "finish": {
                            value: finish,
                            writable: true,
                            enumerable: true
                        },
                        "year": { 
                            value: year,
                            writable: true,
                            enumerable: true
                        },
                        "guitarOrBass": {
                            value: guitarOrBass,
                            writable: true,
                            enumerable: true
                        },
                        "guitarOwner": {
                            value: user.uid,
                            writable: false,
                            enumerable: true
                        }
                    })
                }
            },
            // a function to store a newly created guitar into firebase
            "storeGuitar": {
                value: function (guitarObj) {
                    // authenticate user with firebase token
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            // make API call to post data to firebase
                            $http({
                                "method": "POST",
                                "url": `https://guitar-pricer.firebaseio.com/guitars/.json?auth=${idToken}`,
                                "data": JSON.stringify(guitarObj)
                            }).then(function () {
                                // use window.location to reroute and reload to the
                                // display user guitars partial after the 
                                // new guitar has been successfully added to firebase
                                window.location = "#!/userGear/displayUserGuitars"
                            })
                        })        
                }
            },
            // create a function to retreive the database of guitars
            // from firebase
            "getGuitars": {
                value: function () {
                    // make the api call
                    return $http({
                        "method": "GET",
                        "url": "https://guitar-pricer.firebaseio.com/guitars/.json"
                    }).then(response => {
                        // once the data object has returned, store it in a variable
                        const data = response.data
                        // put the current user data in a variable
                        let currentUser = AuthFactory.currentUserCache()
                        // map the collection of guitars into a new array.
                        // The unique firebase Id of each guitar will be
                        // the key value of the object and 
                        // not one of the object properties when it is initally
                        // returned from firebase. The new array we map will
                        // hold the guitar id as a property. We are doing this
                        // so we can perform array methods targeting the guitar id
                        let guitarsWithIdsArray = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]
                        })
                        // filter the collection of guitars into an array that holds
                        // only guitars owned by the current user.
                        // store the new array of guitars on the cache property of the
                        // user gear factory object
                        this.cache = guitarsWithIdsArray.filter(guitar => {
                            if (currentUser.uid === guitar.guitarOwner) {
                                return guitar
                            }
                        })
                        // return the cache
                        return this.cache                            
                    })
                }
            },
            // define a function that will delete a guitar from firebase
            "deleteGuitar": {
                // pass in the guitar id 
                value: function (key) {
                    return $http({
                        method: "DELETE",
                        url: `https://guitar-pricer.firebaseio.com/guitars/${key}/.json`
                    })
                }
            }
            
        })
    })
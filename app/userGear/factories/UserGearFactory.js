angular
    .module("GuitarPricerApp")
    .factory("UserGearFactory", function ($http, AuthFactory) {

        return Object.create(null, {
            "cache": {
                value: null,
                enumerable: true,
                writable: true
            },
            "createGuitarObject": {
                value: function (guitarBrand, guitarModel, 
                    acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {

                    let user = AuthFactory.getUser()

                    return Object.create(null, {
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

            "storeGuitar": {
                value: function (guitarObj) {
                    return firebase.auth().currentUser.getIdToken(true)
                        .then(idToken => {
                            $http({
                                "method": "POST",
                                "url": `https://guitar-pricer.firebaseio.com/guitars/.json?auth=${idToken}`,
                                "data": JSON.stringify(guitarObj)
                            })
                        })        
                }
            },
            "getGuitars": {
                value: function () {
                    return $http({
                        "method": "GET",
                        "url": "https://guitar-pricer.firebaseio.com/guitars/.json"
                    }).then(response => {
                        const data = response.data
                        let currentUser = AuthFactory.currentUserCache()
                        let guitarsWithIdsArray = Object.keys(data).map(key => {
                            data[key].id = key
                            return data[key]
                        
                        })
                    
                        this.cache = guitarsWithIdsArray.filter(guitar => {
                            if (currentUser.uid === guitar.guitarOwner) {
                                return guitar
                            }
                        })
                    
                        return this.cache                            
                    })
                }
            }
        })
    })
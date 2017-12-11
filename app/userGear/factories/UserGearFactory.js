angular
.module("GuitarPricerApp")
.factory("UserGearFactory", function ($http, $sce, AuthFactory) {

    return Object.create(null, {
        "createGuitarObject": {
            value: function (guitarBrand, guitarModel, 
                acousticOrElectric, vintageCheck, condition, finish, year, guitarOrBass) {

                    let user = AuthFactory.getUser()

                    return Object.create(null, {
                        "guitarBrand": {
                            value: guitarBrand,
                            writable: true
                        },
                        "guitarModel": {
                            value: guitarModel,
                            writable: true
                        },
                        "acousticOrElectric": {
                            value: acousticOrElectric,
                            writable: true,
                        },
                        "vintageCheck": {
                            value: vintageCheck,
                            writable: true                   
                        },
                        "condition": {
                            value: condition,
                            writable: true
                        },
                        "finish": {
                            value: finish,
                            writable: true
                        },
                        "year": { 
                            value: year,
                            writable: true
                        },
                        "guitarOrBass": {
                            value: guitarOrBass,
                            writable: true
                        },
                        "guitarOwner": {
                            value: user.uid,
                            writable: false
                        }
                    })


            }
        }
    })
})
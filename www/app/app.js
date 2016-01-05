var db = null;

(function () {
    'use strict';
    angular.module('newsletterApp', ['ionic','ngMessages','ngAnimate','ngCordova','angular-cache','ionic.service.core','ionic.service.push'])
        .run(run)
        .config(config)
        .constant('envVariables',envVariables);

    //Ionic intial
    function run ($ionicPlatform, authService, $state, $rootScope, $ionicPopup,$cordovaSQLite,$cordovaNetwork, $ionicSideMenuDelegate, $cordovaSplashscreen) {
        $ionicPlatform.ready(function () {

            //Check for internetconnection
            //if(window.Connection) {
            //    if (navigator.connection.type == Connection.NONE) {
            //        $ionicPopup.confirm({
            //            title: "Internet Disconnected",
            //            content: "The internet is disconnected on your device.",
            //            buttons: [
            //                { text: 'Close',
            //                    type: 'button-positive'}]
            //        })
            //            .then(function (result) {
            //                if (!result) {
            //                    //ionic.Platform.exitApp();
            //                }
            //            })
            //    }
            //
            //
            //
            //}
            ionic.Platform.isFullScreen = true
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(false);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            //Open database if it does not exist
            if (window.cordova) {
                db = $cordovaSQLite.openDB({name:'newsletterDB'});

            }else {
                db = window.openDatabase('newsletterDB', '1', 'newsletterDB', 1024 * 1024 * 100);

            }


            // listen for Offline event
            //$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            //    $ionicPopup.confirm({
            //        title: "Internet Disconnected",
            //        content: "The internet is disconnected on your device."
            //    });
            //})

        });
        //stateChange event
        //verify if user has logged in
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            if (toState.authRequired && !authService.isAuthenticated()) { //Assuming the AuthService holds authentication logic
                // User isn’t authenticated
                $state.transitionTo("app.home");
                event.preventDefault();
            }
        });
        $rootScope.$on('$ionicView.enter', function(){

            $ionicSideMenuDelegate.canDragContent(false);
        });

        if (window.cordova) {
            setTimeout(function () {
                $cordovaSplashscreen.hide()
            }, 3000);
        }

    };
    //Route Config
    function config ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/menu/menu.html'
            })
            .state('app.login', {
                url: '/login?:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/login/login.html'
                    }
                }
            })
            .state('app.forgotPassword', {
                url: '/forgotPassword/:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/forgotPassword/forgotPassword.html'
                    }
                }
            })
            .state('app.signup', {
                url: '/signup?:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/signup/signup.html'

                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/profile/profile.html'

                    }
                }
            })
            .state('app.profileThankYou', {
                url: '/profileThankYou',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/profile/profileThankYou.html'

                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'app/home/home.html'

                    }
                }
            })
            .state('app.inbox', {
                url: '/inbox',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/inbox/inbox.html'

                    }
                }
            })
            .state('app.saved', {
                url: '/saved',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/saved/saved.html'

                    }
                }
            })
            .state('app.trending', {
                url: '/trending',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/trending/trending.html'
                    }
                }
            })
            .state('app.about', {
                url: '/about',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/about/about.html'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/settings/settings.html'
                    }
                }
            })
            .state('app.splash', {
                url: '/splash',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/splash/splash.html'
                    }
                }
            })
            .state('app.feedback', {
                url: '/feedback',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/feedback/feedback.html'
                    }
                }
            })
            .state('app.search', {
                url: '/search/:status?:category',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/search.html'
                    }
                }
            })
            .state('app.notification', {
                url: '/notification',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/notification/notification.html'


                    }
                }
            })
            .state('app.subscription', {
                url: '/subscription',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/subscription/subscription.html'

                    }
                }
            })
            .state('app.subscription-category', {
                url: '/subscription-category/:id',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/subscription/subscription-category.html'

                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/splash');

        //if (ionic.Platform.isAndroid()) {
        //    $ionicConfigProvider.scrolling.jsScrolling(false);
        //}
    };

})();
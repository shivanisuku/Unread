/**
 * Created by ssukumaran on 7/20/2015.
 */
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('splashController',splashController)
    splashController.$inject=['$state','$scope','$ionicHistory']
    function splashController($state,$scope, $ionicHistory) {
        ionic.Platform.ready(function(){
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });

            $state.go("app.inbox");
        });



    };//main function end
})();
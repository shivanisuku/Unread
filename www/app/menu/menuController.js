/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('menuController',menuController)
    menuController.$inject=['authService','$state','$window','$scope','$rootScope','$timeout']
    function menuController(authService,$state,$window, $scope,$rootScope,$timeout) {
        var vm=this;
        vm.loginData = [];
        vm.autenticated=false;
        vm.UnreadSavedCount=0;
        vm.UnreadCount=0;
        $rootScope.showInternetNotAvailable=false;
        //=======================================================================================================================================================
        vm.doLogout = function () {
                authService.logout();
                $window.location.reload(true);
        }//Logout function end
        //verify user is logged in
        if(authService.isAuthenticated())
        {
            vm.autenticated=true;
        }

        $scope.$on('user:loggedIn', function(event,data) {
            vm.autenticated=true;
        });

        $scope.$on('user:loggedOut', function(event,data) {

            vm.autenticated=false;
            $state.transitionTo("app.login");
        });
        if(authService.broadcastNetworkAvailability())
        {

        }

        $scope.$on('UnreadCountSaved', function(event,data) {

            vm.UnreadSavedCount=data;
        });
        $scope.$on('UnreadCount', function(event,data) {

            vm.UnreadCount=data;
        });
        $scope.$on('networkAvailable', function(event,data) {
            if(!data) {
                $rootScope.showInternetNotAvailable = true;
                $timeout(function () {
                    $rootScope.showInternetNotAvailable = false;
                }, 2000);
            }
        });
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            $rootScope.showInternetNotAvailable = true;
            $timeout(function () {
                $rootScope.showInternetNotAvailable = false;
            }, 2000);
        })


    };//main function end
})();
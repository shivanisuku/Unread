/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('loginController',loginController)
    loginController.$inject=['authService','sqlLiteService','$state','$scope','$ionicHistory','$window','$cordovaNetwork','$ionicPopup','$ionicScrollDelegate','$rootScope','$stateParams']
    function loginController(authService,sqlLiteService,$state,$scope, $ionicHistory, $window,$cordovaNetwork,$ionicPopup,$ionicScrollDelegate,$rootScope,$stateParams) {
        authService.broadcastNetworkAvailability();
        var vm=this;
        vm.loginData = [];
        vm.submitted=false;
        vm.loginFailedMessage;
        vm.showloading=false;
        vm.showbackbutton=true;
        vm.scrolled=false;
        var email=$stateParams.email;
        vm.loginData.email=email;
        init();
        //-------------------------------------------------------HANDLE LOGIN BUTTON-------------------------------------------------------
        vm.doLogin = function (invalid) {
        vm.submitted=true;
        if(invalid)
        {
            vm.loginFailed=false;
        }
        else {
            vm.showloading=true;
            sqlLiteService.login(vm.loginData.email, vm.loginData.password).then(function (data) {
                vm.showloading=false
                    if (data.access_token!=null&& data.access_token.length > 0) {

                        sqlLiteService.getMemberFromDeviceDB();
                        //sqlLiteService.syncMemberEmailsToDeviceDB();
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $state.go("app.inbox", {}, {reload: true});
                        //$state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: true });
                        //$window.location.reload(true);
                    }
                    else {
                        vm.showloading=false;
                        vm.loginFailed = true;
                        vm.loginFailedMessage = data.error_description;
                    }

                })

        }
        }//Login function end
        //-------------------------------------------------------INIT TO HANDLE REQUEST AUTHENTICATED--------------------------------------------------------------
        function init()
        {
            if(authService.isAuthenticated())
            {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.transitionTo("app.inbox");
            }


        }
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if(fromState.name==='app.signup')
            {
                vm.showbackbutton=true;
            }
            else{
                vm.showbackbutton=false;
            }
        });
        //-------------------------------------------------------GO BACK -------------------------------------------------------
        vm.goback=function()
        {
            restform()
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            event.preventDefault();
            $state.go("app.signup");
        }
        //=====================================================vm.gotoSignUp=======================================================
        vm.gotoSignUp=function()
        {
            if(authService.isNetworkAvailable()) {
                var email = angular.isUndefined(vm.loginData.email) ? "" : vm.loginData.email;
                restform()
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                event.preventDefault();
                $state.go("app.signup", {"email": email});

            }
            else{
                authService.broadcastNetworkAvailability();
            }
        }
        vm.gotoForgotPassword=function()
        {
            vm.showloading=false;
            if(authService.isNetworkAvailable()) {
                var email = angular.isUndefined(vm.loginData.email) ? "" : vm.loginData.email;
                restform()
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $state.go("app.forgotPassword", {"email": email});
            }
            else{
                authService.broadcastNetworkAvailability();
            }
        }
        function restform()
        {
            vm.loginData=[];
            vm.loginForm.$setUntouched();
            vm.submitted=false;
            vm.loginFailed = false;
            vm.loginFailedMessage = "";
        }

        //======================================================Scroll top==================================================

        vm.scrolltop=function()
        {

            vm.loginFailedMessage='';

               $ionicScrollDelegate.scrollBy(0, 40, true)

        }

        $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
            vm.loginFailedMessage='';
            vm.showloading=false;
        });
    };//main function end
})();
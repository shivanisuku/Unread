/**
 * Created by ssukumaran on 7/20/2015.
 */
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('homeController',homeController)
    homeController.$inject=['$state','$scope','authService','$ionicHistory','$ionicSlideBoxDelegate']
    function homeController($state,$scope,authService,$ionicHistory,$ionicSlideBoxDelegate) {

        var vm=this;
        init();
        function init()
        {

            if(authService.isAuthenticated())
            {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                //$state.transitionTo("app.inbox");
                $state.go("app.inbox");
            }
            else{
                if(angular.isUndefined(localStorage.FirstTimeUser) && localStorage.FirstTimeUser==null) {
                   // localStorage.FirstTimeUser = true
                }
                else{
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    //$state.transitionTo("app.inbox");
                    $state.go("app.login");
                }
            }
        }
        vm.gotoLogin=function()
        {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            //$state.transitionTo("app.inbox");
            $state.go("app.signup");
        }
        vm.gotoNextSlide=function()
        {
            $ionicSlideBoxDelegate.next();
        }
        vm.slideChange=function(index)
        {
            $state.go("app.signup");
            if(index==3)
            {

            }

        }
    };//main function end
})();
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('forgotPasswordController',forgotPasswordController)
    forgotPasswordController.$inject=['authService','$ionicPopup','$state','$stateParams','$ionicHistory']
    function forgotPasswordController(authService, $ionicPopup, $state,$stateParams,$ionicHistory) {
        authService.broadcastNetworkAvailability()
        var vm=this;
        var email=$stateParams.email;
        console.log(email);
        vm.forgotPasswordFormData=[];
        vm.forgotPasswordFormData.email;
        vm.submitted=false
        vm.FailedMessage
        vm.showloading=false;
        Init();


//===============================================Forgot Password Submit===========================================================

        vm.forgotPasswordformSubmit = function (invalid) {
            vm.submitted=true;
            if(invalid)
            {
                return;
            }
            else{
                vm.showloading=true;
                authService.forgotPassword(vm.forgotPasswordFormData.email).then(function(data) {
                    vm.showloading=false;
                    if(data.isSuccessful)
                    {

                        vm.submitted=false;
                        $ionicPopup.confirm({
                            title: 'Success',
                            content:'Your password has been sent to your email.',
                            buttons: [
                                { text: 'Close',
                                    type: 'button-positive'}]
                        })
                            .then(function (result) {
                                $state.go("app.login", {"email": vm.forgotPasswordFormData.email});
                            })
                    }
                    else{
                        vm.FailedMessage=data.message;
                    }


                },function(error)
                {

                });
            }
        }
//===============================================GO BACK ==============================================================================================
        vm.goback=function()
        {
            vm.forgotPasswordForm.$setUntouched();
            vm.submitted=false;
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go("app.login", {"email": vm.forgotPasswordFormData.email});
        }
//===============================================Init===============================================
        function Init()
        {
            if(angular.isDefined(email) && email.length)
            {
                vm.forgotPasswordFormData.email=email;
            }
        }
    };//main function end
})();
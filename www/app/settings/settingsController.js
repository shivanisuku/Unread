/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('settingsController',settingsController)
    settingsController.$inject=['authService','sqlLiteService','$state','$window','$scope','$ionicPopup','$ionicHistory']
    function settingsController(authService,sqlLiteService,$state,$window, $scope,$ionicPopup,$ionicHistory) {
        authService.broadcastNetworkAvailability();
        var vm=this;
        vm.showloading=false;
        vm.submitted=false;
        vm.signupData;
        vm.doLogout = function () {
            $ionicPopup.confirm({
                title: 'Logout',
                content:'Are you sure you want to log out?',
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-positive'
                        },
                    { text: 'Ok',
                        type: 'button-positive',
                        onTap: function(e)
                        {
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                            authService.logout();
                           // $window.location.reload(true);

                        }}]
            })
                .then(function (result) {
                    console.log(result);
                })

        }//Logout function end

        populateProfile();
        //$scope.$on('user:loggedOut', function(event,data) {
        //
        //    $state.transitionTo("app.login");
        //});
        //=============================================POPULATE PASSWORD====================================================

        function populateProfile()
        {
            sqlLiteService.getMemberFromDeviceDB().then(function(data)
            {
                vm.signupData=data;
            });


        }
        vm.clearPasswordError=function()
        {

            vm.signupForm.password.$setValidity('pattern', true);
            vm.signupForm.password.$setValidity('minlength', true);
            vm.signupForm.password.$setValidity('maxlength', true);
            vm.signupForm.password.$setPristine();
        }
        //=============================================FORM SUBMIT===========================================================
        vm.signupFormSubmit=function(invalid)
        {
            vm.submitted=false;


                if(!/^[a-zA-Z0-9 ]*$/.test(vm.signupData.password.trim())) {
                    vm.signupForm.password.$setValidity('pattern', false);
                    vm.signupForm.password.$setDirty();
                    return;
                }
                else  if(vm.signupData.password.trim().length<6 )
                {

                    vm.signupForm.password.$setValidity('minlength', false);
                    vm.signupForm.password.$setDirty();
                    return;
                }
                else  if(vm.signupData.password.trim().length>20 )
                {
                    vm.signupForm.password.$setValidity('maxlength', false);
                    vm.signupForm.password.$setDirty();
                    return;
                }
            if(invalid)
            {
                return;
            }
            else{
                vm.showloading=true;
                //update the member in device too
                vm.signupData.birthday=vm.signupData.birthyear+ '-'+vm.signupData.birthmonth+'-'+vm.signupData.birthdate;
                sqlLiteService.updateMemberToDeviceDB(vm.signupData).then(function(data)
                {
                    if(data)
                    {
                        //save to central DB
                        authService.SaveMember(vm.signupData).then(function(data) {
                            console.log(data);
                            if(data.isSuccessful) {
                                vm.showloading=false;
                                $ionicPopup.confirm({
                                    title: 'Success',
                                    content:'Password has been updated.',
                                    buttons: [
                                        { text: 'Close',
                                            type: 'button-positive'}]
                                })
                                    .then(function (result) {

                                    })
                            }
                            else
                            {
                                vm.showloading=false;
                                vm.signupForm.password.$setValidity('pattern', false);
                                vm.signupForm.password.$setDirty();
                                return;
                                if(data.message.length<1)
                                {
                                    if(!angular.isUndefined(data.saveToApiLog) && data.saveToApiLog)
                                    {
                                        var profiledata={memberId:vm.signupData.id ,apiCallType:'profile' ,dataObject:JSON.stringify(vm.signupData)}
                                        sqlLiteService.InsertIntoApiFailedLog(profiledata);
                                    }
                                    $ionicPopup.confirm({
                                        title: 'Success',
                                        content:'Your password has been updated.',
                                        buttons: [
                                            { text: 'Close',
                                                type: 'button-positive'}]
                                    })
                                        .then(function (result) {

                                        })
                                }

                            }
                        });
                    }//IF ENDS
                })//SIGN UP ENDS
            }
        }
    };//main function end
})();
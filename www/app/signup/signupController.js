/**
 * Created by ssukumaran on 7/20/2015.
 */

(function () {
    'use strict';
    angular.module('newsletterApp').controller('signupController',signupController)
    signupController.$inject=['authService','dataService','sqlLiteService','$state','$ionicHistory','$window','$ionicScrollDelegate','$cordovaSQLite','$stateParams','$scope']
    function signupController(authService,dataService,sqlLiteService,$state,$ionicHistory,$window, $ionicScrollDelegate,$cordovaSQLite,$stateParams,$scope) {

        var email=$stateParams.email;
        var vm=this;
        vm.signUpDetailForm=false;
        vm.showPassword=false;
        vm.submitted=false;
        vm.signupData=[];
        vm.submittedEmail;
        vm.showloading=false;
        vm.year = new Date().getFullYear();
        vm.maxyear=vm.year-13;
        vm.minyear=vm.year-150;
        vm.gobackState='home'
        init();




//=====================================HANDLE REQUEST AUTHENTICATED=====================================
        function init()
        {

            ionic.Platform.ready(function() {
               sqlLiteService.initNewsletterCategory();
            });
            if(angular.isDefined(email) && email.length)
            {
                vm.signupData.email=email;
            }
            if(authService.isAuthenticated())
            {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.transitionTo("app.subscription");
            }
        }
 //=====================================FORM NEXT AND SUBMIT FUNCTION=====================================
        vm.signUpFormNextClick= function (validEmail,validPassword)
        {
            var passwordRegex='/^[a-zA-Z0-9 ]*$/';
            vm.submittedEmail=true;

            if(validEmail && validPassword )
            {
                if(/^[a-zA-Z0-9 ]*$/.test(vm.signupData.password) && vm.signupData.password.length>5 && vm.signupData.password.length<21) {
                    vm.signUpDetailForm = true;

                }
                else{
                    if(!/^[a-zA-Z0-9 ]*$/.test(vm.signupData.password)) {
                        vm.signupForm.password.$setValidity('pattern', false);
                        vm.signupForm.password.$setDirty();

                    }
                   else  if(vm.signupData.password.trim().length<6 )
                    {
                        vm.signupForm.password.$setValidity('minlength', false);
                        vm.signupForm.password.$setDirty();

                    }
                   else  if(vm.signupData.password.trim().length>20 )
                    {
                        vm.signupForm.password.$setValidity('maxlength', false);
                        vm.signupForm.password.$setDirty();

                    }

                    vm.signUpDetailForm=false;
                }
            }
            else{
                vm.signUpDetailForm=false;
            }
        }
 //=====================================FORM SUBMIT FUNCTION=====================================

        vm.signFormsubmit=function(invalid)
        {
            vm.validateDate();
            vm.submitted=true;

                if (invalid || vm.errorMessage.length>0) {
                    return;
                }
                else {
                    // SET THE FORM FIEDLS
                    vm.showloading=true;
                    var dataObject = {
                        email: vm.signupData.email,
                        firstName: vm.signupData.firstName,
                        lastName: vm.signupData.lastName,
                        postalCode: vm.signupData.postalCode,
                        password: vm.signupData.password,
                        phone: '',
                        province:'',
                        city:'',
                        mobileNo:'',
                        gender: vm.signupData.gender,
                        language:'',
                        birthday:vm.signupData.birthyear+ '-'+vm.signupData.birthmonth+'-'+vm.signupData.birthdate ,
                        signupIds: [],
                        id: 0
                    }
                    authService.SaveMember(dataObject).then(function (dataSave) {

                        if (dataSave.isSuccessful) {
                            localStorage.FirstTimeUser = true;
                            sqlLiteService.login(vm.signupData.email, vm.signupData.password).then(function (data) {

                                if (data!=null && angular.isUndefined(data.error) && data.access_token.length > 0) {
                                    dataObject.id = data.member_id;
                                    sqlLiteService.setMemberTODeviceDB(dataObject).then(function() {
                                        vm.showloading=false;
                                        $ionicHistory.nextViewOptions({
                                            historyRoot: true
                                        });
                                        $state.go("app.subscription", {}, { reload: true });
                                       // $window.location.reload(true);
                                    });

                                }
                                else {
                                    vm.showloading=false;
                                    if(data.message!=null && !angular.isUndefined(data.message)) {
                                        vm.errorMessage = data.message;
                                    }
                                    else{
                                        vm.errorMessage ="An error has occured in api";
                                    }
                                    return;
                                }
                            });//LOGIN ENDS
                        }//IF ENDS
                        else {
                            vm.showloading=false;

                            if(dataSave.message!=null && !angular.isUndefined(dataSave.message)) {
                                vm.errorMessage = dataSave.message;
                            }
                            else{
                                vm.errorMessage ="An error has occured";
                            }
                            return;
                        }
                    })//SIGN UP ENDS



            }
        }


//=====================================GO BACK =====================================
        vm.goback=function(state)
        {
            console.log(vm.gobackState)
            vm.signupForm.$setUntouched();
            vm.submittedEmail=false;
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            if(state==1) {

               if(vm.gobackState==='home')
               {
                   $state.go("app.home");
                   return;
               }
               else{
                   $state.go("app.login");
                   return;
               }
            }
            else{
                $state.go("app.login");
                return;
            }
        }

 //=====================================-BACK BUTTON  FUNCTION=====================================
        vm.signFormBackButtonClick=function()
        {
            vm.signUpDetailForm=false;
            $ionicScrollDelegate.scrollTop();

        }

        vm.scrolltop=function()
        {
            $ionicScrollDelegate.scrollBy(0, 80, true)
        }
        vm.clearPasswordError=function()
        {
            $ionicScrollDelegate.scrollBy(0, 40, true)
            vm.signupForm.password.$setValidity('pattern', true);
            vm.signupForm.password.$setValidity('minlength', true);
            vm.signupForm.password.$setValidity('maxlength', true);
            vm.signupForm.password.$setPristine();
        }
//===================================== VALIDATE DATE=====================================
        vm.validateDate=function()
        {

            if((vm.signupData.birthmonth == 4 ||vm.signupData.birthmonth ==6 ||vm.signupData.birthmonth == 9 || vm.signupData.birthmonth == 11) && (vm.signupData.birthdate >= 31))
            {
                vm.errorMessage="Please enter a valid date."
                return;
            }
            else{
                vm.errorMessage="";
            }
            if(vm.signupData.birthmonth>0 &&  vm.signupData.birthdate>0)
            {
                if(vm.signupData.birthmonth==2 && vm.signupData.birthdate>29)
                {
                    vm.errorMessage="Please enter a valid date."
                }
                else
                {
                    vm.errorMessage="";
                }
            }
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if(fromState.name!='app.signup') {
                if (fromState.name === 'app.home') {
                    vm.gobackState = 'home'
                }
                if (fromState.name === 'app.login') {
                    if(angular.isUndefined(localStorage.FirstTimeUser) && localStorage.FirstTimeUser==null) {

                        vm.gobackState = 'home'
                    }
                    else{
                        vm.gobackState = '';
                    }
                    //vm.gobackState = 'login'
                    console.log(vm.gobackState)
                }
            }

        });
    };//main function end
})();
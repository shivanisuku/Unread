/**
 * Created by ssukumaran on 7/20/2015.
 */

(function () {
    'use strict';
    angular.module('newsletterApp').controller('profileController',profileController)
    profileController.$inject=['authService','dataService','sqlLiteService','$state','$ionicHistory','$filter','$q','$ionicPopup','$scope']
    function profileController(authService,dataService,sqlLiteService,$state,$ionicHistory,$filter,$q,$ionicPopup, $scope) {
        var vm=this;
        vm.submitted=false;
        vm.signupData=[];
        vm.showloading=false;
       //error message
        vm.errorMessage;
        vm.showThankYou=false;
        vm.year = new Date().getFullYear();
        vm.maxyear=vm.year-13;
        vm.minyear=vm.year-150;
        authService.broadcastNetworkAvailability()

        $scope.$on("$ionicView.enter",function() {
            populateProfile();
        });


//===============================================Populate Profile===============================================
        function populateProfile()
        {
           sqlLiteService.getMemberFromDeviceDB().then(function(data)
           {
               vm.signupData=data;

           });


        }


//===============================================FORM  SUBMIT FUNCTION===============================================

        vm.signFormsubmit=function(invalid)
        {
            vm.validateDate();
            vm.submitted=true;
            if(invalid || vm.errorMessage.length>0)
            {
                return;
            }
            else
            {
                vm.showloading=true;
                //update the member in device too
                vm.signupData.birthday=vm.signupData.birthyear+ '-'+vm.signupData.birthmonth+'-'+vm.signupData.birthdate;
                sqlLiteService.updateMemberToDeviceDB(vm.signupData).then(function(data)
                {
                    if(data)
                    {
                        //save to central DB
                        authService.SaveMember(vm.signupData).then(function(data) {
                             if(data.isSuccessful) {
                                 vm.showloading=false;
                                 $ionicPopup.confirm({
                                     title: 'Success',
                                     content:'Thank you for keeping your profile up to date.',
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
                                     vm.errorMessage=data.message;
                                     if(data.message.length<1)
                                     {
                                         if(!angular.isUndefined(data.saveToApiLog) && data.saveToApiLog)
                                         {
                                             var profiledata={memberId:vm.signupData.id ,apiCallType:'profile' ,dataObject:JSON.stringify(vm.signupData)}
                                             sqlLiteService.InsertIntoApiFailedLog(profiledata);
                                         }
                                         $ionicPopup.confirm({
                                             title: 'Success',
                                             content:'Thank you for keeping your profile up todate.',
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



//=============================================== VALIDATE DATE-===============================================
        vm.validateDate=function()
        {

            if((vm.signupData.birthmonth == 4 ||vm.signupData.birthmonth ==6 ||vm.signupData.birthmonth == 9 || vm.signupData.birthmonth == 11) && (vm.signupData.birthdate >= 31))
            {
                vm.errorMessage="Please enter valid birth date"
                return;
            }
            else{
                vm.errorMessage="";
            }
            if(vm.signupData.birthmonth>0 &&  vm.signupData.birthdate>0)
            {
                if(vm.signupData.birthmonth==2 && vm.signupData.birthdate>29)
                {
                    vm.errorMessage="Please enter valid birth date"
                }
                else
                {
                    vm.errorMessage="";
                }
            }
        }


//===============================================Location start change==================================================
        $scope.$on('$locationChangeStart',function(event,next,current) {
            vm.signupForm.$setUntouched();
           vm.submitted=false;
        });

            };//main function end
})();
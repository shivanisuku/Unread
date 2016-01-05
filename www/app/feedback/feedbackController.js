/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('feedbackController',feedbackController)
    feedbackController.$inject=['dataService','authService','$ionicPopup','$window','$scope']
    function feedbackController(dataService,authService, $ionicPopup,$window, $scope) {
        authService.broadcastNetworkAvailability();
        var vm=this;
        vm.feedbackFormData = [];
        vm.submitted=false;
        vm.showloading=false;

        init();
//========================================================init================================================
        function init()
        {

            var deviceInformation = ionic.Platform.device();
            console.log(deviceInformation)

        }
 //========================================================Form subject========================================
        vm.feedbackformSubmit = function (invalid) {
            vm.submitted=true;
           if(invalid)
           {
               return;
           }
            else{
               vm.showloading=true;
                var dataObject={Type:vm.feedbackFormData.type,Description:vm.feedbackFormData.description,Subject:vm.feedbackFormData.type};
               dataService.sendFeedback(dataObject).then(function(data) {
                   if(data.isSuccessful)
                   {
                       vm.submitted=false;
                       vm.feedbackFormData=[];
                       vm.feedbackForm.$setUntouched();

                   }
                   vm.showloading=false;
                   var title=data.isSuccessful?"Success":"Failed";
                   var description=data.isSuccessful?"Your feedback has been successfully sent.":data.message;
                   $ionicPopup.confirm({
                       title: title,
                       content:description,
                       buttons: [
                           { text: 'Close',
                               type: 'button-positive'}]
                   })
                       .then(function (result) {
                           if (!result) {
                               //ionic.Platform.exitApp();
                           }
                       })

               },function(error)
               {
                   vm.showloading=false;
               });
           }
        }

    };//main function end
})();
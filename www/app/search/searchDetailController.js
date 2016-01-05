/**
 * Created by ssukumaran on 9/30/2015.
 */
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('searchDetailController',searchDetailController)
    searchDetailController.$inject= ['$scope','dataService','authService','sqlLiteService','$ionicModal','$sce','$window','$timeout','$ionicPopover','$ionicPlatform','$ionicPopup','$rootScope','$ionicHistory','$state']
    function searchDetailController($scope,dataService,authService,sqlLiteService,$ionicModal,$sce,$window,$timeout,$ionicPopover,$ionicPlatform,$ionicPopup,$rootScope,$ionicHistory,$state) {

        $scope.emailSlide=[];
        $scope.email;
        $scope.prevEmail;
        $scope.openFeedback=false;
        $scope.share=false;
        //email status--Inbox,Save,trending
        $scope.emailStatus=false;
        //slide action .Message to be shown at top
        $scope.slideMessage=false;
        $scope.slideMessageShown=false;
        $scope.showUndo=false;
        //Undo action.
        $scope.undoStatus=0 //1--inbox,2--save,3--delete
        $scope.undoEmailId=0;
        $scope.undoMessage='';
        $scope.showNotInterestedMessage=false;
        $scope.showloader_det=true;

        $scope.searchPhase;
        $scope.subscribed=true;
        $scope.feedback={};
        $scope.feedbackError=false;
        $scope.showEmailDSMAction=true;
        //==========================================POP OVER==========================================

        $scope.openPopover = function($event) {

            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        //===========================================MODAL===========================================
        $ionicModal.fromTemplateUrl('app/search/searchDetail.html', {
            scope:$scope,
            animation: 'fade-in'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(id,emailStatus,searchPhase) {
            $scope.searchPhase=searchPhase;
            $scope.emailStatus=emailStatus;
            sqlLiteService.getEmailDetailfromDeviceDB(id,emailStatus).then(function(data)
            {
                $scope.emailSlide=[];

                $scope.emailSlide.push({email: $scope.email,prevEmail:$scope.prevEmail})
                $scope.email=data.email;
                sqlLiteService.markAsRead($scope.email.emailid, emailStatus)
                $scope.PopulatePopOverTemplate();
                $scope.showloader_det=false;
            });
            $scope.modal.show();

        };
        $scope.closeModal = function() {
            //$scope.$parent.vm.moreItemsAvailable=true;
            //$scope.$parent.vm.pageNumber=0;
            //$scope.$parent.vm.inboxItems = [];
            //$scope.$parent.vm.populateNewsletters();
           // $scope.$parent.getEmails($scope.searchPhase)
            $scope.$parent.vm.updateCssFromModal($scope.email.emailid);
            $scope.emailSlide=[];
            $scope.email='';
            $scope.prevEmail='';

            $scope.modal.hide();
           // $scope.modal.remove();
        };
        $scope.$on('$destroy', function() {
            $scope.modal.remove();

        });


        //============================================SAVE/DELETE/MOVE TO INBOX================================================================
        $scope.emailDSMAction=function(id,status,nextEmailstatus)
        {
           // $scope.showEmailDSMAction=false;

            sqlLiteService.updateEmailToDeviceDB(id,status).then(function(data)
            {

                if(data) {

                    //$scope.undoStatus=0;
                    //$scope.undoEmailId=$scope.email.emailid;
                    //$scope.showUndo=false;
                    //if( $scope.emailStatus==='Save' )
                    //{
                    //    $scope.undoStatus=2 //--move back to inbox
                    //}
                    //if( $scope.emailStatus==='Inbox')
                    //{
                    //    $scope.undoStatus=1 //--move back to save
                    //}
                    //$scope.undoMessage="";
                    //$scope.undoMessage=status===2?"1 item moved to saved.":status===3?"1 item deleted.":"1 item moved to Inbox";
                    dataService.updateEmail(id, status).then(function( dataApi)
                    {
                        if(!dataApi.isSuccessful && dataApi.saveToApiLog)
                        {
                            var statusChangeData = {Emailid: id, StatusId:status}
                            var statusData = { apiCallType: 'emailStatusChange', dataObject: JSON.stringify(statusChangeData)}
                            sqlLiteService.InsertIntoApiFailedLog(statusData);
                        }

                        // $scope.$parent.vm.removeEmail(id);
                        $scope.openFeedback=false;
                        $scope.share=false;
                       // $scope.getNextEmail(nextEmailstatus);
                    })
                    $scope.showUndo=true;
                }
                 $scope.$parent.vm.removeEmail(id);
                $scope.$parent.vm.updateCssFromModal($scope.email.emailid);
                $scope.emailSlide=[];
                $scope.email='';
                $scope.prevEmail='';
                $scope.modal.hide();
               // $scope.modal.remove();
                //$scope.$parent.getEmails($scope.searchPhase)
            })
            return;
        }
        $scope.notInterested=function(id)
        {
            $scope.openFeedback=false;
            $scope.share=false;
            sqlLiteService.saveNewsletterAsUnsubFromDeviceDb(id).then(function()
            {
                dataService.saveNewsletterAsUnsub(id).then(function(apiData)
                { if(!apiData.isSuccessful)
                {
                    var notInterestedData = {Emailid: id, StatusId:status}
                    var notInterestedApiData = { apiCallType: 'notInterested', dataObject: id.toString()}
                    sqlLiteService.InsertIntoApiFailedLog(notInterestedApiData);
                }

                })
                $scope.closePopover();
                $scope.showNotInterestedMessage=true;
                $timeout(function() {
                    $scope.showNotInterestedMessage=false;
                }, 5000);
            })
        }
        $scope.sendFeedback = function(){
            $scope.closePopover();
            var d = new Date();
            var subject=$scope.email.newsletterSignupId+"#[email] has send feedback for [brand]  "+$scope.email.subject + '.  Feedback send on '+d.toLocaleDateString()

            var feedback_template=         ' <label class="item item-input item-stacked-label">'+
                '<div class="input-label">'+
                ' Description'+
                '</div>'+
                '<textarea rows="3" name="description" placeholder="Please enter your feedback or comment."  id="description"  ng-model="feedback.Description" ></textarea>'+
                '</label>'+

                '<div class="form-error" ng-if="feedbackError">'+
                'Please enter the description.'+
                '</div>'

            $ionicPopup.confirm({
                template: feedback_template,
                title: 'Feedback',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<b>Submit</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.feedback.Description) {
                                $scope.feedbackError=true;
                                e.preventDefault();
                            } else {
                                $scope.feedbackError=false;

                                var dataObject={Type:'Feedback for particular email',Description:$scope.feedback.Description,Subject:subject};
                                dataService.sendFeedback(dataObject).then(function(data) {
                                    if(data.isSuccessful)
                                    {

                                    }
                                });
                            }
                        }
                    }
                ]
            })
                .then(function (result) {
                    if (!result) {
                        //ionic.Platform.exitApp();
                    }
                })
            //
            //$ionicHistory.nextViewOptions({
            //    historyRoot: true
            //});
            //
            //$state.go("app.feedback",{"subject":subject});
        }

        //================================================getNextEmail===============================================
        $scope.getNextEmail=function(slideType)
        {

            var id=$scope.prevEmail!=null?$scope.prevEmail.emailid:0;
            //if(slideType===0)
            //{
            //    id=$scope.prevEmail!=null?$scope.prevEmail.emailid:0;
            //}
            if(id>0) {
                $scope.openFeedback = false;
                $scope.share = false;

                sqlLiteService.getEmailDetailfromDeviceDB(id, $scope.emailStatus).then(function (data) {
                    $scope.prevEmail=data.prevEmail;
                    $scope.email = data.email;
                    $scope.emailSlide=[];
                    $scope.emailSlide.push({email: $scope.email,prevEmail:$scope.prevEmail})

                    $scope.PopulatePopOverTemplate();
                    if($scope.emailStatus!='Trending') {
                        $scope.showUndo = true;
                    }
                    hideUndo();
                });
            }
            else{
                hideUndo();
                //alert("No email");
                $timeout(function() {
                    $scope.closeModal();
                }, 3000);

            }
            return
        }




        $scope.undoPreviousAction=function()
        {
            $scope.$parent.vm.undoPreviousActionInbox()
            $scope.showUndo=false;
            if($scope.undoEmailId>0 &&$scope.undoStatus>0 ) {
                sqlLiteService.updateEmailToDeviceDB($scope.undoEmailId, $scope.undoStatus).then(function (data) {
                    dataService.updateEmail($scope.undoEmailId,  $scope.undoStatus).then(function(updateData)
                    {
                        $scope.undoStatus=0;
                        sqlLiteService.getEmailDetailfromDeviceDB($scope.undoEmailId, $scope.emailStatus).then(function (data) {
                            $scope.nextEmail=data.nextEmail;
                            $scope.prevEmail=data.prevEmail;
                            $scope.email = data.email;
                            $scope.emailSlide=[];
                            $scope.emailSlide.push({email: $scope.email,nextEmail:$scope.nextEmail,prevEmail:$scope.prevEmail})

                        });

                    })

                });
            }
        }
        //=========================================HIDE UNDO=====================================================
        function hideUndo()
        {
            $timeout(function() {
                $scope.showUndo=false;
                $scope.undoStatus=0;
                $scope.undoEmailId=0;
            }, 3000);
        }

        //=========================================Populate popoover template==================================
        $scope.PopulatePopOverTemplate=function() {
            sqlLiteService.veirfySubscribed($scope.email.newsletterSignupId, $scope.email.categoryId).then(function (data) {

                $scope.subscribed = data.result;

                var template = '<ion-popover-view class="fit"> <ion-content>' +
                    ' <div class="list">' +
                    '<div ng-click="sendFeedback()" class="item item-icon-left">' +
                    '<i class="icon ion-reply-all"></i>' +
                    ' Feedback' +
                    '</div>';
                if ($scope.emailStatus != 'Trending') {
                    template = template +
                    ' <div ng-click="notInterested(' + $scope.email.newsletterSignupId + ')" class="item item-icon-left">' +
                    ' <i class="icon ion-thumbsdown"></i>' +
                    'Unsubscribe' +
                    '</div>';
                }
                if ($scope.emailStatus === 'Save') {
                    template = template +
                    '<div  ng - click = "emailDSMAction(' + $scope.email.emailid, 1 + ')" class="item item-icon-left">' +
                    '<i class = "icon ion-email" > < / i >' +
                    'Move to Inbox'
                    '</div>';
                }
                template = template + '</div> </ion-content></ion-popover-view>';
                $scope.popover = $ionicPopover.fromTemplate(template, {
                    scope: $scope
                });
                $scope.closePopover = function () {
                    $scope.popover.hide();
                };
                //Cleanup the popover when we're done with it!
                $scope.$on('$destroy', function () {
                    $scope.popover.remove();
                });
            })
        }

        $scope.showEmailDSMActionFn=function()
        {
            $scope.showEmailDSMAction=true;
        }

    };
})();
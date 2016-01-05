/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('detailController',detailController)
    detailController.$inject= ['$scope','dataService','authService','sqlLiteService','$ionicModal','$sce','$window','$timeout','$ionicPopover','$ionicPlatform','$ionicPopup','$rootScope','$ionicHistory','$state','$ionicSlideBoxDelegate','$ionicScrollDelegate']
    function detailController($scope,dataService,authService,sqlLiteService,$ionicModal,$sce,$window,$timeout,$ionicPopover,$ionicPlatform,$ionicPopup,$rootScope,$ionicHistory,$state,$ionicSlideBoxDelegate,$ionicScrollDelegate) {
         $scope.emailSlide=[];
        $scope.email;
        $scope.prevEmail;
        $scope.openFeedback=false;
        $scope.share=false;
        //email status--Inbox,Save,trending
        $scope.emailStatus=false;
        //slide action .Message to be shown at top

        $scope.showUndo=false;
        //Undo action.
        $scope.undoStatus=0 //1--inbox,2--save,3--delete
        $scope.undoEmailId=0;
        $scope.undoMessage='';
        $scope.showNotInterestedMessage=false;
        $scope.showloader_det=true;
        $scope.slideAnimationMessage='';
        $scope.modalOpened=true;
        $scope.subscribed=true;
        $scope.feedback={};
        $scope.feedbackError=false;
        $scope.showTutorialOverlay=false;
        $scope.modifiedEmails=[];
        $scope.readEmails=[];
        $scope.canAnimateSlide=true;
        $scope.showEmailDSMAction=true;
        $scope.initZoom=0.6;
        //==========================================POP OVER==========================================

        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };

        //===========================================MODAL===========================================
        $ionicModal.fromTemplateUrl('app/detail/detail.html', {
            scope:$scope,
            animation: 'fade-in'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(id,emailStatus) {
            $scope.readEmails.push(id);
            $scope.modalOpened=true;
            $scope.emailStatus=emailStatus;
            sqlLiteService.getEmailDetailfromDeviceDB(id,emailStatus).then(function(data)
              {

                  $scope.prevEmail=data.prevEmail;
                  $scope.email=data.email;


                  $scope.emailSlide=[];

                  $scope.emailSlide.push({email: $scope.email,prevEmail:$scope.prevEmail})
                  console.log(  $scope.emailSlide)
                  $scope.PopulatePopOverTemplate();

                  $scope.showloader_det=false;
                  sqlLiteService.markAsRead($scope.email.emailid, $scope.emailStatus)
                  if (angular.isUndefined(localStorage.showTutorialOverlayDetail)) {
                      $scope.showTutorialOverlay = true;
                  }

              });
            $scope.modal.show();

        };
        $scope.closeModal = function() {

            if($scope.modifiedEmails.length) {
                $scope.$parent.vm.updateEmailFromModal($scope.modifiedEmails)

            }
            if($scope.emailStatus!='Trending') {
                $scope.$parent.vm.updateCssFromModal($scope.readEmails);
            }
            $scope.modalOpened=false;
            $scope.email='';
            $scope.prevEmail='';
            $scope.emailSlide=[];

            $scope.modal.hide();
        };      
        $scope.$on('$destroy', function() {

           $scope.modal.remove();

        });

        $scope.toogleShare=function()
        {
            $scope.share=!$scope.share;
        }
		//============================================SAVE/DELETE/MOVE TO INBOX================================================================
		$scope.emailDSMAction=function(id,status,nextEmailstatus)
		{
            $scope.showEmailDSMAction=false;
            sqlLiteService.updateEmailToDeviceDB(id,status).then(function(data)
            {

                if(data) {

                    $scope.undoStatus=0;
                    $scope.undoEmailId=$scope.email.emailid;
                    $scope.showUndo=false;
                    if( $scope.emailStatus==='Save' )
                    {
                        $scope.undoStatus=2 //--move back to inbox
                    }
                    if( $scope.emailStatus==='Inbox')
                    {
                        $scope.undoStatus=1 //--move back to save
                    }
                    $scope.undoMessage="";
                    $scope.undoMessage=status===2?"1 item moved to saved.":status===3?"1 item deleted.":"1 item moved to Inbox";
                    if($scope.modifiedEmails.indexOf(id)<0) {
                        $scope.modifiedEmails.push(id);
                    }
                    dataService.updateEmail(id, status).then(function( dataApi)
                    {
                        if(!dataApi.isSuccessful && dataApi.saveToApiLog)
                        {
                            var statusChangeData = {Emailid: id, StatusId:status}
                            var statusData = { apiCallType: 'emailStatusChange', dataObject: JSON.stringify(statusChangeData)}
                            sqlLiteService.InsertIntoApiFailedLog(statusData);
                        }

                       // $scope.$parent.vm.removeEmail(id);

                    })
                    $scope.openFeedback=false;
                    $scope.share=false;
                    $scope.getNextEmail(nextEmailstatus);
                }

            })
                 return;
		}
        $scope.notInterested=function(id)
        {
            var id=$scope.email.newsletterSignupId;
            $scope.openFeedback=false;
            $scope.share=false;
            sqlLiteService.saveNewsletterAsUnsubFromDeviceDb(id,$scope.email.categoryId).then(function()
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

            var feedback_template=         ' <label >'+
            '<div class="input-label">'+
           ' Description'+
            '</div>'+
            '<textarea rows="3" class="popup-feedback-textarea" name="description" placeholder="Please enter your feedback or comment."  id="description"  ng-model="feedback.Description" ></textarea>'+
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
                                console.log(dataObject);
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

            if(id>0) {
                $scope.email =  $scope.prevEmail;
                $scope.emailSlide=[];
                $scope.emailSlide.push({email:  $scope.prevEmail,prevEmail:$scope.prevEmail})
               console.log(  $scope.emailSlide)
                            $scope.openFeedback = false;
                            $scope.share = false;
                            sqlLiteService.getEmailDetailfromDeviceDB(id, $scope.emailStatus).then(function (data) {
                                $scope.prevEmail=data.prevEmail;
                               // $scope.email = data.email;
                               // $scope.emailSlide=[];
                               // $scope.emailSlide.push({email: $scope.email,prevEmail:$scope.prevEmail})
                                $scope.emailSlide[0].prevEmail=data.prevEmail;;
                                console.log(  $scope.emailSlide)
                                sqlLiteService.markAsRead($scope.email.emailid, $scope.emailStatus)
                                $scope.PopulatePopOverTemplate();
                                if($scope.emailStatus!='Trending') {
                                    $scope.showUndo = true;
                                    hideUndo($scope.undoEmailId);
                                }



                             });
                $scope.readEmails.push(id);
                     }
            else{
                hideUndo($scope.email.emailid);
                $timeout(function() {
                    $scope.closeModal();
                }, 3000);

            }
            return
        }

        //================================================Onslide===============================================
        $scope.onSlide=function(index) {

            //$scope.emailSlide=[];
            //$scope.showloader_det=true;
            $scope.slideAnimationMessage="";

            if(index===0 && $scope.email.statusName==='Inbox')
            {
                $scope.emailDSMAction($scope.email.emailid,2,index);

            }
             else if(index===2 && $scope.email.statusName!='Trending')
            {
                $scope.emailDSMAction($scope.email.emailid,3,index);

                //do the delete
            }
            else if(index===0 && $scope.email.statusName==='Save')
            {
                //move to inbox
                $scope.emailDSMAction($scope.email.emailid,1,index);
            }
            else {
                $scope.getNextEmail(index);
            }
            return;
        }


        //============================================slideTop================================================================
        //    $scope.SlideTop=function(eventType, options)
        //    {
        //
        //        $scope.showUndo=false;
        //
        //        if( $scope.slideMessage&& $scope.slideMessageShown)
        //        {
        //            $scope.slideMessage=false;
        //        }
        //        else
        //       if($scope.slideMessageShown==false)
        //        {
        //            $scope.slideMessage=true;
        //            $scope.slideMessageShown=true;
        //        }
        //        //$timeout(function() {
        //        //    $scope.slideMessage=false;
        //        //
        //        //}, 1000);
        //    }
        //    $scope.closeSlideTop=function()
        //    {
        //        $scope.slideMessage=false;
        //    }
        //=========================================UNDO PREVIOUS=================================================
        $scope.undoPreviousAction=function()
        {
            $scope.showUndo=false;

            if($scope.undoEmailId>0 &&$scope.undoStatus>0 ) {
                $scope.showEmailDSMAction=false;
                sqlLiteService.updateEmailToDeviceDB($scope.undoEmailId, $scope.undoStatus).then(function (data) {
                    dataService.updateEmail($scope.undoEmailId,  $scope.undoStatus).then(function(updateData)
                    {})
                        $scope.undoStatus=0;
                        sqlLiteService.getEmailDetailfromDeviceDB($scope.undoEmailId, $scope.emailStatus).then(function (data) {
                            if(data.prevEmail !=null) {
                                $scope.prevEmail = data.prevEmail;
                            }
                            $scope.email = data.email;
                            $scope.emailSlide=[];
                            $scope.emailSlide.push({email: $scope.email,prevEmail:$scope.prevEmail})
                            if($scope.modifiedEmails.indexOf($scope.undoEmailId)>-1) {
                                $scope.modifiedEmails.splice($scope.modifiedEmails.indexOf($scope.undoEmailId), 1);

                            }
                            $scope.showEmailDSMAction=true;
                        });



                });
            }
        }
        //=========================================HIDE UNDO=====================================================
        function hideUndo(id)
        {
            $timeout(function() {
                if(id==$scope.undoEmailId) {
                    $scope.showUndo = false;
                    $scope.undoStatus = 0;
                    $scope.undoEmailId = 0;
                }
            }, 4000);
        }

        //=========================================Populate popoover template==================================
        $scope.PopulatePopOverTemplate=function()
        {
             var subscribed;

                        var template = '<ion-popover-view class="fit"> <ion-content>' +
                                        ' <div class="list">'+
                                        '<div ng-click="sendFeedback()" class="item item-icon-left">'+
                                        '<i class="icon ion-reply-all"></i>'+
                                        ' Feedback'+
                                        '</div>' ;
                        if($scope.emailStatus!='Trending' ) {
                            template = template  +
                                     ' <div ng-click="notInterested()" class="item item-icon-left">' +
                                     ' <i class="icon ion-thumbsdown"></i>' +
                                     'Unsubscribe' +
                                    '</div>';
                        }
                        if($scope.emailStatus==='Save') {
                            template = template  +
                        '<div  ng - click = "emailDSMAction('+$scope.email.emailid,1+')" class="item item-icon-left">' +
                            '<i class = "icon ion-email" > < / i >'+
                            'Move to Inbox'
                            '</div>';
                        }
                        template = template  +'</div> </ion-content></ion-popover-view>';
                        $scope.popover = $ionicPopover.fromTemplate(template, {
                            scope: $scope
                        });
                        $scope.closePopover = function() {
                            $scope.popover.hide();
                        };
                        //Cleanup the popover when we're done with it!
                        $scope.$on('$destroy', function() {
                            $scope.popover.remove();
                        });
        }

       ////=============================================scope leave=================================================
       // $ionicPlatform.registerBackButtonAction(function () {
       //
       //     if(angular.isDefined($scope.modalOpened) &&    $scope.modalOpened){
       //         $scope.$parent.vm.moreItemsAvailable=true;
       //         $scope.$parent.vm.pageNumber=0;
       //         $scope.$parent.vm.inboxItems = [];
       //         $scope.$parent.vm.populateNewsletters();
       //         $scope.modalOpened=false;
       //         $scope.modal.hide();
       //     }
       //     else {
       //         if($state.current.name=="app.inbox")
       //         {
       //             navigator.app.exitApp();
       //         }
       //         else {
       //             navigator.app.backHistory();
       //         }
       //     }
       //
       // }, 100);

        //===================================================close message=================================

        $scope.animateSlide=function(side)
        {
            if($scope.canAnimateSlide) {

                if ($scope.emailStatus != 'Trending') {
                    $scope.showSlideLeftAnimation = true;
                    if (side == 1) {
                        var statusVariable=$scope.emailStatus=='Save'?'Inbox':'Save'
                        var slidehtml='<div class="animated fadeIn swipe-overlay-save">' +
                                     '<div  class="row inbox-save-swipe">' +
                                     '<div class="col text-left">' +
                                      '<span class="swipe-icon-box"><i class="icon ion-star custom-icon"></i>'+
                                         statusVariable+
                                        '</span>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
                        $scope.slideAnimationMessage = $sce.trustAsHtml(slidehtml);

                    }
                    else if (side == 2) {
                        //#F54337
                        $scope.slideAnimationMessage = $sce.trustAsHtml('<div  class="animated fadeIn swipe-overlay-delete">' +
                        '<div  class="row inbox-delete-swipe">' +

                        '   <div class="col text-right">' +

                        '<span class="swipe-icon-box"><i class="icon ion-trash-b custom-icon"></i>Delete</span>' +

                        '</div>' +

                        '</div>' +

                        '</div>');


                    }
                    else {
                        $scope.slideAnimationMessage = "";

                    }
                    // hideAnimation();
                }
            }
        }

//================================================close tutorial overlay=======================
        $scope.closeTutorialOverlay = function () {
            $scope.showTutorialOverlay = false;
            localStorage.showTutorialOverlayDetail = 'false'
        }

        //===========================================ZoomTap====================================

        $scope.zoomTap=function()
        {
            $scope.slideAnimationMessage="";
        }
        $scope.showEmailDSMActionFn=function()
        {
            $scope.showEmailDSMAction=true;
        }

        //$scope.onZoomRelease=function()
        //{
        //    var scrollDelegate = $ionicScrollDelegate.$getByHandle('detailScroller');
        //    var view = scrollDelegate.getScrollView();
        //    var scale = view.__zoomLevel;
        //    if(scale <.54)
        //    {
        //        console.log("zoom is required")
        //    }
        //    console.log(scale);
        //}
        $ionicPlatform.onHardwareBackButton(function () {

            if($scope.modifiedEmails.length) {
                $scope.$parent.vm.updateEmailFromModal($scope.modifiedEmails)

            }
            if($scope.emailStatus!='Trending') {
                $scope.$parent.vm.updateCssFromModal($scope.readEmails);
            }
            $scope.modalOpened=false;
            $scope.email='';
            $scope.prevEmail='';
            $scope.emailSlide=[];
            $scope.modal.hide();

        },400);
    };
})();
var db = null;

(function () {
    'use strict';
    run.$inject = ['$ionicPlatform', 'authService', '$state', '$rootScope', '$ionicPopup', '$cordovaSQLite', '$cordovaNetwork', '$ionicSideMenuDelegate', '$cordovaSplashscreen'];
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];
    angular.module('newsletterApp', ['ionic','ngMessages','ngAnimate','ngCordova','angular-cache','ionic.service.core','ionic.service.push'])
        .run(run)
        .config(config)
        .constant('envVariables',envVariables);

    //Ionic intial
    function run ($ionicPlatform, authService, $state, $rootScope, $ionicPopup,$cordovaSQLite,$cordovaNetwork, $ionicSideMenuDelegate, $cordovaSplashscreen) {
        $ionicPlatform.ready(function () {

            //Check for internetconnection
            //if(window.Connection) {
            //    if (navigator.connection.type == Connection.NONE) {
            //        $ionicPopup.confirm({
            //            title: "Internet Disconnected",
            //            content: "The internet is disconnected on your device.",
            //            buttons: [
            //                { text: 'Close',
            //                    type: 'button-positive'}]
            //        })
            //            .then(function (result) {
            //                if (!result) {
            //                    //ionic.Platform.exitApp();
            //                }
            //            })
            //    }
            //
            //
            //
            //}
            ionic.Platform.isFullScreen = true
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(false);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            //Open database if it does not exist
            if (window.cordova) {
                db = $cordovaSQLite.openDB({name:'newsletterDB'});

            }else {
                db = window.openDatabase('newsletterDB', '1', 'newsletterDB', 1024 * 1024 * 100);

            }


            // listen for Offline event
            //$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            //    $ionicPopup.confirm({
            //        title: "Internet Disconnected",
            //        content: "The internet is disconnected on your device."
            //    });
            //})

        });
        //stateChange event
        //verify if user has logged in
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            if (toState.authRequired && !authService.isAuthenticated()) { //Assuming the AuthService holds authentication logic
                // User isn�t authenticated
                $state.transitionTo("app.home");
                event.preventDefault();
            }
        });
        $rootScope.$on('$ionicView.enter', function(){

            $ionicSideMenuDelegate.canDragContent(false);
        });

        if (window.cordova) {
            setTimeout(function () {
                $cordovaSplashscreen.hide()
            }, 3000);
        }

    };
    //Route Config
    function config ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'app/menu/menu.html'
            })
            .state('app.login', {
                url: '/login?:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/login/login.html'
                    }
                }
            })
            .state('app.forgotPassword', {
                url: '/forgotPassword/:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/forgotPassword/forgotPassword.html'
                    }
                }
            })
            .state('app.signup', {
                url: '/signup?:email',
                views: {
                    'menuContent': {
                        templateUrl: 'app/signup/signup.html'

                    }
                }
            })
            .state('app.profile', {
                url: '/profile',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/profile/profile.html'

                    }
                }
            })
            .state('app.profileThankYou', {
                url: '/profileThankYou',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/profile/profileThankYou.html'

                    }
                }
            })
            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'app/home/home.html'

                    }
                }
            })
            .state('app.inbox', {
                url: '/inbox',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/inbox/inbox.html'

                    }
                }
            })
            .state('app.saved', {
                url: '/saved',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/saved/saved.html'

                    }
                }
            })
            .state('app.trending', {
                url: '/trending',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/trending/trending.html'
                    }
                }
            })
            .state('app.about', {
                url: '/about',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/about/about.html'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/settings/settings.html'
                    }
                }
            })
            .state('app.splash', {
                url: '/splash',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/splash/splash.html'
                    }
                }
            })
            .state('app.feedback', {
                url: '/feedback',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/feedback/feedback.html'
                    }
                }
            })
            .state('app.search', {
                url: '/search/:status?:category',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/search/search.html'
                    }
                }
            })
            .state('app.notification', {
                url: '/notification',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/notification/notification.html'


                    }
                }
            })
            .state('app.subscription', {
                url: '/subscription',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/subscription/subscription.html'

                    }
                }
            })
            .state('app.subscription-category', {
                url: '/subscription-category/:id',
                authRequired: true,
                views: {
                    'menuContent': {
                        templateUrl: 'app/subscription/subscription-category.html'

                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('app/splash');

        //if (ionic.Platform.isAndroid()) {
        //    $ionicConfigProvider.scrolling.jsScrolling(false);
        //}
    };

})();
/**
 * Created by ssukumaran on 8/18/2015.
 */
var envVariables={
    dbName:'newsletterDB',
    url:'http://tools-stg1.wiredmessenger.com/WmNewsletterSignupApp/api/',
    login:'http://tools-stg1.wiredmessenger.com/WmNewsletterSignupApp/token',
    checkEmail:'Member/CheckEmailAddressAvailability?emailaddress=',
    checkUsername:'Member/CheckUserNameAvailability?username=',
    getCategory:'Newsletter/GetCategoryList?searchPhrase&status=1&lowerBound=1&upperBound=100&pageSize=100&sortBy=OrderAsc&pageNum=',
    getNewsletters:'Newsletter/GetNewsletterSignupList?status=1&lowerBound=1&upperBound=1000&pageSize=[[pageSize]]&pageNum=1&sortBy=OrderAsc&categoryId=[[categoryId]]',
    saveMember:'Member/SaveMember',
    saveMemberSignupList:'Member/SaveMemberSignupList',
    getMemberNewsletterEmails:'Member/GetMemberNewsletterEmails?lastSentId=[[lastSentId]]&memberId=[[mid]]',
    getMemberById:'Member/GetMemberById?memberId=[[mid]]',
    getTrendingNewsletters:'Member/GetTrendingNewsletters?memberId=[[mid]]',
    updateMemberNewsletterEmailStatus:'Member/UpdateMemberNewsletterEmailStatus?memberId=[[mid]]&emailId=[[emailid]]&statusId=[[statusid]]',
    saveNewsletterAsUnsub:'Member/SaveNewsletterAsUnsub?memberId=[[mid]]&signupId=[[id]]',
    getMemberNewsletter:'Member/GetMemberNewsletter?memberId=[[mid]]',
    feedback:'Member/SendFeedBack',
    batchUpdateMemberEmailStatus:'Member/BatchUpdateMemberEmailStatus',
    forgotPassword:'Member/ForgotPassword?email='
};
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
/**
 * Created by ssukumaran on 10/21/2015.
 */
detectGestures.$inject = ['$ionicGesture'];
angular.module('newsletterApp').directive('detectGestures', detectGestures);

function detectGestures($ionicGesture) {
    return {
        restrict :  'A',

        link : function(scope, elem, attrs) {

            //$ionicGesture.on( 'pinchin',function()
            //{
            //
            //    console.log("pinch in");
            //},elem)
                $ionicGesture.on( 'swipeup',function()
                {

                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'swipedown',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)

                $ionicGesture.on( 'pinch',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'pinchin',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'pinchout',function()
                {

                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
            $ionicGesture.on( 'dragup',function()
            {

                scope.canAnimateSlide=false;
                scope.slideAnimationMessage='';
            },elem)
            $ionicGesture.on( 'dragdown',function()
            {

                scope.canAnimateSlide=false;
                scope.slideAnimationMessage='';
            },elem)
                $ionicGesture.on( 'release',function()
                {
                    scope.canAnimateSlide=true;
                   },elem)
            }

        }

};

/**
 * Created by ssukumaran on 7/21/2015.
 */



iframeLoaded.$inject = ['$filter', '$compile', '$ionicScrollDelegate'];
angular.module('newsletterApp').directive('iframeLoaded', iframeLoaded);

function iframeLoaded($filter, $compile, $ionicScrollDelegate) {
    return function(scope, element, attrs) {
//        if (scope.$last) {
//            var BREAKPOINT = 715; // (Arbitrary value!)
//            var scale = Math.pow(window.innerWidth / BREAKPOINT, 1);
//            var width = 100 / scale; // Width in percent
//            offsetLeft = (width - 100) / 2;
//            var IFRAME_HEIGHT;
//
////PREVIOUS EMAIL
//            var prev_email_iframe = document.getElementById('prev_email_iframe');
//            //SCALING
//            if (prev_email_iframe != null && scope.prevEmail!=null) {
//                IFRAME_HEIGHT = parseInt(getComputedStyle(prev_email_iframe).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                prev_email_iframe.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//                //HTML BODY CONTENT
//                prev_email_iframe.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.prevEmail.emailBody)
//            }
////MAIN EMAIL
//            var email_iframe = document.getElementById('email_iframe');
//            if (email_iframe != null) {
//                //SCALING
//                IFRAME_HEIGHT = parseInt(getComputedStyle(email_iframe).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                email_iframe.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//
////HTML BODY CONTENT
//                email_iframe.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.email.emailBody)
//            }
////PREVIOUS EMAIL
//            var prev_email_iframe2 = document.getElementById('prev_email_iframe2');
//            if (prev_email_iframe2 != null && scope.prevEmail !=null) {
//                //SCALING
//                IFRAME_HEIGHT = parseInt(getComputedStyle(prev_email_iframe2).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                prev_email_iframe2.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//                //HTML BODY CONTENT
//                prev_email_iframe2.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.prevEmail.emailBody)
//            }
//
//
//        }
        if (scope.$last) {

            var initZoom = 0.6;
            var initzoomHeight=1;
            var emailScroll=document.getElementById('emailScroll');
            var mainEmail=document.getElementById('emailBody')
            //var prevEmail=document.getElementById('prevEmail')
            //var prevEmail1=document.getElementById('prevEmail1')
            mainEmail.innerHTML=$filter('unsafeHtml')(scope.email.emailBody);
            var email=mainEmail.getElementsByClassName("unreadAppResize")
            var width=window.screen.width;
            var height=window.screen.height
            if(email[0]!=null && angular.isDefined(email[0]))
            {

                var appliedHeight=height>email[0].scrollHeight?height:email[0].scrollHeight ;
                var newheight=appliedHeight+200;
              // emailScroll.setAttribute('style','width:100%;height:'+appliedHeight+'px')

                var scrollWidth=email[0].scrollWidth;
                var scrollHeight=email[0].scrollHeight
               initZoom=width/scrollWidth;
                initzoomHeight=height/scrollHeight
              //  mainEmail.setAttribute('style','width:100%;height:'+newheight+'px;')
                if(scrollWidth>width )
                {
                    $ionicScrollDelegate.$getByHandle('detailScroller').zoomBy(initZoom);
                    scope.initZoom=initZoom;
                }
                scope.showEmailDSMActionFn();
            }
            //if ( scope.prevEmail !=null) {
            //    prevEmail.innerHTML=$filter('unsafeHtml')(scope.prevEmail.emailBody);
            //    prevEmail1.innerHTML=$filter('unsafeHtml')(scope.prevEmail.emailBody);
            //    $ionicScrollDelegate.$getByHandle('detailScrollerPrev').zoomBy(initZoom);
            //    $ionicScrollDelegate.$getByHandle('detailScrollerPrev1').zoomBy(initZoom);
            //}


        }
    };

};
function transformStr(obj) {
    var obj = obj || {},
        val = '',
        j;
    for ( j in obj ) {
        val += j + '(' + obj[j] + ') ';
    }
    val += 'translateZ(0)';
    return '-webkit-transform: ' + val + '; ' +
        '-moz-transform: ' + val + '; ' +
        'transform: ' + val;
};


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
/**
 * Created by ssukumaran on 9/9/2015.
 */
angular.module('newsletterApp').filter('timeAgo', ['$filter', function ($filter) {
//time: the time
//local: compared to what time? default: now
//raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "never";

        if (!local) {
            (local = Date.now())
        }

        //if (angular.isDate(time)) {
        //
        //    time = time.getTime();
        //} else if (typeof time === "string") {
        //    time = new Date(time).getTime();
        //}

        // create Date object for current location
        var d = new Date(time);

        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var offsetl=-5
        // create new Date object for different city
        // using supplied offset
       var  nd = new Date(utc + (offsetl));
        time=nd.getTime();
        if (angular.isDate(local)) {

            local = local.getTime();
        }else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }

        var
            offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744,
            YEAR = 31556926,
            DECADE = 315569260;

        //if (offset <= MINUTE)              span = 'now';
        //else if (offset < (MINUTE * 60))   span = Math.round(Math.abs(offset / MINUTE))+ ' min' ;
        //else if (offset < (HOUR * 24))     span =  Math.round(Math.abs(offset / HOUR))+ ' hr' ;
        //else if (offset < (DAY * 7))       span =  Math.round(Math.abs(offset / DAY))+ Math.round(Math.abs(offset / DAY))>1?' days' :' day';
        if (offset <= MINUTE)              span = 'now';
        else if (offset < (MINUTE * 60))   span =$filter('date')(time, 'h:mm a');
        else if (offset < (HOUR * 24))     span = $filter('date')(time, 'h:mm a');
        else if (offset < (DAY * 7))        span =$filter('date')(time, 'MMM dd');
        // else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
        else if (offset < (WEEK * 52))     span =$filter('date')(time, 'MMM dd');
        else if (offset < (YEAR * 10))     span =$filter('date')(time, 'mediumDate');
        else if (offset < (DECADE * 100)) span =$filter('date')(time, 'mediumDate');
        else                               span = [ '', 'a long time' ];

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        //span = span.join(' ,');

        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ' : ' ' + span;
    }
}]);
/**
 * Created by ssukumaran on 8/29/2015.
 */
angular.module('newsletterApp').filter('trimSubject', function() {
    return function(text) {
        if(angular.isDefined(text)) {
            var fromEmail=text.substring(0,text.lastIndexOf('<'));
       if(angular.isUndefined(fromEmail) || fromEmail.length<1) {
       fromEmail=text;
       }

            return angular.isUndefined(fromEmail)?text:fromEmail;
        }
        else
        {
            return text;
        }
    };
});
/**
 * Created by ssukumaran on 9/10/2015.
 */
angular.module('newsletterApp').filter('unsafeHtml', ['$sce', function($sce)
{
    //return $sce.trustAsHtml;
    return function (htmlText) {
        //console.log(htmlText);
        if(htmlText.indexOf('<style')>-1) {
            var text = htmlText.split('<style')[1].split('</style>')[0]
            // var text = htmlText.match("<style (.*?) </style>");
            if (text != null && !angular.isUndefined(text)) {
                htmlText = htmlText.replace(text, ' [newcss]')
                text = text.replace(/a{/g, ".EmailContent a ")
                text = text.replace(/p{/g, ".EmailContent p ")
                text = text.replace(/img{/g, ".EmailContent img ")
                text = text.replace(/h1/g, ".EmailContent h1 ")
                text = text.replace(/h2/g, ".EmailContent h2 ")
                text = text.replace(/h3/g, ".EmailContent h3 ")
                text = text.replace(/h4/g, ".EmailContent h4 ")
                text = text.replace(/strong/g, ".EmailContent strong ")
                text = text.replace(/b{/g, ".EmailContent b ")
                text = text.replace(/li{/g, ".EmailContent li ")
                text = text.replace(/ul{/g, ".EmailContent ul ")
                text = text.replace(/span{/g, ".EmailContent span ")
                text = text.replace(/ol{/g, ".EmailContent ol ")
                text = text.replace(/body{/g, ".EmailContent body ")
                text = text.replace(/html{/g, ".EmailContent html ")
                text = text.replace(/table{/g, ".EmailContent table ")
                text = text.replace(/td{/g, ".EmailContent td ")
                text = text.replace(/th{/g, ".EmailContent th ")
                text = text.replace(/tr{/g, ".EmailContent tr ")
                text = text.replace(/.button{/g, ".EmailContent .button ")
                text = text.replace(/div{/g, ".EmailContent div")
                text = text.replace(/@media/g, ".EmailContent@media")
                htmlText = htmlText.replace('[newcss]', text);
            }
        }
        if(htmlText.indexOf('<table')>-1) {


            // htmlText = htmlText.replace('<table', '<table id="unreadAppResize" width="100%" style="table-layout:fixed;word-wrap:break-word"')
            htmlText = htmlText.replace('<table', '<table class="unreadAppResize"')
        }
        else if(htmlText.indexOf('<div')>-1)
        {
            htmlText = htmlText.replace('<div', '<div id="unreadAppResize"')
        }
        var regex = /href="([\S]+)"/g;
        var newString = htmlText.toString().replace(regex, "onClick=\"window.parent.open('$1', '_system', 'location=yes')\"");
        return $sce.trustAsHtml(newString);

    }

}]);
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
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('inboxController',inboxController)
    inboxController.$inject= ['$q','dataService','authService','sqlLiteService','$ionicPopover','$filter','$ionicSideMenuDelegate','$scope','$timeout','$ionicHistory','$state','$ionicScrollDelegate']
         function inboxController($q,dataService,authService,sqlLiteService, $ionicPopover,$filter,$ionicSideMenuDelegate,$scope,$timeout,$ionicHistory,$state,$ionicScrollDelegate) {
             authService.broadcastNetworkAvailability();
             var vm = this;
             vm.selectedCategory = '';
             vm.category = [];
             vm.showSearchTextBox = false;
             vm.searchText;
             vm.activeslide = 1;
             vm.inboxItems = [];
             vm.swipedToSave = [];
             vm.pageNumber = 0;
             vm.moreItemsAvailable = false;
             vm.showUndoInbox = false;
             //Undo action.
             vm.showUndoInbox = false;
             vm.undoEmail = {};
             vm.undoEmailIdInbox = 0;
             vm.undoMessageInbox = '';
             vm.showTutorialOverlay = false;
             vm.showloader = true;
             vm.defaultImg = '';
             vm.showDefaultImage = false;
             vm.canrefresh = true;
             vm.viewMoreLoader=false;
             vm.pullRefreshText=authService.isNetworkAvailable()?"Pull to refresh...":"Network unavailable"
             vm.lastId=0
             vm.UnreadCount=0;
             populateCategory();
//===============================POPULATE INBOX ITEMS================================================
             vm.populateNewsletters = function () {

                 var deferred = $q.defer();
                 vm.pageNumber = vm.pageNumber + 1;
                 if(vm.inboxItems.length<1)
                 {
                     vm.moreItemsAvailable = true;
                 }
                 if (vm.moreItemsAvailable) {
                     vm.moreItemsAvailable = false;
                     if(vm.pageNumber>1)
                     {
                         vm.viewMoreLoader=true;
                     }

                     sqlLiteService.getEmailsFromDeviceDB('Inbox', vm.pageNumber,vm.lastId).then(function (data) {

                         if (!angular.isUndefined(data) && data != null && data.length) {
                             vm.showDefaultImage = false;
                             var startIndex=1;

                             angular.forEach(data, function (item) {
                                 vm.inboxItems.push(item);
                                 if(vm.inboxItems.length==1)
                                 {
                                     vm.lastId=item.emailid

                                 }
                                if(startIndex==data.length)
                                {

                                    vm.viewMoreLoader=false;
                                   vm.showloader=false;
                                    vm.showDefaultImage =false;

                                    vm.moreItemsAvailable = true;
                                   // $ionicScrollDelegate.getScrollView().options.scrollingY = false;
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                }
                                 startIndex++;
                             })



                             getEmailCount();
                         }
                         else {
                             vm.moreItemsAvailable = false;
                             vm.viewMoreLoader=false;
                             vm.showloader=false;
                             $scope.$broadcast('scroll.infiniteScrollComplete');
                         }

                         if (vm.inboxItems.length==0) {
                             //console.log(vm.inboxItems.length);
                             vm.moreItemsAvailable = false;
                             vm.showDefaultImage =true;
                             getEmailCount();
                         }


                         deferred.resolve(true);

                     }, function (err) {
                         $scope.$broadcast('scroll.infiniteScrollComplete');
                         vm.viewMoreLoader=false;
                         vm.showloader=false;
                         deferred.resolve(false);
                     })
                 }

                 return deferred.promise;
             }

             //$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
             //
             //});

             $scope.$on("$ionicView.enter",function()
             {
                 vm.selectedCategory = '';
                 initGetEmails();
                     vm.checkForNewEmails();
             })

//===============================SWIPE==============================================================
             vm.onSlide = function (id, index) {
                 vm.undoEmailIdInbox = id;
                 var status = 0;

                 if (index === 0) {
                     status = 2
                     vm.undoMessageInbox = "1 item moved to saved.";
                 }
                 else {
                     status = 3
                     vm.undoMessageInbox = "1 item deleted.";
                 }
                 $ionicSideMenuDelegate.canDragContent(false);
                 sqlLiteService.updateEmailToDeviceDB(id, status).then(function (data) {
                     if (data) {
                         dataService.updateEmail(id, status).then(function (dataApi) {
                             if (!dataApi.isSuccessful && dataApi.saveToApiLog) {
                                 var statusChangeData = {Emailid: id, StatusId: status}
                                 var statusData = {
                                     apiCallType: 'emailStatusChange',
                                     dataObject: JSON.stringify(statusChangeData)
                                 }
                                 sqlLiteService.InsertIntoApiFailedLog(statusData);
                             }
                         })
                         vm.removeEmail(id);
                     }

                 })

                 vm.showUndoInbox = true;
                 hideUndo();
             }

             vm.removeEmail = function (id) {
                 var found = $filter('filter')(vm.inboxItems, {emailid: id}, true);
                 if (found.length) {
                     var idx = vm.inboxItems.indexOf(found[0]);
                     vm.inboxItems.splice(idx, 1);
                     vm.undoEmail = found[0];
                 }
                 if(vm.inboxItems.length<10)
                 {
                     vm.populateNewsletters();
                 }
                 if(vm.inboxItems.length<1) {
                     vm.showDefaultImage = true;
                 }
             }
//===============================DO REFRESH=========================================================
             vm.doRefresh = function () {
                 if (vm.canrefresh && authService.isAuthenticated()) {
                     vm.canrefresh = false;
                     sqlLiteService.syncMemberEmailsToDeviceDB().then(function (id) {

                         if(id>0)
                         {
                             sqlLiteService.getNewEmailsFromDeviceDB('Inbox',id).then(function(newdata)
                             {

                                 if (!angular.isUndefined(newdata) && newdata != null && newdata.length) {
                                     angular.forEach(newdata, function (item) {
                                        // console.log(vm.selectedCategory)
                                        // console.log(item.categoryId)
                                         if(vm.selectedCategory>0 && item.categoryId==vm.selectedCategory)
                                         {
                                             vm.inboxItems.unshift(item);
                                         }
                                         else if(vm.selectedCategory===0 ||vm.selectedCategory === ''){
                                             vm.inboxItems.unshift(item);
                                         }
                                     });

                                     vm.showDefaultImage = false;
                                     vm.canrefresh = true;
                                     $scope.$broadcast('scroll.refreshComplete');
                                 }
                                 else{
                                     vm.canrefresh = true;
                                     $scope.$broadcast('scroll.refreshComplete');
                                 }
                             },function(err)
                             {
                                 vm.canrefresh = true;
                                 $scope.$broadcast('scroll.refreshComplete');
                             })
                         }
                         else{
                             //vm.moreItemsAvailable = true;
                             //vm.pageNumber =0;
                             //vm.inboxItems = [];
                             //vm.populateNewsletters();
                             vm.canrefresh = true;
                             $scope.$broadcast('scroll.refreshComplete');
                         }
                     });
                 }
                 else {
                     $scope.$broadcast('scroll.refreshComplete');
                 }
             }
//===============================CATEGORY DROP DOWN=========================================================
             function populateCategory() {

                 //mprogress.start();
                 if (angular.isUndefined(localStorage.showTutorialOverlay)) {
                     vm.showTutorialOverlay = true;
                 }
                 sqlLiteService.getNewsLetterCategoriesFromDeviceDB(false).then(function (data) {
                     if (data===null || angular.isUndefined(data.categories)) {
                         console.log("No data is available");
                     }
                     else {

                         vm.category = data.categories;
                     }
                 });
             }

             vm.categoryChanged = function () {
                 var val=vm.selectedCategory;
                 if(val.length>0) {

                     vm.pageNumber = 0;
                     vm.inboxItems = [];
                     vm.moreItemsAvailable=false;
                     vm.lastId=0;
                     sqlLiteService.getEmailsByCategory('Inbox', val).then(function (data) {

                         if (!angular.isUndefined(data) && data != null && data.length) {
                             //vm.pageNumber = 0;
                             //vm.inboxItems = [];
                             //vm.moreItemsAvailable=false;
                             //vm.lastId=0;
                             angular.forEach(data, function (item) {
                                 vm.inboxItems.push(item);

                             })
                             vm.showDefaultImage = false
                         }
                         else
                         {
                             vm.showDefaultImage = true;
                         }
                     });
                 }
                else{
                     initGetEmails();
                 }
             }

             function initGetEmails()
             {
                 vm.moreItemsAvailable = true;
                 vm.pageNumber =0;
                 vm.inboxItems = [];
                 vm.lastId=0;
                 vm.populateNewsletters().then(function(result)
                 {

                     sqlLiteService.syncMemberEmailsToDeviceDB().then(function (id) {

                         if(id>0)
                         {
                             sqlLiteService.getNewEmailsFromDeviceDB('Inbox',id).then(function(newdata)
                             {
                                 if (!angular.isUndefined(newdata) && newdata != null && newdata.length) {
                                     angular.forEach(newdata, function (item) {
                                         vm.inboxItems.unshift(item);
                                     });
                                 }
                             })
                         }
                         else{
                             //vm.moreItemsAvailable = true;
                             //vm.pageNumber =0;
                             //vm.inboxItems = [];
                             //vm.populateNewsletters();
                         }
                     });

                 })
             }
//==========================================vm.undoPreviousActionInbox()=======================================
             vm.undoPreviousActionInbox = function () {

                 vm.showUndoInbox = false;
                 if (vm.undoEmailIdInbox > 0) {
                     sqlLiteService.updateEmailToDeviceDB(vm.undoEmailIdInbox, 1).then(function (data) {
                         vm.inboxItems.push(vm.undoEmail);
                         vm.showUndoInbox = false;
                         vm.undoEmailIdInbox = 0;
                         vm.showDefaultImage = false;
                         dataService.updateEmail(vm.undoEmailIdInbox, 1).then(function (updateData) {

                         })

                     });
                 }
             }
//==========================================hideUndo=======================================
             function hideUndo() {
                 $timeout(function () {
                     vm.showUndoInbox = false;
                     vm.undoEmailIdInbox = 0;
                 }, 3000);
             }

//==========================================Get Total========================================
             function getEmailCount() {
                 sqlLiteService.getEmailCount().then(function (result) {
                     vm.defaultImg = result > 0 ? 'img/newsletter/default_not_first.png' : 'img/newsletter/default_inbox.png';
                 })
             }

//================================================close tutorial overlay=======================
             vm.closeTutorialOverlay = function () {
                 vm.showTutorialOverlay = false;
                 localStorage.showTutorialOverlay = 'false'
             }

//============================================Go to search=====================================
             vm.gotosearch=function()
             {
                 $ionicHistory.nextViewOptions({
                     historyRoot: true
                 });
                 $state.transitionTo("app.search",{status:'Inbox'});
             }
 //====================================================================================

             $scope.$on('UnreadCount', function(event,data) {

                 vm.UnreadCount=data;
             });
//====================================================================================
             vm.checkForNewEmails=function() {
                 if (authService.isAuthenticated()) {
                     $timeout(function () {
                         vm.doRefresh();
                         vm.checkForNewEmails();
                     }, 30000)
                 }
             }
//Modify as changed in modal=========================================================================================
           vm.updateEmailFromModal=function(ids) {
               angular.forEach(ids, function (id) {
                   vm.removeEmail(id);
               })
           }
//CAHNGE CSS ============================================================================================
             vm.updateCssFromModal=function(ids)
             {
                 angular.forEach(ids,function(id)
                 {
                     var elementId='email'+id;
                     var myElement = document.getElementById(elementId)
                     if(myElement!=null) {
                         myElement.style.backgroundColor = '#eee';
                     }

                 })
             }
         }
})();
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
/**
 * Created by ssukumaran on 8/4/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('notificationController',notificationController)
    notificationController.$inject=['$scope', '$rootScope', '$ionicUser', '$ionicPush']
    function notificationController($scope, $rootScope, $ionicUser, $ionicPush) {

        $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
            alert("Successfully registered token " + data.token);
            console.log('Ionic Push: Got token ', data.token, data.platform);
            $scope.token = data.token;
        });
        $scope.identifyUser = function() {
            alert('s');
            var user = $ionicUser.get();
            if(!user.user_id) {
                // Set your user_id here, or generate a random one.
                user.user_id = $ionicUser.generateGUID();
            };

            // Metadata
            angular.extend(user, {
                name: 'shivani',
                bio: 'Developer at wiredmessenger'
            });

            // Identify your user with the Ionic User Service
            $ionicUser.identify(user).then(function(){
                $scope.identified = true;
                console.log('Identified user ' + user.name + '\n ID ' + user.user_id);
            });
        };

        // REGISTER THE PUSH NOTIFICATION
        $scope.pushRegister = function() {
            console.log('Ionic Push: Registering user');

            // Register with the Ionic Push service.  All parameters are optional.
            $ionicPush.register({
                canShowAlert: true, //Can pushes show an alert on your screen?
                canSetBadge: true, //Can pushes update app icon badges?
                canPlaySound: true, //Can notifications play a sound?
                canRunActionsOnWake: true, //Can run actions outside the app,
                onNotification: function(notification) {
                    // Handle new push notifications here
                    console.log("true");
                    return true;
                }
            });
        };

    }
})();

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
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('savedController',savedController)
    savedController.$inject= ['dataService','authService','sqlLiteService','$filter','$ionicSideMenuDelegate','$scope','$timeout','$ionicHistory','$state']
    function savedController( dataService,authService,sqlLiteService,$filter,$ionicSideMenuDelegate,$scope,$timeout,$ionicHistory,$state) {
        authService.broadcastNetworkAvailability();
        var vm = this;
        vm.selectedCategory = '';
        vm.category = [];
        vm.showSearchTextBox = false;
        vm.searchText;
        vm.activeslide = 1;
        vm.inboxItems = [];
        vm.swipedToSave = [];
        vm.pageNumber = 0;
        vm.moreItemsAvailable = false;
        vm.showUndoInbox = false;
        //Undo action.
        vm.showUndoInbox = false;
        vm.undoEmail = {};
        vm.undoEmailIdInbox = 0;
        vm.undoMessageInbox = '';
        vm.showTutorialOverlay = false;
        vm.showloader = true;
        vm.showDefaultImage = false;
        vm.canrefresh = true;
        vm.viewMoreLoader=false;
        vm.UnreadCount=0;
        vm.lastId=0
        vm.pullRefreshText=authService.isNetworkAvailable()?"Pull to refresh...":"Network unavailable"
        vm.canrefresh = true;
        populateCategory();

        //--POPULATE SAVED ITEMS----------------------------------------------------------------------------------------
       vm.populateNewsletters=function()
        {
            if(vm.inboxItems.length<1)
            {
                vm.moreItemsAvailable = true;
            }
            vm.pageNumber=vm.pageNumber+1;
            if (vm.moreItemsAvailable) {
                if(vm.pageNumber>1)
                {
                    vm.viewMoreLoader=true;
                }
                sqlLiteService.getEmailsFromDeviceDB('Save', vm.pageNumber, vm.lastId).then(function (data) {
                    vm.moreItemsAvailable = false;
                    if (!angular.isUndefined(data) && data != null && data.length) {
                        vm.showDefaultImage =false;
                        var startIndex=1;
                        angular.forEach(data, function (item) {
                            vm.inboxItems.push(item);
                            if(vm.inboxItems.length==1)
                            {
                                vm.lastId=item.emailid
                            }

                            if(startIndex==vm.inboxItems.length)
                            {
                                vm.viewMoreLoader=false;
                                vm.showloader=false;
                                vm.showDefaultImage = false;

                            }
                            startIndex++;
                        })
                        vm.moreItemsAvailable = true;

                    }
                    else {
                        vm.moreItemsAvailable = false;
                        vm.viewMoreLoader=false;
                        vm.showloader=false;
                        if(vm.inboxItems.length<1) {
                            vm.showDefaultImage = true;
                        }

                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (err) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    vm.showloader=false;
                    vm.viewMoreLoader=false;
                    vm.showloader=false;
                })
            }

        }
        $scope.$on("$ionicView.enter",function()
        {
            vm.lastId = 0;
            vm.moreItemsAvailable = true;
            vm.pageNumber = 0;
            vm.inboxItems = [];
            vm.selectedCategory = '';
            vm.populateNewsletters();
            //if( vm.lastId<1) {
            //    vm.lastId = 0;
            //    vm.moreItemsAvailable = true;
            //    vm.pageNumber = 0;
            //    vm.inboxItems = [];
            //    vm.populateNewsletters();
            //}
            //else{
            //    vm.canrefresh=true;
            //    vm.doRefresh();
            //}
        });

//===============================SWIPE==============================================================
        vm.onSlide = function (id, index) {
            vm.undoEmailIdInbox = id;
            var status = 0;

            if (index === 0) {
                status = 1
                vm.undoMessageInbox = "1 item moved to inbox.";
            }
            else {
                status = 3
                vm.undoMessageInbox = "1 item deleted.";
            }
            $ionicSideMenuDelegate.canDragContent(false);
            sqlLiteService.updateEmailToDeviceDB(id, status).then(function (data) {
                if (data) {
                    dataService.updateEmail(id, status).then(function (dataApi) {
                        if (!dataApi.isSuccessful && dataApi.saveToApiLog) {
                            var statusChangeData = {Emailid: id, StatusId: status}
                            var statusData = {
                                apiCallType: 'emailStatusChange',
                                dataObject: JSON.stringify(statusChangeData)
                            }
                            sqlLiteService.InsertIntoApiFailedLog(statusData);
                        }
                    })
                    vm.removeEmail(id);
                }

            })

            vm.showUndoInbox = true;
            hideUndo();
        }

        vm.removeEmail = function (id) {
            var found = $filter('filter')(vm.inboxItems, {emailid: id}, true);
            if (found.length) {
                var idx = vm.inboxItems.indexOf(found[0]);
                vm.inboxItems.splice(idx, 1);
                vm.undoEmail = found[0];
            }
            if(vm.inboxItems.length<10)
            {
                vm.populateNewsletters();
            }
            if(vm.inboxItems.length<1) {
                vm.showDefaultImage = true;
            }

        }
 //===============================DO REFRESH=========================================================
        vm.doRefresh = function () {
            if (vm.canrefresh) {
                vm.canrefresh = false;
                if(vm.lastId>0) {
                    sqlLiteService.getNewEmailsFromDeviceDB('Save',vm.lastId).then(function(newdata)
                    {

                        if (!angular.isUndefined(newdata) && newdata != null && newdata.length) {
                            angular.forEach(newdata, function (item) {
                                vm.inboxItems.unshift(item);
                            });
                            vm.showDefaultImage = false;
                            vm.canrefresh = true;
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                        else{
                            vm.canrefresh = true;
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    },function(err)
                    {
                        vm.canrefresh = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                }
                else
                {
                    vm.pageNumber = 0;
                    vm.populateNewsletters();
                    vm.canrefresh = true;
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }
        }
//===============================CATEGORY DROP DOWN=========================================================
        function populateCategory() {

            //mprogress.start();
            if (angular.isUndefined(localStorage.showTutorialOverlay)) {
                vm.showTutorialOverlay = true;
            }
            sqlLiteService.getNewsLetterCategoriesFromDeviceDB(false).then(function (data) {
                if (data == null || angular.isUndefined(data.categories) ) {
                    console.log("No data is available");
                }
                else {

                    vm.category = data.categories;
                }
            });
        }

        vm.categoryChanged = function () {
            vm.showDefaultImage = false;
            var val=vm.selectedCategory;
            if(val.length>0) {
                vm.pageNumber = 0;
                vm.inboxItems = [];
                vm.moreItemsAvailable=false;
                vm.lastId=0;
                sqlLiteService.getEmailsByCategory('Save', val).then(function (data) {

                    if (!angular.isUndefined(data) && data != null && data.length) {
                        //vm.pageNumber = 0;
                        //vm.inboxItems = [];
                        //vm.moreItemsAvailable=false;
                        //vm.lastId=0;
                        angular.forEach(data, function (item) {
                            vm.inboxItems.push(item);

                        })

                    }
                    else
                    {
                        vm.showDefaultImage = true;
                    }
                });
            }
            else{
                vm.lastId = 0;
                vm.moreItemsAvailable = true;
                vm.pageNumber = 0;
                vm.inboxItems = [];
                vm.populateNewsletters();
            }
        }

//==========================================vm.undoPreviousActionInbox()=======================================
        vm.undoPreviousActionInbox = function () {

            vm.showUndoInbox = false;
            if (vm.undoEmailIdInbox > 0) {
                sqlLiteService.updateEmailToDeviceDB(vm.undoEmailIdInbox, 2).then(function (data) {
                    dataService.updateEmail(vm.undoEmailIdInbox, 2).then(function (updateData) {
                        vm.inboxItems.push(vm.undoEmail);
                        vm.showUndoInbox = false;
                        vm.undoEmailIdInbox = 0;
                        vm.showDefaultImage = false;
                    })

                });
            }
        }
//==========================================hideUndo=======================================
        function hideUndo() {
            $timeout(function () {
                vm.showUndoInbox = false;
                vm.undoEmailIdInbox = 0;
            }, 3000);
        }
//============================================Go to search=====================================
        vm.gotosearch=function()
        {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.transitionTo("app.search",{status:'Save'});
        }
  //====================================================================================
        $scope.$on('UnreadCountSaved', function(event,data) {

            vm.UnreadCount=data;
        });
//===========================================================================================
        vm.updateEmailFromModal=function(ids)
        {
            angular.forEach(ids,function(id)
            {
                vm.removeEmail(id);
            })
        }


 //CAHNGE CSS ============================================================================================
        vm.updateCssFromModal=function(ids)
        {
            angular.forEach(ids,function(id)
            {
                var elementId='email'+id;
                var myElement = document.getElementById(elementId)
                if(myElement!=null) {
                    myElement.style.backgroundColor = '#eee';
                }

            })
        }
    };

})();
/**
 * Created by ssukumaran on 9/29/2015.
 */
angular.module('newsletterApp').directive('ionSearch', ['$timeout', function( $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
            search: '=?filter'
        },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};
            var last_search;
            $timeout(function() {
                //console.log(element);
                //element[1].focus();
                var serarchEle=document.getElementById('search')
                if(serarchEle!=null)
                {
                    serarchEle.focus();
                }
                if(ionic.Platform.isAndroid()){
                    cordova.plugins.Keyboard.show();
                }
            }, 150);
            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {

                scope.$watch('search.value', function (newValue, oldValue) {

                        if (newValue.length > attrs.minLength) {
                            last_search=newValue;
                            $timeout(function() {
                                if(last_search==newValue) {
                                    scope.getData({str: newValue})
                                }
                            },1000);
                        } else {
                            scope.model = [];
                        }
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
        '<i class="icon ion-android-search"></i>' +
        '<input type="search" id="search" placeholder="{{placeholder}}" ng-model="search.value" autofocus>' +
        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close" ></i>' +
        '</div>'
    };
}]);
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('searchController',searchController)
    searchController.$inject= ['dataService','sqlLiteService','$filter','$scope','$timeout','$stateParams','$ionicHistory','$state','$ionicSideMenuDelegate']
    function searchController(dataService,sqlLiteService,$filter,$scope,$timeout,$stateParams, $ionicHistory,$state, $ionicSideMenuDelegate) {
        var vm = this;
        vm.selectedCategory =angular.isUndefined( $stateParams.category)?'':$stateParams.category
        vm.category = [];
        vm.activeslide = 1;
        vm.inboxItems = [];
        vm.searchItems=[];
        vm.swipedToSave = [];
        vm.pageNumber = 0;
        vm.moreItemsAvailable = true;
        vm.showUndoInbox = false;
        //Undo action.
        vm.showUndoInbox = false;
        vm.undoEmail = {};
        vm.undoEmailIdInbox = 0;
        vm.undoMessageInbox = '';
        vm.showTutorialOverlay = false;
        vm.showloader = true;
        vm.defaultImg = 'img/newsletter/default_inbox.png';
        vm.showDefaultImage = false;
        vm.canrefresh = true;
        vm.emailStatus=$stateParams.status;
        vm.searchPhase;
        //console.log( vm.selectedCategory)


//===============================SWIPE==============================================================
        vm.onSlide = function (id, index) {
            vm.undoEmailIdInbox = id;
            var status = 0;

            if (index === 0) {
                status = vm.emailStatus==='Inbox'?2:1;
                vm.undoMessageInbox = "1 item moved to"+vm.emailStatus==='Inbox'?" saved.":"inbox";
            }
            else {
                status = 3
                vm.undoMessageInbox = "1 item deleted.";
            }
            $ionicSideMenuDelegate.canDragContent(false);
            sqlLiteService.updateEmailToDeviceDB(id, status).then(function (data) {
                if (data) {
                    dataService.updateEmail(id, status).then(function (dataApi) {
                        if (!dataApi.isSuccessful && dataApi.saveToApiLog) {
                            var statusChangeData = {Emailid: id, StatusId: status}
                            var statusData = {
                                apiCallType: 'emailStatusChange',
                                dataObject: JSON.stringify(statusChangeData)
                            }
                            sqlLiteService.InsertIntoApiFailedLog(statusData);
                        }
                    })
                    vm.removeEmail(id);
                }

            })

            vm.showUndoInbox = true;
            hideUndo();
        }

        vm.removeEmail = function (id) {
            var found = $filter('filter')(vm.inboxItems, {emailid: id}, true);
            if (found.length) {
                var idx = vm.inboxItems.indexOf(found[0]);
                vm.inboxItems.splice(idx, 1);
                vm.undoEmail = found[0];
            }
        }


//==========================================vm.undoPreviousActionInbox()=======================================
        vm.undoPreviousActionInbox = function () {

            vm.showUndoInbox = false;
            if (vm.undoEmailIdInbox > 0) {
                var  unDoStatus = vm.emailStatus==='Inbox'?1:2;
                sqlLiteService.updateEmailToDeviceDB(vm.undoEmailIdInbox, unDoStatus).then(function (data) {


                    vm.inboxItems.push(vm.undoEmail);
                    vm.showUndoInbox = false;
                    vm.undoEmailIdInbox = 0;
                    dataService.updateEmail(vm.undoEmailIdInbox, unDoStatus).then(function (updateData) {

                    })

                });
            }
        }
//==========================================hideUndo=======================================
        function hideUndo() {
            $timeout(function () {
                vm.showUndoInbox = false;
                vm.undoEmailIdInbox = 0;
            }, 3000);
        }


//==============================================vm.goback()=====================================
        vm.goback=function() {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            if(vm.emailStatus==='Inbox')
            {
                $state.go("app.inbox");
            }
            else {
                $state.go("app.saved");
            }
        }
//==========================================Broad cast==============================================
        $scope.getEmails=function(phase)
{
    vm.searchPhase=phase;

    sqlLiteService.search(phase,vm.emailStatus).then(function(results)
    {

        vm.inboxItems=[];
        vm.inboxItems=results;
        return results;
    }
    ,function(err)
        {
            console.log(err)
            return null
        })
}

        //CAHNGE CSS ============================================================================================
        vm.updateCssFromModal=function(id)
        {

                var elementId='email'+id;
                var myElement = document.getElementById(elementId)
                if(myElement!=null) {
                    myElement.style.backgroundColor = '#eee';
                }


        }
    }
})();
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
/**
 * Created by ssukumaran on 7/16/2015.
 */
/**
 * Created by ssukumaran on 4/15/2015.
 */
angular.module('newsletterApp').factory('authService',authService)
authService.$inject=['$http','$q', '$rootScope','envVariables','$cordovaNetwork'];
function authService($http, $q,$rootScope,envVariables,$cordovaNetwork){
    var urlBase = envVariables.url;
    $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin,Content-Type, X-Requested-With,Accept'
    };
    $http.defaults.useXDomain = true;
    var authserviceData={

        isAuthenticated:isAuthenticated,
        logout:logout,
        CheckEmailAddressAvailability:CheckEmailAddressAvailability,
        SaveMember:SaveMember,
        GetMemberById:GetMemberById,
        getoAuth:getoAuth,
        isNetworkAvailable:isNetworkAvailable,
        login:login,
        forgotPassword:forgotPassword,
        broadcastNetworkAvailability:broadcastNetworkAvailability

    };
//Check Internet connection

    function isNetworkAvailable()
    {
        if(window.Connection) {
            if (navigator.connection.type == Connection.NONE) {

                return false;
            }
            return true;
        }
        else{

            return window.navigator.onLine;

        }
       // return true;
    }

    function broadcastNetworkAvailability()
    {

        if(window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $rootScope.$broadcast('networkAvailable',false);
                return false;
            }
            return true;
        }
        else{
            $rootScope.$broadcast('networkAvailable',window.navigator.onLine);
            return window.navigator.onLine;

        }
    }
    // METHODS RELATED TO LOGIN AND LOGOUT
    function isAuthenticated() {
        if(!angular.isUndefined(localStorage.oAuth) && localStorage.oAuth.length>0) {
            var oAuth = JSON.parse(localStorage.oAuth);
            if (oAuth != null && !angular.isUndefined(oAuth) && oAuth.access_token.length > 0) {
                return true;
            }
            else{
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    function login(email,password)
    {
        var deferred = $q.defer()
        //CONSTRUCTOR THE POST DATTA
        var dataObject={email:email,Password:password};
        var url=envVariables.login
        //MAKE POST CALL
        $http({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:"userName=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password) +
            "&grant_type=password"

        })
            .success(function(data)
            {
                //set the http headers
                if(data.access_token.length>0) {
                    //$http.defaults.headers.common.Authorization = data.access_token;
                    data.email=email;
                    data.password=password;
                    var someDate = new Date();
                    data.expiry=someDate.setDate(someDate.getDate()+28);
                    setOauth(data);
                    $rootScope.$broadcast('user:loggedIn',data);
                    deferred.resolve(data);
                }
                deferred.resolve(false);
            }).error(function(err) {
                var data={};
                data.email=email;
                data.password=password;
                data.access_token=null;
                data.error_description="An error has occured in api";
                if(err!=null)
                {
                    data.error_description=err.error_description;
                }
                console.log(err);
                deferred.resolve(data);
            })
        return deferred.promise;
    }
    function setOauth(oAuth)
    {
        localStorage.oAuth ='';
        //localStorage.clear();
        localStorage.oAuth = JSON.stringify(oAuth);
    }
    function logout()
    {
        localStorage.removeItem('oAuth');
        //localStorage.oAuth ='';
       // localStorage.clear();
       // $http.defaults.headers.common.Authorization = '';
        $rootScope.$broadcast('user:loggedOut',true);
        //$rootScope.$broadcast('UnreadCount',0);
        //$rootScope.$broadcast('UnreadCountSaved',0);
        return true;
    }

    function getoAuth()
    {
        if(!angular.isUndefined(localStorage.oAuth) && localStorage.oAuth.length>0){
        var oauth=JSON.parse(localStorage.oAuth);
            if(oauth.expiry < Date.now() && isNetworkAvailable() )
            {
                login(oauth.email,oauth.password).then(function (data) {
                    return JSON.parse(localStorage.oAuth);
                });
            }
            else {
                return JSON.parse(localStorage.oAuth);
            }
           // return JSON.parse(localStorage.oAuth);
            //localStorage.users = JSON.stringify([]);
        }
        return null;
    }




    //METHODS RELATED TO SIGN UP
    function CheckEmailAddressAvailability(email) {
        //var url=urlBase+envVariables.CheckEmail+encodeURIComponent(email)
        var url=urlBase+envVariables.checkEmail+email;
        console.log(url);
        var deferred = $q.defer()
        $http.get(url)
            .success(function(data) {

                deferred.resolve(data);
            }).error(function(data) {
                console.log(data);
                deferred.resolve(data);
                //deferred.reject();
            });
        return deferred.promise;
    }
    function SaveMember(dataObject)
    {
        var url=urlBase+envVariables.saveMember;
        var deferred = $q.defer()
        $http({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            },
            data:dataObject
        })
            .success(function(data)
            {
                deferred.resolve(data);
            })
            .error(function(data)
            {
                data={isSuccessful:false,message:"An error has occured please retry again"}
               if(!isNetworkAvailable()  )
               {
                   if(dataObject.id<1) {
                       data = {isSuccessful: false, message: "Please check your internet connection and try again."}
                   }
                   else{
                       data = {isSuccessful: false, message: "",saveToApiLog:true};
                   }
               }


                deferred.resolve(data);
            })

        return deferred.promise;
    }

    function GetMemberById()
    {
        var deferred = $q.defer();
        var oAuth=getoAuth();
        if(!angular.isUndefined(oAuth) && oAuth!=null)
        {
          var id= oAuth.member_id;
          var token='Bearer '+oAuth.access_token;
            console.log(token);
          var headers= {'Content-Type': 'application/json','Authorization':token};
          var url=urlBase+envVariables.getMemberById.replace('[[mid]]',id);
            $http.get(url,{headers:headers})
                .then(function (data) {
                    deferred.resolve(data.data);
                },function(err)
                {
                    deferred.resolve(err.data);
                })
        }
        else{
            deferred.reject();
        }

        return deferred.promise;
    }

    function forgotPassword(email)
    {
        var deferred = $q.defer();
        var url=urlBase+envVariables.forgotPassword+email;
        $http.get(url)
            .success(function (data) {
                deferred.resolve(data);
            }).error (function(data)
            {
                data={isSuccessful:false,message:"An error has occured please retry again"}
                if(!authService.isNetworkAvailable()  )
                {
                    data = {isSuccessful: false, message: "Please check your internet connection and try again or email to support@unreadapp.com"}
                }
                deferred.resolve(data);
            })
        return deferred.promise;
    }
    return authserviceData;
};


/**
 * Created by ssukumaran on 7/16/2015.
 */

angular.module('newsletterApp').factory('dataService', dataService)
dataService.$inject = ['$http', '$q','$filter','CacheFactory','authService'];
function dataService($http, $q,$filter,CacheFactory,authService) {
    var urlBase = envVariables.url;
    $http.defaults.headers.put = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin,Content-Type, X-Requested-With,Accept'
    };

    $http.defaults.useXDomain = true;

    //CACHE OPTIONS
    var inboxCacheKey="inboxCache";
    var newsletterCategoryCacheKey="newsletterCategoryCache";
    var newsletterCache="newsletterCache";

    var newsletterCategoryCache;
    newsletterCategoryCache = CacheFactory('newsletterCategoryCache', {
        maxAge: 60 * 60 * 1000 ,
        deleteOnExpire: 'aggressive',
        onExpire: function (key, value) {
            getNewsletterCategory(false,1).then(function (data) {
                newsletterCategoryCache.put(key, data);
            });
        }
    });
    var newsletters;
    var mainItems ;
    //selected news letter
    var inboxItems ;

    var savedItems;
    var profile;
    return {
        getNewsletterCategory: getNewsletterCategory,
        getNewsletters: getNewsletters,
        getMemberNewsletterEmails:getMemberNewsletterEmails,
        updateEmail:updateEmail,
        saveMemberSignupList:saveMemberSignupList,
        getTrendingNewsletters:getTrendingNewsletters,
        saveNewsletterAsUnsub:  saveNewsletterAsUnsub,
        getMemberNewsletter:getMemberNewsletter,
        sendFeedback:sendFeedback,
        batchUpdateMemberEmailStatus:batchUpdateMemberEmailStatus

    }


    function  getNewsletterCategory(page)
    {
        var url=urlBase+envVariables.getCategory+page;
        var categoryData=null;
        console.log(url);
        var deferred = $q.defer()
        if(authService.isNetworkAvailable()  ) {
            $http.get(url)
                .success(function (data) {
                    data.isSuccessful=true;
                    // put the data into cahce.
                    //newsletterCategoryCache.put(newsletterCategoryCacheKey, data);
                    //console.log('--Http---')
                    //console.log(newsletterCategoryCache.get(newsletterCategoryCacheKey))
                    deferred.resolve(data);
                }).error(function (data) {
                    data = {isSuccessful: false}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
else{
            var data = {isSuccessful: false}
            deferred.resolve(data);
        }
        return deferred.promise;
    }

    function getNewsletters( cId,pagesize) {
        var deferred = $q.defer();
        var url=urlBase+envVariables.getNewsletters.replace('[[pageSize]]',pagesize).replace('[[categoryId]]',cId);
        if(authService.isNetworkAvailable()  ) {
            $http.get(url)
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    data = {isSuccessful: false}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
        else{
            var data = {isSuccessful: false}
            deferred.resolve(data);
        }
        return deferred.promise;
    }

    function getMemberNewsletterEmails(lastSentId)
    {
        var oAuth=authService.getoAuth();
       var token='Bearer '+oAuth.access_token;

        var memberId=oAuth.member_id;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        var url=urlBase+envVariables.getMemberNewsletterEmails.replace('[[lastSentId]]',lastSentId).replace('[[mid]]',memberId);
        if(authService.isNetworkAvailable()  ) {
            $http.get(url, {headers: headers})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    data = {msg: {isSuccessful: false}}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
        else{
           var data = {msg: {isSuccessful: false}}
            deferred.resolve(data);
        }
        return deferred.promise;
    }

    function updateEmail(emailId,statusId)
    {
        //memberId=[[mid]]&emailId=[[emailid]]&statusId=[[statusid]]'

        var oAuth=authService.getoAuth();
        var token='Bearer '+oAuth.access_token;
        var memberId=oAuth.member_id;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        var url=urlBase+envVariables.updateMemberNewsletterEmailStatus.replace('[[mid]]',memberId).replace('[[emailid]]',emailId).replace('[[statusid]]',statusId);
        if(authService.isNetworkAvailable()  ) {
            $http.get(url, {headers: headers})
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    data = {isSuccessful: false, saveToApiLog: !authService.isNetworkAvailable()}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
        else
        {
           var data = {isSuccessful: false, saveToApiLog: true}
            deferred.resolve(data);
        }
        return deferred.promise;

    }

    function batchUpdateMemberEmailStatus(dataObject)
    {
        var oAuth=authService.getoAuth();
        var token='Bearer '+oAuth.access_token;
        var url=urlBase+envVariables.batchUpdateMemberEmailStatus;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: url,
            headers: headers,
            data:dataObject
        })
            .success(function(data)
            {
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(data)
            {
                data={isSuccessful:false,message:"An error has occured please try again"}
                deferred.resolve(data);
            })
        return deferred.promise;
    }
    //METHODS RELATED TO Newsltter
    function saveMemberSignupList(signupIds,newsletterCategoryId)
    {

        var headers= {'Content-Type': 'application/json'}
        var oAuth= authService.getoAuth();
        var  dataObject;
        if(oAuth!=null || !angular.isUndefined(oAuth))
        {
            var token='Bearer '+oAuth.access_token;
            headers= {'Content-Type': 'application/json','Authorization':token};
            dataObject={MemberId:oAuth.member_id,SignupIds:signupIds,NewsletterCategoryId:newsletterCategoryId}
        }


        var url=urlBase+envVariables.saveMemberSignupList;
        var deferred = $q.defer()
        if(authService.isNetworkAvailable()  ) {
            $http({
                method: 'POST',
                url: url,
                headers: headers,
                data: dataObject
            })
                .success(function (data) {

                    deferred.resolve(data);
                })
                .error(function (data) {
                    data = {isSuccessful: false, saveToApiLog: !authService.isNetworkAvailable()}
                    deferred.resolve(data);
                })
        }
        else{
            var data = {isSuccessful: false, saveToApiLog: true}
            deferred.resolve(data);
        }

        return deferred.promise;
    }

    function getTrendingNewsletters()
    {
        var oAuth=authService.getoAuth();
        var token='Bearer '+oAuth.access_token;
        var memberId=oAuth.member_id;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        var url=urlBase+envVariables.getTrendingNewsletters.replace('[[mid]]',memberId);
        if(authService.isNetworkAvailable()  ) {
            $http.get(url, {headers: headers})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    data = {msg: {isSuccessful: false}}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
        else
        {
            var data = {msg: {isSuccessful: false}}
            deferred.resolve(data);
        }
        return deferred.promise;
    }

    function saveNewsletterAsUnsub(nlId)
    {
        var oAuth=authService.getoAuth();
        var token='Bearer '+oAuth.access_token;
        var memberId=oAuth.member_id;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        var url=urlBase+envVariables.saveNewsletterAsUnsub.replace('[[mid]]',memberId).replace('[[id]]',nlId);
        if(authService.isNetworkAvailable()  ) {
            $http.get(url, {headers: headers})
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function (data) {
                    data = {isSuccessful: false, saveToApiLog: !authService.isNetworkAvailable()}
                    deferred.resolve(data);
                    //deferred.reject();
                });
        }
        else{
            var data = {isSuccessful: false, saveToApiLog: !authService.isNetworkAvailable()}
            deferred.resolve(data);
        }
        return deferred.promise;
    }

    function getMemberNewsletter()
        {
            var oAuth=authService.getoAuth();
            var token='Bearer '+oAuth.access_token;
            var memberId=oAuth.member_id;
            var headers= {'Content-Type': 'application/json','Authorization':token};
            var deferred = $q.defer();
            var url=urlBase+envVariables.getMemberNewsletter.replace('[[mid]]',memberId);
            if(authService.isNetworkAvailable()  ) {
                $http.get(url, {headers: headers})
                    .then(function (data) {
                        console.log(data);
                        deferred.resolve(data);
                    }, function (data) {
                        data = {isSuccessful: false}
                        deferred.resolve(data);
                        //deferred.reject();
                    });
            }
            else{
                 var data = {isSuccessful: false}
                deferred.resolve(data);
            }
            return deferred.promise;
        }

    function sendFeedback(dataObject)
    {
        var oAuth=authService.getoAuth();
        var token='Bearer '+oAuth.access_token;
        dataObject.memberId=oAuth.member_id;
        var url=urlBase+envVariables.feedback;
        var headers= {'Content-Type': 'application/json','Authorization':token};
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: url,
            headers: headers,
            data:dataObject
        })
            .success(function(data)
            {
                console.log(data);
                deferred.resolve(data);
            })
            .error(function(data)
            { console.log(data);
                data={isSuccessful:false,message:"An error has occured please retry again"}
                if(!authService.isNetworkAvailable()  )
                {
                        data = {isSuccessful: false, message: "Please check your internet connection and try again or email to support@unreadapp.com"}
                }
                deferred.resolve(data);
            })
        return deferred.promise;

    }

};







/**
 * Created by ssukumaran on 12/1/2015.
 */
angular.module('newsletterApp').factory('$exceptionHandler', function() {
    return function(exception, cause) {
       // alert('s')
        console.log(exception,cause);
        //log.error('angular exception: ' + exception.message + ' (caused by ' + cause + ')');
    };
});


/**
 * Created by ssukumaran on 8/29/2015.
 */

angular.module('newsletterApp').factory('sqlLiteService', sqlLiteService)
sqlLiteService.$inject=['$q', '$rootScope','envVariables','$cordovaSQLite','authService','dataService','$cordovaNetwork','$filter','CacheFactory'];
function sqlLiteService( $q,$rootScope,envVariables,$cordovaSQLite,authService,dataService,$cordovaNetwork,$filter,CacheFactory) {
    createDBTables();
    RunOnLineTask();
    var inboxCache;
   return{
       setMemberTODeviceDB:setMemberTODeviceDB,
       getMemberFromDeviceDB: getMemberFromDeviceDB,
       updateMemberToDeviceDB:updateMemberToDeviceDB,
       getNewsLetterCategoriesFromDeviceDB:getNewsLetterCategoriesFromDeviceDB,
       getNewsletterFromDeviceDB:getNewsletterFromDeviceDB,
       getNewslettersFromDeviceDB:getNewslettersFromDeviceDB,
       insertMemberNewsletterToDeviceDB:insertMemberNewsletterToDeviceDB,
       updateMemberNewsletterToDeviceDB:updateMemberNewsletterToDeviceDB,
       getMemberNewslettersFromDeviceDB:getMemberNewslettersFromDeviceDB,
       getMemberNewsletterCategoryIdsFromDeviceDB:getMemberNewsletterCategoryIdsFromDeviceDB,
       syncMemberEmailsToDeviceDB:syncMemberEmailsToDeviceDB,
       getEmailsFromDeviceDB:getEmailsFromDeviceDB,
       updateEmailToDeviceDB:updateEmailToDeviceDB,
       getTrendingEmailFromDeviceDB:getTrendingEmailFromDeviceDB,
       getEmailDetailfromDeviceDB:getEmailDetailfromDeviceDB,
       getCategoryFromDeviceDB:getCategoryFromDeviceDB,
       saveNewsletterAsUnsubFromDeviceDb:saveNewsletterAsUnsubFromDeviceDb,
       initNewsletterCategory:initNewsletterCategory,
       login:login,
       InsertIntoApiFailedLog:InsertIntoApiFailedLog,
       ProcessApiFailedLog:ProcessApiFailedLog,
       getEmailCount:getEmailCount,
       getEmailBodyfromDeviceDB:getEmailBodyfromDeviceDB,
       search:search,
       getNewEmailsFromDeviceDB:getNewEmailsFromDeviceDB,
       markAsRead:markAsRead,
       veirfySubscribed:veirfySubscribed,
       getEmailsByCategory:getEmailsByCategory
    };


    function createDBTables()
    {

        if(db===null)
        {
            if (window.cordova) {
                db = $cordovaSQLite.openDB({name:'newsletterDB'});

            }else {
                db = window.openDatabase('newsletterDB', '1', 'newsletterDB', 1024 * 1024 * 100);

            }
        }

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS member(id integer primary key,email text , firstName text ,lastName text,phone text,mobileNo text,gender text,postalCode text,password ,language text,birthday text)");
        //newsletter category Db
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS category(id integer primary key,name text,orderNumber integer,iconName text,syncdate text)");
        //newsletter
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS newsletter(id integer primary key,clientId integer,categoryId integer,pointId integer,signupAddress text,domainName text ,imagePath text ,orderNumber integer,syncdate text)");
        //Member newsletter
      //  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS memberNewsletter(id integer primary key,memberId integer,categoryId integer,newsletterId integer,syncdate text)");
        //Member newsletter
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS memberNewsletters(id integer primary key,memberId integer,categoryId integer,newsletters text,syncdate text)");
        //Inbox items
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS newsletterEmail(emailid integer primary key,memberId integer,categoryId integer,newsletterSignupId integer,subject text,fromEmail text ,createdDate text,emailSendingDate text,emailBody text,imagePath text,statusName text,pointforSave integer,pointforNotInterest integer,pointforFeedback integer,pointforShare integer,opened integer)");
        //Trending items
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS trendingEmail(emailid integer primary key,memberId integer,categoryId integer,newsletterSignupId integer,subject text,fromEmail text ,createdDate text,emailSendingDate text,emailBody text,imagePath text,statusName text,pointforSave integer,pointforNotInterest integer,pointforFeedback integer,pointforShare integer,opened integer)");
        //Internet failed log table
        $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS ApiFailedLog(id integer primary key AUTOINCREMENT,memberId integer,apiCallType text,dataObject text,created text)");

        //Create variables

        //if (!CacheFactory.get('inboxCache')) {
        //    inboxCache = CacheFactory('inboxCache',
        //        {
        //            maxAge: 60 * 60 * 1000 ,
        //            deleteOnExpire: 'aggressive',
        //            storageMode: 'localStorage'
        //        });
        //}

    }

    //MEMBER

    function setMemberTODeviceDB(dataObject)
    {
        var deferred = $q.defer();
        var data=false;
        var query = "INSERT INTO member (id , email , firstName ,lastName ,phone ,mobileNo,gender ,postalCode,password ,language,birthday) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.email,dataObject.firstName,dataObject.lastName,dataObject.phone,dataObject.mobileNo,dataObject.gender,dataObject.postalCode,dataObject.password,dataObject.language,dataObject.birthday])
            .then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            data=true;
            deferred.resolve(data);
        }, function (err) {
                console.log(err)
            deferred.resolve(data);
        });

        return deferred.promise;
    }
    function getMemberFromDeviceDB() {
        var deferred = $q.defer();
        var oAuth=authService.getoAuth();
        var id=oAuth.member_id;
        var data =null;
        var query = "SELECT email , firstName ,lastName ,phone ,mobileNo,gender ,postalCode,password ,language,birthday FROM member WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function (res) {
            if (res.rows.length > 0) {
                 data = {
                    email: res.rows.item(0).email,
                    firstName: res.rows.item(0).firstName,
                    lastName: res.rows.item(0).lastName,
                    postalCode: res.rows.item(0).postalCode,
                    password: res.rows.item(0).password,
                    phone:  res.rows.item(0).phone,
                    province:'',
                    city:'',
                    mobileNo: res.rows.item(0).mobileNo,
                    gender: res.rows.item(0).gender,
                    language:res.rows.item(0).language,
                    birthyear:spilitDate(res.rows.item(0).birthday,0),
                     birthmonth:spilitDate(res.rows.item(0).birthday,1),
                     birthdate:spilitDate(res.rows.item(0).birthday,2),
                    id: id

                }
                deferred.resolve(data);
            } else {

                //member is empty get it from api
                var profile=authService.GetMemberById().then(function(data)
                {
                    console.log('m not available')
                    if(!angular.isUndefined(data) && data !=null) {
                       setMemberTODeviceDB(data).then(function (data) {
                           if(data) {
                               dataService.getMemberNewsletter().then(function(mnl)
                                   {
                                       console.log(" nl recvd")
                                       console.log(mnl);
                                       //data.cId,data.nlId
                                       console.log(mnl.data.memberNewsletterSignupList);
                                       if( angular.isDefined(mnl.data.memberNewsletterSignupList) && mnl.data.memberNewsletterSignupList.length)
                                       {var signupIdsCategory=[];
                                           angular.forEach(mnl.data.memberNewsletterSignupList,function(item)
                                           {
                                               var value=item.newsletterSignupId;
                                               var cId=item.categoryId;
                                               var categorysignup=$filter('filter')(signupIdsCategory,{cId:cId},true);

                                               if(!angular.isUndefined(categorysignup) && categorysignup.length)
                                               {
                                                   var rootIndex=signupIdsCategory.indexOf(categorysignup[0]);

                                                   var nlIds=categorysignup[0].nlIds;
                                                   var index = nlIds.indexOf(value );
                                                   if (index > -1) {
                                                       // nlIds.splice(index, 1);
                                                   }
                                                   else {
                                                       nlIds.push(value);
                                                   }
                                                   categorysignup[0].nlIds=nlIds;
                                                   if(categorysignup[0].nlIds.length<1)
                                                   {
                                                       signupIdsCategory.splice(rootIndex,1);
                                                   }
                                                   else {
                                                       signupIdsCategory[rootIndex] = angular.copy(categorysignup[0]);
                                                   }
                                               }
                                               else{
                                                   var nlIds=[];
                                                   nlIds.push(value);
                                                   signupIdsCategory.push({cId:cId,nlIds:nlIds});
                                               }
                                           })
                                           console.log(signupIdsCategory);
                                           insertMemberNewsletterToDeviceDB( signupIdsCategory,true)
                                       }
                                   }
                               );
                               getMemberFromDeviceDB().then(function(profile)
                               {
                                   console.log(profile);
                                   deferred.resolve(profile);
                               })
                           }
                       });
                    }
                    else{
                        authService.logout();
                    }
                })
                console.log("No results found");
                deferred.resolve(data);
            }

        }, function (err) {
            console.error(err);
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    function updateMemberToDeviceDB(dataObject)
    {
        var deferred = $q.defer();
        var data=false;
        var query = "UPDATE member SET  email=(?) , firstName=(?) ,lastName=(?) ,phone=(?) ,mobileNo=(?),gender=(?) ,postalCode=(?),password=(?) ,language=(?),birthday=(?) WHERE id = (?)";
        $cordovaSQLite.execute(db, query, [dataObject.email,dataObject.firstName,dataObject.lastName,dataObject.phone,dataObject.mobileNo,dataObject.gender,dataObject.postalCode,dataObject.password,dataObject.language,dataObject.birthday,dataObject.id])
            .then(function(res) {
                    data=true;
                    deferred.resolve(data);
            }, function (err) {
                deferred.resolve(data);
            });

        return deferred.promise;
    }
    function spilitDate(date,datepart)
    {
        if(!angular.isUndefined(date) && date !=null) {
            return parseInt(date.split(/-/)[datepart], 10);
        }
        else
        {
            return null;
        }
    }
    function getMemberByEmail(email,password)
    {
        var deferred = $q.defer();
        var data =null;
        var query = "SELECT  id, email ,password  FROM member WHERE email = (?) and password=(?)";
        $cordovaSQLite.execute(db, query, [email,password]).then(function (res) {
            if (res.rows.length > 0) {
                data = {
                    success:true,
                    email: res.rows.item(0).email,
                    password: res.rows.item(0).password,
                    id:res.rows.item(0).id
                }
                deferred.resolve(data);
            }
            else{
                data={
                    success:false,
                    message:"Email and Password does not match"
                }
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }
    function login(email,password)
    {

        var deferred = $q.defer()
        if(authService.isNetworkAvailable())
        {
            authService.login(email,password).then(function(data)
            {
                broadcastUnReadCount()
                deferred.resolve(data);
            },function(err)
            {
                deferred.resolve(err);
            })
        }
        else{
            getMemberByEmail(email,password).then(function(memberData) {
                if (memberData.success)
                {
                    var someDate = new Date();
                    someDate.setDate(someDate.getDate()+1);
                    var member = {email: email, password: password,access_token:memberData.id.toString(),member_id:memberData.id,expiry:someDate}
                    localStorage.oAuth ='';
                    localStorage.oAuth = JSON.stringify(member);
                    $rootScope.$broadcast('user:loggedIn',memberData);
                    broadcastUnReadCount()
                    deferred.resolve(member);
            }
                else
            {
                var member = {email: email, password: password,access_token:'',error_description:'The internet is disconnected on your device.Connect to internet and try again'}
                broadcastUnReadCount()
                deferred.resolve(member);
            }

            })
        }
        return deferred.promise;
    }
    //NEWSLETTER Category

    function CreateIndex()
    {
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueId  ON newsletter (categoryId)').then(function (){},function(err){console.log(err)});
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueStatus  ON newsletterEmail (statusName)').then(function (){},function(err){console.log(err)});
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueMemberId  ON newsletterEmail (memberId)').then(function (){},function(err){console.log(err)});
    }
    function initNewsletterCategory()
    {
        CreateIndex();
        var  deferred = $q.defer();
        var promises = [];
        var forceRefresh=true;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                if (now - res.rows.item(0).syncdate < 10000){
                    forceRefresh=true;
                }
                else{
                    forceRefresh=false;
                }
            }
            else{
                forceRefresh=true;
            }
        });
        console.log(forceRefresh);
        if(forceRefresh) {
            getNewsLetterCategoriesFromDeviceDB(true).then(function (data) {
                if(data!=null) {
                    var category = data.categories;
                    var cnt = 1;
                    angular.forEach(category, function (value, key) {
                        getNewsletterFromDeviceDB(value.id, true).then(function (nldata) {
                            promises.push(true);

                            if (cnt == category.length) {

                                $q.all(promises)
                                deferred.resolve(true);
                                //return  deferred.promise;
                            }
                            cnt++;
                        }, function (err) {
                            console.log(err)
                        });
                    });
                }
                else
                {
                    deferred.resolve(false);
                }


            });
        }
        else{
            promises.push(true);
            $q.all(promises)
            deferred.resolve(true);
        }

        return  deferred.promise;
    }
    function insertNewsLetterCategory(data)
    {
        var  deferred = $q.defer();
        var promises = [];
        angular.forEach(data,function(dataObject)
        {
            var now = new Date();
            var syncdate =Math.floor(Date.now() / 1000);


            var query = "INSERT INTO category (id ,name,orderNumber,iconName,syncdate) VALUES (?,?,?,?,?)";
            $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.name,dataObject.orderNumber,dataObject.iconName, syncdate])
                .then(function(res) {
                    console.log("INSERT ID -> " + res.insertId);
                    promises.push(true);
                }, function (err) {
                    console.log(err)

                    deferred.resolve(true);
                });

        })
        $q.all(promises)
        deferred.resolve(true);
        return  deferred.promise;
    }

    function getNewsLetterCategoriesFromDeviceDB(forceRefresh)
    {
        var categories=[];
        var deferred = $q.defer();
        var data=null;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                //check the last synced date
                // if not synced recently.sync it

              if(forceRefresh) {

                  if (now - res.rows.item(0).syncdate < 10000) {
                      console.log('hours do  match');
                      for (var j=0; j<res.rows.length; j++) {
                          var row = res.rows.item(j);
                          categories.push(row);
                      }
                      data = {categories: categories};
                      deferred.resolve(data);
                  }
                  else {
                      console.log('hours do not match');
                      getCatgeoryFromApi(1).then(function (apiData) {
                          if (apiData) {
                              getNewsLetterCategoriesFromDeviceDB(false).then(function (newData) {
                                  deferred.resolve(newData);
                              });
                          }
                          else{
                              deferred.resolve(data);
                          }
                      });
                  }
              }
              else{
                  for (var j=0; j<res.rows.length; j++) {
                      var row = res.rows.item(j);
                      categories.push(row);
                  }
                  data = {categories: categories};
                  deferred.resolve(data);
                  //return deferred.promise;
              }//force refresh ends
            }
            else {
                console.log("No records in Db")
                getCatgeoryFromApi(1).then(function (apiDataNew) {
                        console.log(apiDataNew);
                        if (apiDataNew) {
                            getNewsLetterCategoriesFromDeviceDB(false).then(function(newData)
                            {
                                console.log(newData);
                                deferred.resolve(newData);
                            });
                        }
                        else{
                            deferred.resolve(data);
                        }
                    }
                )
            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getCatgeoryFromApi(page)
    {
        var deferred = $q.defer();
        var getdata=true;
        dataService.getNewsletterCategory(page).then(function(data)
        {
            console.log(data);
            if(angular.isUndefined(data.categories) ||data==null || !data.isSuccessful)
            {
                console.log("No data is available gh");
                getdata=false;
                deferred.resolve(getdata);
            }
            else {

                if(page===1) {
                    $cordovaSQLite.execute(db, "delete from category")

                }
                insertNewsLetterCategory(data.categories).then(function(insertdata)
                        {
                            if (data.currentPage < data.totalPages) {
                                // alert('s');
                                getCatgeoryFromApi(data.currentPage + 1);
                            }
                            else{

                                getdata=true;
                                deferred.resolve(getdata);

                            }
                        })

                    }
        })
        return deferred.promise;
    }

    function getCategoryFromDeviceDB(id)
    {
        var deferred = $q.defer();
        var data=null;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category where id=(?)";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query,[id]).then(function (res) {
            if (res.rows.length > 0) {
                data=res.rows.item(0)
                deferred.resolve(data);
            }
        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    //NEWSLETTER
    function getNewsletterFromDeviceDB(id,forceRefresh) {

        var deferred = $q.defer();
        var data = null;
        var query = "SELECT id,clientId,categoryId ,pointId,signupAddress,domainName,imagePath,orderNumber,syncdate FROM newsletter WHERE categoryId = (?) ORDER BY orderNumber";
        $cordovaSQLite.execute(db, query,[id]).then(function (res) {
            if (res.rows.length > 0) {
                //check the last synced date
                var now = Math.floor(Date.now() / 1000)
                var newsletterSignup=[];
                if(!forceRefresh)
                {
                    for (var j=0; j<res.rows.length; j++) {
                        var row = res.rows.item(j);
                        newsletterSignup.push(row);
                    }
                    data = {newsletterSignup: newsletterSignup};
                    deferred.resolve(data);
                }
                else {
                    if (now - res.rows.item(0).syncdate < 50000) {
                        console.log('hours do  match');
                        for (var j = 0; j < res.rows.length; j++) {
                            var row = res.rows.item(j);
                            newsletterSignup.push(row);
                        }
                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);

                    }
                    else {
                        console.log('hours do not match');
                        getNewsletterFromApi(id).then(function (data) {
                            if (data) {
                                getNewsletterFromDeviceDB(id,false).then(function(newdata)
                                {
                                    deferred.resolve(newdata);
                                });
                            }

                        });
                    }
                }
            }
            else {
                console.log("No records in Db")
                getNewsletterFromApi(id).then(function (data) {
                        if (data) {
                            getNewsletterFromDeviceDB(id,false).then(function(newdata)
                            {

                                deferred.resolve(newdata);
                            });
                        }
                        else{
                            deferred.resolve(data);
                        }
                    }
                )
            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;

    }

    function getNewslettersFromDeviceDB(id,limit,ids) {
        var deferred = $q.defer();
        var data = null;
        var newsletterSignup=[];
        populatenewsletters(id,limit,ids,false).then(function (result)
        {
            if(result!=null) {
                newsletterSignup = result;
            }
           // console.log(newsletterSignup);
            if(ids!=null && ids.length>0 && ids.length<11)
            {
                populatenewsletters(id,limit,ids,true).then(function (result2) {
                    if(result2!=null) {
                        angular.forEach(result2,function(item)
                        {
                            newsletterSignup.push(item);
                        })

                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);
                    }
                    else {
                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);
                    }
                });
            }
            else{
                data = {newsletterSignup: newsletterSignup};
                deferred.resolve(data);
            }

        },function(err)
        {
            deferred.resolve(data);
        });

        return deferred.promise;

    }
    function populatenewsletters(id,limit,ids,notIn)
    {

        var deferred = $q.defer();
        var data = null;
        var query = "SELECT id,clientId,categoryId ,pointId,signupAddress,domainName,imagePath,orderNumber,syncdate FROM newsletter " ;
        if(id>0) {
            query=query+  " WHERE categoryId =" +id;
        }
        if(ids!=null && ids.length>0)
        {
            if(id>0) {
                query=query+' And ';
            }
            else
            {
                query=query+' where ';
            }
            if(notIn)
            {
                query = query + ' id not  in (' + ids + ')';
            }
            else {
                query = query + ' id in (' + ids + ')';
            }
        }
        if(id>0) {
            query = query + " ORDER BY orderNumber ";
        }
        else{
            query = query + " ORDER BY imagePath ";
        }
        if(limit>0)
        {
            query=query+' Limit '+limit
        }
       // console.log(query)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                var newsletterSignup=[];
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    newsletterSignup.push(row);
                }
                data =  newsletterSignup;
               // console.log(data);
                deferred.resolve(data);
            }
            else {
                console.log("No records in Db")
                deferred.resolve(data);

            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    function insertNewsletter(data)
    {
        var  deferred = $q.defer();
        var promises = [];
        angular.forEach(data,function(dataObject)
        {
            var now = new Date();
            var syncdate =Math.floor(Date.now() / 1000);
            var query = "INSERT INTO newsletter (id ,clientId ,categoryId ,pointId ,signupAddress ,domainName ,imagePath,orderNumber ,syncdate) VALUES (?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.clientId,dataObject.categoryId,dataObject.pointId,dataObject.signupAddress,dataObject.domainName,dataObject.imagePath,dataObject.orderNumber,syncdate])
            promises.push(true);
        })
        $q.all(promises)
        deferred.resolve(true);
        return  deferred.promise;
    }
    function getNewsletterFromApi(id){

        var deferred = $q.defer();
        var getdata=true;
        dataService.getNewsletters(id,1000).then(function(data) {
                if(!angular.isUndefined(data.newsletterSignup) && data.newsletterSignup.length >0)
                {
                    var query="delete  from newsletter where categoryId=(?)";
                    $cordovaSQLite.execute(db,query,[id] );
                    insertNewsletter(data.newsletterSignup).then(function(data)
                    {

                        getdata=true;
                        deferred.resolve(getdata);
                    })
                }
                else
                {
                    deferred.resolve(getdata);
                }
            }
        )
        return deferred.promise;

    }

    //MEMBER NEWSLETTER
    function insertMemberNewsletterToDeviceDB(dataObject,updateAll)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        if(updateAll)
        {

            var delQuery = "DELETE FROM memberNewsletters WHERE memberId = (?)";
            $cordovaSQLite.execute(db, delQuery, [id]).then(function()
            {
                console.log('deleted');
            })

        }
        if(!angular.isUndefined(dataObject)) {

            var promises = [];
            var syncdate = Math.floor(Date.now() / 1000);
            angular.forEach(dataObject, function (data) {


                        var query = "INSERT INTO memberNewsletters (memberId ,categoryId ,newsletters ,syncdate) VALUES (?,?,?,?)";
                        $cordovaSQLite.execute(db, query, [id, data.cId,data.nlIds, syncdate]).then(function()
                        {

                        },function(err)
                            {
                                console.log(err);
                            }
                        )

                        promises.push(true);
                    });

            $q.all(promises)
            deferred.resolve(true);
        }
        else{
            deferred.resolve(true);
        }
        return  deferred.promise;

    }
    function updateMemberNewsletterToDeviceDB(dataObject,cId)
    {

        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        if(!angular.isUndefined(dataObject)) {
            var delQuery = "DELETE FROM memberNewsletters WHERE memberId =(?) AND categoryId = (?)";
            $cordovaSQLite.execute(db, delQuery, [id,cId])

            var promises = [];
            var syncdate = Math.floor(Date.now() / 1000);
if(dataObject.length>0) {
    var query = "INSERT INTO memberNewsletters (memberId ,categoryId ,newsletters ,syncdate) VALUES (?,?,?,?)";
    $cordovaSQLite.execute(db, query, [id, cId, dataObject, syncdate])
}
                promises.push(true);

            $q.all(promises)
            deferred.resolve(true);
        }
        else{
            deferred.reject();
        }
        return  deferred.promise;
    }
    function getMemberNewslettersFromDeviceDB(cId) {

        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var signUpIds=[];
        var query = "SELECT newsletters FROM memberNewsletters WHERE memberId = (?)";
        if (cId > 0) {
            query = "SELECT newsletters FROM memberNewsletters WHERE memberId =(?) AND categoryId = (?)";

            $cordovaSQLite.execute(db, query, [id,cId]).then(function(res)
            {
                if(res.rows.length>0) {
                    var row = res.rows.item(0);
                    var ids_str = row.newsletters;
                    var newsletters = ids_str.split(',').map(function (ids_str) {
                        return Number(ids_str);
                    });
                    for (var j = 0; j < newsletters.length; j++) {
                        signUpIds.push(newsletters[j]);
                    }
                    deferred.resolve(signUpIds);
                }
                else
                {
                    deferred.resolve(signUpIds);
                }
            },function(err)
            {
               // console.log(err)
                deferred.resolve(signUpIds);
            });
        }
        else {
            $cordovaSQLite.execute(db, query, [id]).then(function(res) {
                if(res.rows.length>0) {
                    for (var j = 0; j < res.rows.length; j++) {
                        var ids_str = res.rows.item(j).newsletters;
                        var newsletters = ids_str.split(',').map(function (ids_str) {
                            return Number(ids_str);
                        });
                        for (var k = 0; k < newsletters.length; k++) {
                            signUpIds.push(newsletters[k]);
                        }
                    }
                    deferred.resolve(signUpIds);
                }
                else
                    {
                        deferred.resolve(signUpIds);
                    }
            },function(err)
            {
                console.log(err)
                deferred.resolve(signUpIds);
            });

        }
        return  deferred.promise;
    }

    function getMemberNewsletterCategoryIdsFromDeviceDB()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var Ids=[];
        var query = "SELECT categoryId,newsletters FROM memberNewsletters WHERE memberId = (?)";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
            for (var j = 0; j < res.rows.length; j++) {
                var row = res.rows.item(j);
                var ids_str=row.newsletters;
                var nlIds=ids_str.split(',').map(function(ids_str){return Number(ids_str);});
               // console.log(nlIds);
                Ids.push({cId:row.categoryId,nlIds:nlIds});
                //console.log(Ids)
            }
            deferred.resolve(Ids);
        },function(err)
        {
            console.log(err)
            deferred.resolve(Ids);
        });
        return  deferred.promise;
    }
    function veirfySubscribed(nlId,categoryId)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var data={result:false};
        var Ids=[];
        var query = "SELECT categoryId,newsletters FROM memberNewsletters WHERE memberId = (?) AND  categoryId = (?)";
        $cordovaSQLite.execute(db, query, [id,categoryId]).then(function (res) {
            if (res.rows.length > 0) {
                var newsletters=res.rows.item(0).newsletters;
                var nlIds=newsletters.split(',').map(function(ids_str){return Number(ids_str);});
                if(nlIds.indexOf(nlId)>-1) {
                    data={result:true};
                    deferred.resolve(data);
                }
                else
                {
                    deferred.resolve(data);
                }
            }
            else {
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        });
        return  deferred.promise;
    }
    //INBOX ITems
    function syncMemberEmailsToDeviceDB()
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;
            var lastSentId = 0;
            var query = "SELECT emailid  FROM newsletterEmail WHERE memberId = (?)" +
                "ORDER BY emailid DESC " +
                "LIMIT 1";
            $cordovaSQLite.execute(db, query, [id]).then(function (res) {

                if (res.rows.length > 0) {
                    lastSentId = res.rows.item(0).emailid;
                }
                    insertMemberEmailsToDeviceDB(lastSentId).then(function (data) {
                        if(data) {
                            deferred.resolve(lastSentId);
                        }
                        else {
                            deferred.resolve(0);
                        }
                    })

            }, function (err) {
                console.log(err);
                    deferred.resolve(lastSentId);
            } );
        }
        else
        {
            deferred.resolve(lastSentId);

        }
        return  deferred.promise;
    }

    function  insertMemberEmailsToDeviceDB(lastId)
    {

        var deferred = $q.defer();
        var promises = [];
        dataService.getMemberNewsletterEmails(lastId).then(function(data)
        {
            if (data.msg.isSuccessful && data.memberNewsletterEmailList.length>0) {

                angular.forEach(data.memberNewsletterEmailList, function (item)
                {
                    var query="INSERT INTO newsletterEmail(emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                        " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                        ",pointforFeedback ,pointforShare,opened ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute(db, query, [item.emailid ,item.memberId,item.categoryId,item.newsletterSignupId ,item.subject ,item.fromEmail  ,item.createdDate ,item.emailSendingDate ,item.emailBody ,item.imagePath
                        ,item.statusName ,item.pointforSave ,item.pointforNotInterest ,item.pointforFeedback ,item.pointforShare ,0])
                        .then(function(res) {
                            promises.push(true);

                        }, function (err) {
                            console.log(err);
                            promises.push(true);
                        });

                });
                $q.all(promises)
                deferred.resolve(true);
            }
            else {
                deferred.resolve(false);
            }
        });
        return  deferred.promise;
    }

    function getEmailsFromDeviceDB(status,pageNumber,lastId) {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var totalCount = 0;

        var memberNewsletterEmailList = [];
        var offset = (pageNumber - 1) * 10
        offset = isNaN(offset) ? 0 : offset;

        if (!angular.isUndefined(oAuth) && oAuth.member_id > 0) {
            var id = oAuth.member_id;
            //var cacheKey = status + 'items' + id;
            var lastSentId = 0;
            var unreadCountQuery = "select statusName,count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0 group by statusName"
            $cordovaSQLite.execute(db, unreadCountQuery, [id]).then(function (res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).statusName === 'Inbox') {
                            $rootScope.$broadcast('UnreadCount', res.rows.item(i).total);
                        }
                        if (res.rows.item(i).statusName === 'Save') {
                            $rootScope.$broadcast('UnreadCountSaved', res.rows.item(i).total);
                        }
                    }
                }

            }, function (err) {
                console.log(err);

            });


            var query = "SELECT emailid ,emailBody,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare ,opened FROM newsletterEmail WHERE memberId = (?) AND statusName = (?) ";
            if (lastId > 0) {
                query = query + 'And emailId < ' + lastId;
            }
            query = query + "  ORDER BY emailid DESC " +
            " LIMIT 10"
            +
            " OFFSET " + offset;

            $cordovaSQLite.execute(db, query, [id, status]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data = memberNewsletterEmailList;
                    // console.log(data);
                    //if (pageNumber == 1) {
                    //    inboxCache.put(cacheKey, data);
                    //    console.log(inboxCache)
                    //}
                    deferred.resolve(data);
                }
                else {
                    deferred.resolve(data);
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(data);
            });


        }

            else {
                deferred.resolve(data);
            }

        return  deferred.promise;
    }
    function getNewEmailsFromDeviceDB(status,lastId)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();

        var memberNewsletterEmailList=[];


        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;

            broadcastUnReadCount();
            var query = "SELECT emailid,emailBody ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND statusName = (?) " ;
            if(lastId>0)
            {
                query =query + 'And emailId > '+lastId   ;
            }
            query =query +  "  ORDER BY emailid  "


            $cordovaSQLite.execute(db, query, [id, status]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data =  memberNewsletterEmailList;
                    // console.log(data);
                    deferred.resolve(data);
                }
                else{
                    deferred.resolve(data);
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(data);
            });
        }
        else{
            deferred.resolve(data);
        }
        return  deferred.promise;
    }
    function updateEmailToDeviceDB(id,statusId)
    {
        var oAuth = authService.getoAuth();

        var status='Inbox'
        if(statusId===2)
        {
            status='Save';
        }
        if(statusId===3)
        {
            status='Delete';
        }
        var deferred = $q.defer();
        var data=false;
        if(oAuth!=null) {
            var memberid = oAuth.member_id;
            var query = "UPDATE newsletterEmail SET statusName=(?)  WHERE emailid = (?)";
            $cordovaSQLite.execute(db, query, [status, id])
                .then(function (res) {
                    data = true;
                    broadcastUnReadCount();


                    deferred.resolve(data);
                }, function (err) {
                    deferred.resolve(data);
                });

            //get unread count




        }
        return deferred.promise;
    }
    function broadcastUnReadCount()
    {
        var oAuth = authService.getoAuth();
        if(oAuth!=null) {
            var memberid = oAuth.member_id;
            //Inbox
            var unreadInboxCountQuery = "select count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0  And statusName='Inbox'"
            $cordovaSQLite.execute(db, unreadInboxCountQuery, [memberid]).then(function (resCnt) {

                if (resCnt.rows.length > 0) {
                    $rootScope.$broadcast('UnreadCount', resCnt.rows.item(0).total);
                } else {
                    $rootScope.$broadcast('UnreadCount', 0);
                }
            }, function (err) {
                console.log(err);

            });
            //saved
            var unreadSavedCountQuery = "select count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0  And statusName='Save'"
            $cordovaSQLite.execute(db, unreadSavedCountQuery, [memberid]).then(function (resSavedCnt) {
                if (resSavedCnt.rows.length > 0) {
                    $rootScope.$broadcast('UnreadCountSaved', resSavedCnt.rows.item(0).total);
                } else {
                    $rootScope.$broadcast('UnreadCountSaved', 0);
                }
            }, function (err) {
                console.log(err);

            });
        }
        else{
            $rootScope.$broadcast('UnreadCount', 0);
            $rootScope.$broadcast('UnreadCountSaved', 0);
        }


    }
    function insertTrendingEmailToDeviceDB()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        dataService.getTrendingNewsletters().then(function(data){
            if(!angular.isUndefined(data) && data.msg.isSuccessful && data.memberNewsletterEmailList.length>0) {
                var query2 ="DELETE from trendingEmail where memberId=(?)"
                $cordovaSQLite.execute(db, query2,[id]);
                angular.forEach(data.memberNewsletterEmailList, function (item) {
                    var query = "INSERT INTO trendingEmail(emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                                 " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                                 ",pointforFeedback ,pointforShare,opened ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute(db, query, [item.emailid, item.memberId, item.categoryId, item.newsletterSignupId, item.subject, item.fromEmail, item.createdDate, item.emailSendingDate, item.emailBody, item.imagePath
                                             , item.statusName, item.pointforSave, item.pointforNotInterest, item.pointforFeedback, item.pointforShare,0])
                        .then(function (res) {



                        }, function (err) {
                            console.log(err);

                        });

                });
                deferred.resolve(true);
            }
            else{
                deferred.resolve(true);
            }

        });
        return  deferred.promise;
    }
    function getTrendingEmailFromDeviceDB(forceRefresh)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var memberNewsletterEmailList=[];
        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;
            var lastSentId = 0;
            var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare,opened FROM trendingEmail WHERE memberId = (?) " +
                "ORDER BY emailid DESC ";

            $cordovaSQLite.execute(db, query, [id]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data =  memberNewsletterEmailList;
                    deferred.resolve(data);
                }
                else{
                    if(forceRefresh) {
                        insertTrendingEmailToDeviceDB().then(function (indata) {
                            if (indata) {
                                getTrendingEmailFromDeviceDB(false).then(function(newdata)
                                {
                                    deferred.resolve(newdata);
                                });
                            }
                            else{
                                deferred.resolve(data);
                            }
                        })
                    }
                    else{
                        deferred.resolve(data);
                    }
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(false);
            });
        }
        return  deferred.promise;
    }

    function getEmailDetailfromDeviceDB(emailId,status)
    {

        var deferred = $q.defer();
        var data = null;
        var prevEmail=0;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var lastSentId = 0;
        //var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        //    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        //    ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND emailid=(?) AND statusName = (?) " +
        //    "ORDER BY emailid DESC ";
        var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND emailid=(?) AND statusName = (?) " +
            "ORDER BY emailid DESC ";

        var query2 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?)  AND emailid < (?)  AND statusName = (?)" +
            "ORDER BY emailid DESC " +
            "LIMIT 1";
        //var query3 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        //    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        //    ",pointforFeedback ,pointforShare  FROM newsletterEmail WHERE memberId = (?)  AND emailid > (?) AND statusName = (?) " +
        //    "ORDER BY emailid  " +
        //    "LIMIT 1";
        var parmas=[id,emailId,status]
        if(status==='Trending')
        {
            query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                    ",pointforFeedback ,pointforShare FROM trendingEmail WHERE memberId = (?)  AND emailid=(?) "
                    "ORDER BY emailid DESC ";
            query2 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                    ",pointforFeedback ,pointforShare  FROM trendingEmail WHERE memberId = (?)  AND emailid < (?) " +
                    "ORDER BY emailid DESC " +
                    "LIMIT 1";
            //query3 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            //        " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            //        ",pointforFeedback ,pointforShare  FROM trendingEmail WHERE memberId = (?)  AND emailid > (?) " +
            //        "ORDER BY emailid  " +
            //        "LIMIT 1";
            parmas=[id,emailId]
        }
        $cordovaSQLite.execute(db, query,parmas).then(function (res) {

            if (res.rows.length > 0) {
                $cordovaSQLite.execute(db, query2, parmas).then(function (res2) {
                    prevEmail=res2.rows.length>0?res2.rows.item(0):null;
                       data = {email:res.rows.item(0),prevEmail:prevEmail};
                       deferred.resolve(data);
                    //$cordovaSQLite.execute(db, query3,parmas).then(function (res3) {
                    //
                    //
                    //    nextEmail=res3.rows.length>0?res3.rows.item(0):null;
                    //    data = {email:res.rows.item(0),nextEmail:nextEmail,prevEmail:prevEmail};
                    //    deferred.resolve(data);
                    //},function(err)
                    //{
                    //    console.log(err)
                    //    deferred.resolve(data);
                    //});


                },function(err)
                {
                    console.log(err)
                    deferred.resolve(data);
                });

            }
            else{
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        })
        return  deferred.promise;
    }
    function getEmailBodyfromDeviceDB(emailId)
    {

        var deferred = $q.defer();
        var data = null;

        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var lastSentId = 0;
        var query = "SELECT emailBody  FROM newsletterEmail WHERE memberId = (?) AND emailid=(?)  " +
            "ORDER BY emailid DESC ";


        var parmas=[id,emailId]
        if(status==='Trending')
        {
            query = "SELECT emailBody  FROM trendingEmail WHERE memberId = (?)  AND emailid=(?) "
            "ORDER BY emailid DESC ";


        }
        $cordovaSQLite.execute(db, query,parmas).then(function (res) {

            if (res.rows.length > 0) {
               data={emailBody:res.rows.item(0).emailBody}
                deferred.resolve(data);

            }
            else{
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        })
        return  deferred.promise;
    }
    function saveNewsletterAsUnsubFromDeviceDb(nlId,categoryId)
    {
        var deferred = $q.defer();
        var data = false;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var query='SELECT * FROM memberNewsletters WHERE memberId = (?)  AND  categoryId = (?)'
        $cordovaSQLite.execute(db, query, [id,categoryId]).then(function (res) {
            if (res.rows.length > 0) {
                var newsletters=res.rows.item(0).newsletters;
                if(newsletters.indexOf(nlId)>-1)
                { var nlIds=newsletters.split(',').map(function(ids_str){return Number(ids_str);});
                    var index=nlIds.indexOf(nlId)
                    nlIds.splice(index,1);
                    var updatequery="UPDATE memberNewsletters  set newsletters =(?) WHERE memberId = (?)  AND  categoryId = (?)";
                    $cordovaSQLite.execute(db, updatequery, [nlIds,id,categoryId]).then(function (res2) {

                        data = true;
                        deferred.resolve(data);
                    },function(errs)
                    {
                        console.log(errs);
                    })
                }
                else {
                    data = true;
                    deferred.resolve(data);
                }
            }
            else
            {
                data = true;
                deferred.resolve(data);
            }

        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        });
        return  deferred.promise;
    }

    function getEmailCount()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var total=0;
        var query="SELECT count(*) Total  FROM newsletterEmail WHERE memberId = (?)";
        $cordovaSQLite.execute(db, query, [oAuth.member_id]).then(function (res) {

            if (res.rows.length > 0) {
               total=res.rows.item(0).Total;
                deferred.resolve(total);
            }
          else{
                deferred.resolve(total);
            }

        }, function (err) {
            console.log(err);
            deferred.resolve(total);
        } );
        return  deferred.promise;
    }

    function markAsRead(id ,status)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var query="Update newsletterEmail set opened =1  WHERE memberId = (?) AND emailid=(?) AND statusName = '"+status+"' And opened=0 ";
        if(status==='Trending') {
            query="Update trendingEmail set opened =1  WHERE memberId = (?) AND emailid=(?)  And opened=0 ";
        }
        $cordovaSQLite.execute(db, query, [oAuth.member_id,id]).then(function (res) {

                deferred.resolve(true);

        }, function (err) {
            console.log(err);
            deferred.resolve(true);
        } );

        broadcastUnReadCount();
        return  deferred.promise;
    }
    //search

    function search(searchPhase,status)
    {
        //console.log(searchPhase)
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var memberNewsletterEmailList=[];
        var ids=[];
        var query = "SELECT * from(SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare ,opened , 2 rank FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And ( Lower(subject) LIKE '%" +searchPhase.toLowerCase()  +"%'   )"


         query =  query +" UNION SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
         " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
         ",pointforFeedback ,pointforShare ,opened , 1 rank  FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And (  Lower(fromEmail) LIKE '%" +searchPhase.toLowerCase() +"%'   )"
        query =  query +" UNION SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        ",pointforFeedback ,pointforShare ,opened , 3 rank  FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And (  Lower(emailBody) LIKE '%" +searchPhase.toLowerCase() +"%' ) )"+
            " ORDER BY rank ";

       // console.log(query)
        //var query = "SELECT * FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
        //    " And ( Lower(subject) LIKE '%" +searchPhase.toLowerCase() +"%'   OR Lower(fromEmail) LIKE '%" +searchPhase.toLowerCase() +"%'  OR Lower(emailBody) LIKE '%" +searchPhase.toLowerCase() +"%' )" +
        //    " ORDER BY emailid DESC ";
        $cordovaSQLite.execute(db,query).then(function (res) {
       // console.log(res)
            if (res.rows.length > 0) {
                //memberNewsletterEmailList
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    if (ids.indexOf(row.emailid) < 0) {
                        memberNewsletterEmailList.push(row);
                        ids.push(row.emailid)
                    }

                }
            }
                data =  memberNewsletterEmailList;
              // console.log(data);
                deferred.resolve(data);

        },function(err)
        {
            console.log(err);
            data =  memberNewsletterEmailList;
            deferred.resolve(data);
        });
        return  deferred.promise;
    }

    function getEmailsByCategory(status,cId)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var memberNewsletterEmailList=[];
        var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare ,opened FROM newsletterEmail WHERE memberId = (?) AND statusName = (?)  AND categoryId=(?)" ;
        $cordovaSQLite.execute(db, query, [id, status,cId]).then(function (res) {
            if (res.rows.length > 0) {
                //memberNewsletterEmailList
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    memberNewsletterEmailList.push(row);
                }
                data =  memberNewsletterEmailList;
                // console.log(data);
                deferred.resolve(data);
            }
            else{
                deferred.resolve(data);
            }


        }, function (err) {
            console.log(err);
            deferred.resolve(data);
        });
        return  deferred.promise;
    }
    //Api log

    function InsertIntoApiFailedLog(dataObject) {
        if (!angular.isUndefined(dataObject)) {
            var oAuth = authService.getoAuth();
            var member_id=oAuth.member_id
            var query = "INSERT INTO ApiFailedLog (memberId ,apiCallType ,dataObject ,created) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, [member_id ,dataObject.apiCallType ,dataObject.dataObject, new Date()])
                .then(function(res)
            {
                console.log("INSERT ID -> " + res.insertId)
            },function(err)
                {
                    console.log(err);
                });
        }
    }

    function ProcessApiFailedLog()
    {
        var oAuth = authService.getoAuth();
        var member_id=oAuth.member_id
        var deleteQuery="DELETE FROM ApiFailedLog WHERE id=(?)"
        //profile Update
        var profileQuery = "SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"+
            "ORDER BY created DESC "+
            "LIMIT 1";

        $cordovaSQLite.execute(db, profileQuery, [member_id, 'profile']).then(function (res) {
            if (res.rows.length > 0) {
                    authService.SaveMember(JSON.parse(res.rows.item(0).dataObject)).then(function(profileResult)
                    {
                        if(profileResult.isSuccessful)
                        {
                            var table_id=res.rows.item(0).id
                            $cordovaSQLite.execute(db, deleteQuery,[table_id]).then(function()
                            {

                            },function(err)
                            {
                                console.log(err);
                            })
                        }
                    })
            }
        },function(err)
        {
            console.log(err);
        })

        //subscription

        var subQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"+
            "ORDER BY created ";
        $cordovaSQLite.execute(db, subQuery, [member_id, 'sub']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var row=res.rows.item(j);
                    var subData = JSON.parse(row.dataObject)

                    dataService.saveMemberSignupList(subData.signupIds, subData.cId).then();

                    if(j==(res.rows.length-1))
                    {
                        var delsubQuery="Delete FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                        $cordovaSQLite.execute(db, delsubQuery, [member_id, 'sub']).then(function(datadel)
                        {

                        },function(err) {
                            console.log(err);
                        });

                    }

                }//for loop ends
            }
        },function(err)
        {
            console.log(err);
        })

        //email ststus change
        var emailStatusQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)";
        var EmailStatusList=[];

        $cordovaSQLite.execute(db, emailStatusQuery, [member_id, 'emailStatusChange']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var emailStatusData = JSON.parse(res.rows.item(j).dataObject)
                    EmailStatusList.push({Emailid:emailStatusData.Emailid, StatusId:emailStatusData.StatusId});

                }

                if(EmailStatusList.length>0) {
                    var emailStatusDataObject={MemberId:member_id,EmailStatusList:EmailStatusList};

                    dataService.batchUpdateMemberEmailStatus(emailStatusDataObject).then(function (emailStatusDataResult) {
                        if (emailStatusDataResult.isSuccessful) {
                            var emailStatusDeletequery="DELETE FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                            $cordovaSQLite.execute(db, emailStatusDeletequery, [member_id, 'emailStatusChange']).then(function (data) {
                            }, function (err) {
                                console.log(err);
                            })
                        }
                    })
                }
            }
        },function(err)
        {
            console.log(err);
        })

        //Not Interested


        var notInterestedQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)";


        $cordovaSQLite.execute(db, emailStatusQuery, [member_id, 'notInterested']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var row=res.rows.item(j);
                    dataService.saveNewsletterAsUnsub(row.dataObject).then(function(apiData)
                    {

                    });
                    if(j==(res.rows.length-1))
                    {
                        var delNIQuery="Delete FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                        $cordovaSQLite.execute(db,delNIQuery, [member_id, 'notInterested']).then(function(datadel)
                        {

                        },function(err) {
                            console.log(err);
                        });

                    }
                }

                }
        },function(err)
        {
            console.log(err);
        })
    }

    function RunOnLineTask() {
        if (authService.isNetworkAvailable()) {

            var oAuth = authService.getoAuth();
            if (oAuth != null && !angular.isUndefined(oAuth)) {
                var member_id = oAuth.member_id;
                var total = 0;
                var query = 'SELECT count(*) as total  FROM ApiFailedLog WHERE memberId = (?)';
                $cordovaSQLite.execute(db, query, [member_id]).then(function (res) {

                    if (res.rows.length > 0) {
                        total = res.rows.item(0).total;

                        if (!angular.isUndefined(localStorage.oAuth) && localStorage.oAuth.length > 0) {
                            var oauth = JSON.parse(localStorage.oAuth);

                            if (oauth.access_token == oauth.member_id) {
                                authService.login(oauth.email, oauth.password).then(function () {
                                    if (total > 0) {
                                        ProcessApiFailedLog();
                                    }
                                });
                            }
                            else {
                                if (total > 0) {

                                   ProcessApiFailedLog();
                                }
                            }
                        }
                    }
                });
            }//oauth check
        }//
    }// networl check
};
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
/**
 * Created by ssukumaran on 7/21/2015.
 */

angular.module('newsletterApp').directive('passwordMatch', passwordMatch);
function passwordMatch() {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: link
    }
    return directive;
    function link(scope, element, attrs, ngModel) {
        element.bind('blur', function (e) {
            if (!ngModel || !element.val()) return;
            //PASSWORD EMPTY RETURN
            var passwordElement=document.getElementById("password");
            var password=passwordElement.value;
            if(!password ||password.length<1)return;
            var keyProperty = scope.$eval(attrs.passwordMatch);
            var currentValue = element[0].value;
            if(password===currentValue)
            {
                ngModel.$setValidity('passwordMatch', true);
            }
            else {
                console.log('f')
                ngModel.$setValidity('passwordMatch', false);
            }

        });
        element.bind('focus', function (e) {
            ngModel.$setValidity('passwordMatch', true);

        })
    };
};



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
/**
 * Created by ssukumaran on 7/21/2015.
 */



checkEmail.$inject = ['authService'];
angular.module('newsletterApp').directive('checkEmail', checkEmail);

function checkEmail(authService) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: link
    }
    return directive;
    function link(scope, element, attrs, ngModel) {
        element.bind('blur', function (e) {
            if (!ngModel || !element.val()) return;
            var keyProperty = scope.$eval(attrs.checkEmail);
            var currentValue = element.val();
            authService.CheckEmailAddressAvailability(currentValue)
                .then(function (data) {
                    if (currentValue == element.val()) {
                        if(data!=null) {
                            ngModel.$setValidity('checkEmail', !data.isSuccessful);
                        }
                    }
                }, function () {
                    //Probably want a more robust way to handle an error
                    //For this demo we'll set unique to true though
                    ngModel.$setValidity('checkEmail', true);
                });
        });
        element.bind('focus', function (e) {
            scope.vm.signupForm.email.$setValidity('checkEmail', true);

        })
    };
};


/**
 * Created by ssukumaran on 7/20/2015.
 */
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('splashController',splashController)
    splashController.$inject=['$state','$scope','$ionicHistory']
    function splashController($state,$scope, $ionicHistory) {
        ionic.Platform.ready(function(){
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });

            $state.go("app.inbox");
        });



    };//main function end
})();
/**
 * Created by ssukumaran on 8/26/2015.
 */

(function () {
    'use strict';
    angular.module('newsletterApp').controller('subscriptioncategoryController',subscriptioncategoryController)
    subscriptioncategoryController.$inject=['authService','dataService','sqlLiteService','$state','$stateParams','$q','$filter','$ionicHistory','$scope','$ionicPlatform','$timeout']
    function subscriptioncategoryController(authService,dataService,sqlLiteService,$state,$stateParams,$q,$filter,$ionicHistory,$scope,$ionicPlatform,$timeout) {

        var vm=this;
        vm.category={};
        vm.signupIds=[]
        vm.signupIdsCategory=[];
        vm.newsletters=[];
        vm.id=$stateParams.id
        vm.memberSignUpIds=[];
        vm.showloading=true;
        vm.selectAll=false;

 //===============================================Init======================================================
        $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
           // config.enableBack = false;
            populateSignUpIds().then(function(data) {
                populateNewsletters(1);

            });
        });
 //===============================================POULATE NEW LETTER AND CATEGORY ==============================
        function populateNewsletters(page)
        {
            sqlLiteService.getCategoryFromDeviceDB(vm.id).then(function(category)
            {
                vm.category=category;
            })
            sqlLiteService.getNewslettersFromDeviceDB(vm.id,0,null).then(function(data) {
                                    if(!angular.isUndefined(data.newsletterSignup) && data.newsletterSignup.length >0)
                                    {
                                        var nlList=[];
                                        var order=0;
                                        angular.forEach(data.newsletterSignup, function (item) {
                                            if( !angular.isUndefined(vm.signupIds ) &&vm.signupIds.length && vm.signupIds.indexOf(item.id)>-1)
                                            { order=order+1;
                                                nlList.push({nl:item,nlOrder:order});

                                            }
                                        });//end of froeach within newsletters

                                        angular.forEach(data.newsletterSignup, function (item) {
                                            if( angular.isUndefined(vm.signupIds ) || (vm.signupIds.length ===0)||(vm.signupIds.length && vm.signupIds.indexOf(item.id)===-1))
                                            {
                                                order=order+1;
                                                nlList.push({nl:item,nlOrder:order});

                                            }
                                        });//end of froeach within newsletters
                                        vm.newsletters = nlList;
                                        vm.showloading=false;
                                        if(nlList.length==vm.signupIds.length)
                                        {
                                            vm.selectAll=false;
                                        }
                                        else{
                                            vm.selectAll=true;
                                        }
                                       // vm.selectAll=nlList.length==vm.signupIds.length;

                                    }
                                }
                            )
        }
//===============================================Populate Sign Up===============================================
        function populateSignUpIds()
        {
            var deferred = $q.defer()
            vm.signupIds=[];
            var data=false;
            if(vm.id==0)
            {
                sqlLiteService.getMemberNewsletterCategoryIdsFromDeviceDB().then(function (subscriptions) {
                    if (!angular.isUndefined(subscriptions) && subscriptions.length) {

                        vm.signupIds=[];
                        angular.forEach(subscriptions,function(item)
                        { vm.signupIdsCategory.push(item)

                            angular.forEach(item.nlIds,function(nl)
                            {
                                vm.signupIds.push(nl);
                            })

                        })
                        data=true;
                        deferred.resolve(data);

                    }
                    else {
                        deferred.resolve(data);
                    }
                });
            }
            else {
                sqlLiteService.getMemberNewslettersFromDeviceDB(vm.id).then(function (subsscriptions) {
                    if (!angular.isUndefined(subsscriptions) && subsscriptions.length) {
                        vm.signupIds = subsscriptions;
                        data = true;
                        deferred.resolve(data);
                    }
                    else {
                        console.log('no data')
                        deferred.resolve(data);
                    }
                });
            }

            return deferred.promise;
        }
//===============================================Handle selected check box=======================================
        vm.setSelectedList=function(value,cId)
        {
            var idx = vm.signupIds.indexOf(value);
            // is currently selected

            if (idx > -1) {
                vm.signupIds.splice(idx, 1);
            }
            else {
                vm.signupIds.push(value);

            }
            if(vm.id==0)
            {

                var categorysignup=$filter('filter')(vm.signupIdsCategory,{cId:cId},true);

                if(!angular.isUndefined(categorysignup) && categorysignup.length)
                {
                    var rootIndex=vm.signupIdsCategory.indexOf(categorysignup[0]);

                    var nlIds=categorysignup[0].nlIds;
                    var index = nlIds.indexOf(value );
                    if (index > -1) {
                        nlIds.splice(index, 1);
                    }
                    else{
                        nlIds.push(value);
                    }
                    categorysignup[0].nlIds=nlIds;
                    if(categorysignup[0].nlIds.length<1)
                    {
                        vm.signupIdsCategory.splice(rootIndex,1);
                    }
                    else {
                        vm.signupIdsCategory[rootIndex] = angular.copy(categorysignup[0]);
                    }
                }
                else{
                    var nlIds=[];
                    nlIds.push(value);
                    vm.signupIdsCategory.push({cId:cId,nlIds:nlIds});
                }
            }

        }
//===============================================Form sub mit ===================================================
        vm.subscriptionFormsubmit=function() {
            if (!vm.showloading) {
                if(vm.id==0)
                {
                    sqlLiteService.insertMemberNewsletterToDeviceDB( vm.signupIdsCategory,true).then(function(data) {
                        dataService.saveMemberSignupList(vm.signupIds).then(function(data) {

                            if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                                var subData={signupIds:vm.signupIds,cId:0}
                                var signUpData={memberId:0 ,apiCallType:'sub' ,dataObject:JSON.stringify(subData)}
                                sqlLiteService.InsertIntoApiFailedLog(signUpData);
                            }
                            $ionicHistory.nextViewOptions({
                                historyRoot: true
                            });
                            $state.go("app.subscription", {reload: true});
                        });
                    });
                }
                else {
                    sqlLiteService.updateMemberNewsletterToDeviceDB(vm.signupIds, vm.id).then(function (dataapi) {
                        dataService.saveMemberSignupList(vm.signupIds, vm.id).then(function (data) {
                            //$ionicHistory.goBack();
                            if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                                var subData = {signupIds: vm.signupIds, cId: vm.id}
                                var signUpData = {memberId: 0, apiCallType: 'sub', dataObject: JSON.stringify(subData)}
                                sqlLiteService.InsertIntoApiFailedLog(signUpData);

                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                $state.go("app.subscription", {reload: true});
                            }
                            if (data.isSuccessful) {

                                $ionicHistory.nextViewOptions({
                                    historyRoot: true
                                });
                                $state.go("app.subscription", {reload: true});
                            }
                        });
                    });
                }
            }
        }

 //================================================================================================================
        $ionicPlatform.registerBackButtonAction(function () {

            if($state.current.name=="app.subscription-category") {
                if (!vm.showloading) {
                    if (vm.id == 0) {
                        sqlLiteService.insertMemberNewsletterToDeviceDB(vm.signupIdsCategory, true).then(function (data) {
                            dataService.saveMemberSignupList(vm.signupIds).then(function (data) {

                                if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                                    var subData = {signupIds: vm.signupIds, cId: 0}
                                    var signUpData = {
                                        memberId: 0,
                                        apiCallType: 'sub',
                                        dataObject: JSON.stringify(subData)
                                    }
                                    sqlLiteService.InsertIntoApiFailedLog(signUpData);
                                }

                            });
                        });
                    }
                    else {
                        sqlLiteService.updateMemberNewsletterToDeviceDB(vm.signupIds, vm.id).then(function (dataapi) {
                            dataService.saveMemberSignupList(vm.signupIds, vm.id).then(function (data) {
                                //$ionicHistory.goBack();
                                if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                                    var subData = {signupIds: vm.signupIds, cId: vm.id}
                                    var signUpData = {
                                        memberId: 0,
                                        apiCallType: 'sub',
                                        dataObject: JSON.stringify(subData)
                                    }
                                    sqlLiteService.InsertIntoApiFailedLog(signUpData);


                                }

                            });
                        });
                    }
                }
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                navigator.app.backHistory();
            }
            else{
                if($state.current.name=="app.inbox")
                         {
                             navigator.app.exitApp();
                         }
                else
                {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    navigator.app.backHistory();
                }
            }
        }, 200);
//===============================================Select all========================================================
        vm.SelectAllButton=function()
        {
            //vm.selectAll=!vm.selectAll;
            vm.signupIds=[];
            vm.signupIdsCategory=[];
           // if(vm.selectAll)
           // {
                angular.forEach(vm.newsletters,function(item)
                {

                    vm.signupIds.push(item.nl.id)

                })
                if(vm.id==0)
                {
                        angular.forEach(vm.newsletters,function(item)
                        {
                            var value=item.nl.id
                            var cId=item.nl.categoryId;
                            var categorysignup=$filter('filter')(vm.signupIdsCategory,{cId:cId},true);

                            if(!angular.isUndefined(categorysignup) && categorysignup.length)
                            {
                                var rootIndex=vm.signupIdsCategory.indexOf(categorysignup[0]);

                                var nlIds=categorysignup[0].nlIds;
                                var index = nlIds.indexOf(value );
                                if(index<0)
                                {
                                    nlIds.push(value);
                                }
                                //if (index > -1) {
                                //   // nlIds.splice(index, 1);
                                //}
                                //else {
                                //    nlIds.push(value);
                                //}
                                categorysignup[0].nlIds=nlIds;
                                if(categorysignup[0].nlIds.length<1)
                                {
                                    vm.signupIdsCategory.splice(rootIndex,1);
                                }
                                else {
                                    vm.signupIdsCategory[rootIndex] = angular.copy(categorysignup[0]);
                                }
                            }
                            else{
                                var nlIds=[];
                                nlIds.push(value);
                                vm.signupIdsCategory.push({cId:cId,nlIds:nlIds});
                            }
                        })

                }
            $timeout(function() {
                vm.selectAll=false;
            }, 500);

           // }
           // else{
           //     return;
           // }

        }

        vm.UnSelectAllButton=function()
        {

            vm.signupIds=[];
            vm.signupIdsCategory=[];
            $timeout(function() {
                vm.selectAll=true;
            }, 500);
        }
    };//main function end
})();
/**
 * Created by ssukumaran on 8/26/2015.
 */

(function () {
    'use strict';
    angular.module('newsletterApp').controller('subscriptionController',subscriptionController)
    subscriptionController.$inject=['authService','dataService','$state','$ionicHistory','$window','$ionicScrollDelegate','$filter','sqlLiteService','$q','$scope','$rootScope','$timeout']
    function subscriptionController(authService,dataService,$state,$ionicHistory,$window, $ionicScrollDelegate,$filter,sqlLiteService,$q,$scope,$rootScope,$timeout) {
        authService.broadcastNetworkAvailability();
        var vm=this;
        //capturing member signupd ids
        vm.signupIds=[];
        vm.signupIdsCategory=[];
        //Populating newslstters and category from Api
        vm.newsletters=[];
        vm.category=[];
        vm.categoryData=[];
        //activating tabs
        vm.active=-1;
        vm.checkboxRequired=false;
        vm.showloading=true;

        $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
            sqlLiteService.initNewsletterCategory().then(function (initdata) {
                populateSignUpIds().then(function (data) {
                    populateNewsletters(1);

                    if (angular.isDefined(localStorage.cId) && localStorage.cId != null && localStorage.cId.length) {
                        vm.active = parseInt(localStorage.cId);
                        console.log(vm.active)
                    }
                });
            });
        });




//===============================================Populate Sign Up===============================================
        function populateSignUpIds()
        {
            var deferred = $q.defer()
            vm.signupIds=[];
            vm.signupIdsCategory=[];
            var data=false;
            sqlLiteService.getMemberNewsletterCategoryIdsFromDeviceDB().then(function (subscriptions) {
                if (!angular.isUndefined(subscriptions) && subscriptions.length) {

                    vm.signupIds=[];
                    angular.forEach(subscriptions,function(item)
                    { vm.signupIdsCategory.push(item)

                        angular.forEach(item.nlIds,function(nl)
                        {
                            vm.signupIds.push(nl);
                        })

                    })
                    data=true;
                    deferred.resolve(data);

                }
                else{
                    deferred.resolve(data);
                }

            });
            //deferred.resolve(data);
            return deferred.promise;
        }
  //===============================================POULATE NEW LETTER AND CATEGORY FORM API CALL=========================================================================
        function populateNewsletters(page)
        {
            vm.newsletters=[];
            vm.category=[];
            vm.categoryData=[];
            sqlLiteService.getNewsLetterCategoriesFromDeviceDB(false).then(function(data)
            {
                if(data==null || angular.isUndefined(data.categories) || data.categories==null)
                {
                    vm.showloading=false;
                    console.log("No data is available");
                }
                else
                {
                    vm.categoryData=data;
                    var all=[{id:0,name:'All',orderNumber:1,iconName:'ion-ios-world'}];
                    vm.category.push(all);

                        angular.forEach(data.categories, function (cate) {
                            vm.category[0].push(cate);
                        })


                        angular.forEach(vm.category[0], function(value, key) {
                            var categorysignup=$filter('filter')(vm.signupIdsCategory,{cId:value.id},true);
                            var categorySignUpIds=[];
                            if(value.id==0)
                            {
                                categorySignUpIds=vm.signupIds.slice(0,10);
                            }
                           if(!angular.isUndefined(categorysignup) && categorysignup.length)
                           {
                                categorySignUpIds=[];
                               categorySignUpIds=categorysignup[0].nlIds;
                           }

                            sqlLiteService.getNewslettersFromDeviceDB(value.id,10,categorySignUpIds).then(function(data) {
                                    var order=0;
                                    var nlList=[];
                                    if(data !=null && !angular.isUndefined(data.newsletterSignup) && data.newsletterSignup!=null && data.newsletterSignup.length >0)
                                    {
                                        //separate the member subscribed newsletter from mail list
                                        angular.forEach(data.newsletterSignup, function (item) {
                                            if( !angular.isUndefined(vm.signupIds ) &&vm.signupIds.length && vm.signupIds.indexOf(item.id)>-1)
                                            { order=order+1;
                                                nlList.push({nl:item,nlOrder:order});
                                            }
                                            else{
                                               //nlList.push(item);
                                            }

                                        });//end of froeach within newsletters

                                        angular.forEach(data.newsletterSignup, function (item) {

                                            if( angular.isUndefined(vm.signupIds ) ||(vm.signupIds.length===0) || (vm.signupIds.length && vm.signupIds.indexOf(item.id)===-1))
                                            {

                                                order=order+1;
                                                nlList.push({nl:item,nlOrder:order});

                                            }
                                            else{
                                                //nlList.push(item);
                                            }
                                        });//end of froeach within newsletters

                                        //var nl={category:vm.category[0][key],newsletters:nlList,order:value.orderNumber}
                                        var nl={category:value,newsletters:nlList,order:value.orderNumber}
                                        vm.newsletters.push(nl)
                                        vm.showloading=false;

                                    }//end of if condition
                                }
                            )
                        });
                }

            })
        }

 //===============================================Handle selected check box===============================================
        vm.setSelectedList=function(value,cId)
        {

            var idx = vm.signupIds.indexOf(value);
            // is currently selected

            if (idx > -1) {
                vm.signupIds.splice(idx, 1);
            }
            else {
                vm.signupIds.push(value);
            }

            //this is used to save in local device


            var categorysignup=$filter('filter')(vm.signupIdsCategory,{cId:cId},true);
            console.log(cId)
            if(!angular.isUndefined(categorysignup) && categorysignup.length)
            {
                var rootIndex=vm.signupIdsCategory.indexOf(categorysignup[0]);

                var nlIds=categorysignup[0].nlIds;
                var index = nlIds.indexOf(value );
                if (index > -1) {
                    nlIds.splice(index, 1);
                }
                else {
                    nlIds.push(value);
                }
                categorysignup[0].nlIds=nlIds;
                if(categorysignup[0].nlIds.length<1)
                {
                    vm.signupIdsCategory.splice(rootIndex,1);
                }
                else {
                    vm.signupIdsCategory[rootIndex] = angular.copy(categorysignup[0]);
                }
            }
            else{
                var nlIds=[];
                nlIds.push(value);
                vm.signupIdsCategory.push({cId:cId,nlIds:nlIds});
            }

        }
//===============================================SUBSCRIPTION SELECTED SUBMIT TO SAVE TO DB===============================================
//        vm.subscriptionFormsubmit=function()
//        {
//
//                dataService.saveMemberSignupList(vm.signupIds).then(function(data) {
//                        sqlLiteService.insertMemberNewsletterToDeviceDB( vm.signupIdsCategory,true).then(function(data) {
//                            $ionicHistory.nextViewOptions({
//                                historyRoot: true
//                            });
//                            $state.transitionTo("app.inbox");
//                        });
//
//                });
//
//        }
//===============================================ACTIVATE THE SELECTED CATEGORY===============================================
        vm.activateCategory = function(cId) {

            if(cId===vm.active)
            {
                vm.active =-1;
                $ionicScrollDelegate.scrollTop();
            }
            else {
                vm.active = cId
                var categoryClicked=$filter('filter')(vm.category[0],{id:cId},true);

                if(categoryClicked!=null && vm.category[0].indexOf(categoryClicked[0])==(vm.category[0].length-1))
                {
                    $timeout(function() {
                        $ionicScrollDelegate.scrollBottom(true);
                    }, 200);

                }
                else {
                    $ionicScrollDelegate.scrollBy(0, 80, true)
                }
            }


        }

//===============================================-Hadle view more category===============================================
        vm.moreCategory=function(cId)
        {
            localStorage.cId=cId;

            //href="#/app/subscription-category/{{category.category.id}}"
            sqlLiteService.insertMemberNewsletterToDeviceDB( vm.signupIdsCategory,true).then(function(data) {
            dataService.saveMemberSignupList(vm.signupIds).then(function(data) {

                if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                    var subData={signupIds:vm.signupIds,cId:0}
                    var signUpData={memberId:0 ,apiCallType:'sub' ,dataObject:JSON.stringify(subData)}
                    sqlLiteService.InsertIntoApiFailedLog(signUpData);
                }
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $state.transitionTo("app.subscription-category",{id:cId});
                    });
            });
        }
//================================Go InBox==========================================
        vm.gotoInbox=function() {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $state.go("app.inbox");
        }
//===============================================-Scope change===============================================


        //$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        //    console.log(fromState)
        //    if(fromState.name==='app.subscription-category')
        //    {
        //        vm.active=3;
        //    }
        //
        //});
        //=========================================Page change event===================================================
        $scope.$on('$locationChangeStart',function(event,next,current)
        {
            if(current.indexOf("subscription") >-1  && current.indexOf("subscription-category")===-1 && next.indexOf("subscription-category")===-1) {

                sqlLiteService.insertMemberNewsletterToDeviceDB( vm.signupIdsCategory,true).then(function(data) {
                    dataService.saveMemberSignupList(vm.signupIds).then(function(data) {

                        if (!angular.isUndefined(data.isSuccessful) && !data.isSuccessful && data.saveToApiLog) {
                            var subData={signupIds:vm.signupIds,cId:0}
                            var signUpData={memberId:0 ,apiCallType:'sub' ,dataObject:JSON.stringify(subData)}
                            sqlLiteService.InsertIntoApiFailedLog(signUpData);
                        }

                    });
                });

                localStorage.cId='';
            }
        });

    };//main function end
})();
/**
 * Created by ssukumaran on 7/17/2015.
 */
(function () {
    'use strict';
    angular.module('newsletterApp').controller('trendingController',trendingController)
    trendingController.$inject= ['sqlLiteService','$scope','authService']
    function trendingController( sqlLiteService,$scope,authService) {
        authService.broadcastNetworkAvailability()
        var vm = this;
        vm.trendingItems = [];
        vm.showSearchTextBox = false;
        vm.searchText;
        vm.moreDataCanBeLoaded=false;
        vm.showDefaultImage=false;
        vm.showloader = true;


        //--POPULATE SAVED ITEMS----------------------------------------------------------------------------------------
         vm.populateNewsletters=function ()
        {
            sqlLiteService.getTrendingEmailFromDeviceDB(true).then(function(data)
            {
                console.log(data);
                vm.trendingItems  = data;
               if(data===null || !data.length)
               {
                   vm.showDefaultImage=true;
               }
                vm.showloader =false;
            },function(err)
            {
                vm.showloader = false;
            })

        }
        vm. populateNewsletters();

    };
})();
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
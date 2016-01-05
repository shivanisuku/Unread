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
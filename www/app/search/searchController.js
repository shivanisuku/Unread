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
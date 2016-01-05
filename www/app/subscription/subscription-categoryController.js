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
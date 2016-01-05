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
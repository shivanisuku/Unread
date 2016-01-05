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
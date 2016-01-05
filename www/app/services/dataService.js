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







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


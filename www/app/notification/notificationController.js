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

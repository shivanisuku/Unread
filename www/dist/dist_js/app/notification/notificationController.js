!function(){"use strict";function e(e,n,o,t){n.$on("$cordovaPush:tokenReceived",function(n,o){alert("Successfully registered token "+o.token),console.log("Ionic Push: Got token ",o.token,o.platform),e.token=o.token}),e.identifyUser=function(){alert("s");var n=o.get();n.user_id||(n.user_id=o.generateGUID()),angular.extend(n,{name:"shivani",bio:"Developer at wiredmessenger"}),o.identify(n).then(function(){e.identified=!0,console.log("Identified user "+n.name+"\n ID "+n.user_id)})},e.pushRegister=function(){console.log("Ionic Push: Registering user"),t.register({canShowAlert:!0,canSetBadge:!0,canPlaySound:!0,canRunActionsOnWake:!0,onNotification:function(e){return console.log("true"),!0}})}}angular.module("newsletterApp").controller("notificationController",e),e.$inject=["$scope","$rootScope","$ionicUser","$ionicPush"]}();
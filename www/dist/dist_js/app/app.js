var db=null;!function(){"use strict";function e(e,t,a,n,i,o,r,p,s){e.ready(function(){ionic.Platform.isFullScreen=!0,window.cordova&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!1)),window.StatusBar&&StatusBar.styleDefault(),db=window.cordova?o.openDB({name:"newsletterDB"}):window.openDatabase("newsletterDB","1","newsletterDB",104857600)}),n.$on("$stateChangeStart",function(e,n,i,o,r){n.authRequired&&!t.isAuthenticated()&&(a.transitionTo("app.home"),e.preventDefault())}),n.$on("$ionicView.enter",function(){p.canDragContent(!1)}),window.cordova&&setTimeout(function(){s.hide()},3e3)}function t(e,t,a){e.state("app",{url:"/app","abstract":!0,templateUrl:"app/menu/menu.html"}).state("app.login",{url:"/login?:email",views:{menuContent:{templateUrl:"app/login/login.html"}}}).state("app.forgotPassword",{url:"/forgotPassword/:email",views:{menuContent:{templateUrl:"app/forgotPassword/forgotPassword.html"}}}).state("app.signup",{url:"/signup?:email",views:{menuContent:{templateUrl:"app/signup/signup.html"}}}).state("app.profile",{url:"/profile",authRequired:!0,views:{menuContent:{templateUrl:"app/profile/profile.html"}}}).state("app.profileThankYou",{url:"/profileThankYou",authRequired:!0,views:{menuContent:{templateUrl:"app/profile/profileThankYou.html"}}}).state("app.home",{url:"/home",views:{menuContent:{templateUrl:"app/home/home.html"}}}).state("app.inbox",{url:"/inbox",authRequired:!0,views:{menuContent:{templateUrl:"app/inbox/inbox.html"}}}).state("app.saved",{url:"/saved",authRequired:!0,views:{menuContent:{templateUrl:"app/saved/saved.html"}}}).state("app.trending",{url:"/trending",authRequired:!0,views:{menuContent:{templateUrl:"app/trending/trending.html"}}}).state("app.about",{url:"/about",authRequired:!0,views:{menuContent:{templateUrl:"app/about/about.html"}}}).state("app.settings",{url:"/settings",authRequired:!0,views:{menuContent:{templateUrl:"app/settings/settings.html"}}}).state("app.splash",{url:"/splash",authRequired:!0,views:{menuContent:{templateUrl:"app/splash/splash.html"}}}).state("app.feedback",{url:"/feedback",authRequired:!0,views:{menuContent:{templateUrl:"app/feedback/feedback.html"}}}).state("app.search",{url:"/search/:status?:category",authRequired:!0,views:{menuContent:{templateUrl:"app/search/search.html"}}}).state("app.notification",{url:"/notification",authRequired:!0,views:{menuContent:{templateUrl:"app/notification/notification.html"}}}).state("app.subscription",{url:"/subscription",authRequired:!0,views:{menuContent:{templateUrl:"app/subscription/subscription.html"}}}).state("app.subscription-category",{url:"/subscription-category/:id",authRequired:!0,views:{menuContent:{templateUrl:"app/subscription/subscription-category.html"}}}),t.otherwise("app/splash")}e.$inject=["$ionicPlatform","authService","$state","$rootScope","$ionicPopup","$cordovaSQLite","$cordovaNetwork","$ionicSideMenuDelegate","$cordovaSplashscreen"],t.$inject=["$stateProvider","$urlRouterProvider","$ionicConfigProvider"],angular.module("newsletterApp",["ionic","ngMessages","ngAnimate","ngCordova","angular-cache","ionic.service.core","ionic.service.push"]).run(e).config(t).constant("envVariables",envVariables)}();
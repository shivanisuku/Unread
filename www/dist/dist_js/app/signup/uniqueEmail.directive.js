function checkEmail(i){function e(e,c,l,a){c.bind("blur",function(n){if(a&&c.val()){var t=(e.$eval(l.checkEmail),c.val());i.CheckEmailAddressAvailability(t).then(function(i){t==c.val()&&null!=i&&a.$setValidity("checkEmail",!i.isSuccessful)},function(){a.$setValidity("checkEmail",!0)})}}),c.bind("focus",function(i){e.vm.signupForm.email.$setValidity("checkEmail",!0)})}var c={restrict:"A",require:"ngModel",link:e};return c}checkEmail.$inject=["authService"],angular.module("newsletterApp").directive("checkEmail",checkEmail);
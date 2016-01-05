/**
 * Created by ssukumaran on 7/21/2015.
 */

angular.module('newsletterApp').directive('passwordMatch', passwordMatch);
function passwordMatch() {

    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: link
    }
    return directive;
    function link(scope, element, attrs, ngModel) {
        element.bind('blur', function (e) {
            if (!ngModel || !element.val()) return;
            //PASSWORD EMPTY RETURN
            var passwordElement=document.getElementById("password");
            var password=passwordElement.value;
            if(!password ||password.length<1)return;
            var keyProperty = scope.$eval(attrs.passwordMatch);
            var currentValue = element[0].value;
            if(password===currentValue)
            {
                ngModel.$setValidity('passwordMatch', true);
            }
            else {
                console.log('f')
                ngModel.$setValidity('passwordMatch', false);
            }

        });
        element.bind('focus', function (e) {
            ngModel.$setValidity('passwordMatch', true);

        })
    };
};



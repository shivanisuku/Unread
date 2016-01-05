/**
 * Created by ssukumaran on 7/21/2015.
 */



angular.module('newsletterApp').directive('checkEmail', checkEmail);

function checkEmail(authService) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: link
    }
    return directive;
    function link(scope, element, attrs, ngModel) {
        element.bind('blur', function (e) {
            if (!ngModel || !element.val()) return;
            var keyProperty = scope.$eval(attrs.checkEmail);
            var currentValue = element.val();
            authService.CheckEmailAddressAvailability(currentValue)
                .then(function (data) {
                    if (currentValue == element.val()) {
                        if(data!=null) {
                            ngModel.$setValidity('checkEmail', !data.isSuccessful);
                        }
                    }
                }, function () {
                    //Probably want a more robust way to handle an error
                    //For this demo we'll set unique to true though
                    ngModel.$setValidity('checkEmail', true);
                });
        });
        element.bind('focus', function (e) {
            scope.vm.signupForm.email.$setValidity('checkEmail', true);

        })
    };
};


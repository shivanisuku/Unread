/**
 * Created by ssukumaran on 9/29/2015.
 */
angular.module('newsletterApp').directive('ionSearch', function( $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            getData: '&source',
            model: '=?',
            search: '=?filter'
        },
        link: function(scope, element, attrs) {
            attrs.minLength = attrs.minLength || 0;
            scope.placeholder = attrs.placeholder || '';
            scope.search = {value: ''};
            var last_search;
            $timeout(function() {
                //console.log(element);
                //element[1].focus();
                var serarchEle=document.getElementById('search')
                if(serarchEle!=null)
                {
                    serarchEle.focus();
                }
                if(ionic.Platform.isAndroid()){
                    cordova.plugins.Keyboard.show();
                }
            }, 150);
            if (attrs.class)
                element.addClass(attrs.class);

            if (attrs.source) {

                scope.$watch('search.value', function (newValue, oldValue) {

                        if (newValue.length > attrs.minLength) {
                            last_search=newValue;
                            $timeout(function() {
                                if(last_search==newValue) {
                                    scope.getData({str: newValue})
                                }
                            },1000);
                        } else {
                            scope.model = [];
                        }
                });
            }

            scope.clearSearch = function() {
                scope.search.value = '';
            };
        },
        template: '<div class="item-input-wrapper">' +
        '<i class="icon ion-android-search"></i>' +
        '<input type="search" id="search" placeholder="{{placeholder}}" ng-model="search.value" autofocus>' +
        '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close" ></i>' +
        '</div>'
    };
});
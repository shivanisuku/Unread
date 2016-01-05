/**
 * Created by ssukumaran on 10/21/2015.
 */
angular.module('newsletterApp').directive('detectGestures', detectGestures);

function detectGestures($ionicGesture) {
    return {
        restrict :  'A',

        link : function(scope, elem, attrs) {

            //$ionicGesture.on( 'pinchin',function()
            //{
            //
            //    console.log("pinch in");
            //},elem)
                $ionicGesture.on( 'swipeup',function()
                {

                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'swipedown',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)

                $ionicGesture.on( 'pinch',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'pinchin',function()
                {
                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
                $ionicGesture.on( 'pinchout',function()
                {

                    scope.canAnimateSlide=false;
                    scope.slideAnimationMessage='';
                   },elem)
            $ionicGesture.on( 'dragup',function()
            {

                scope.canAnimateSlide=false;
                scope.slideAnimationMessage='';
            },elem)
            $ionicGesture.on( 'dragdown',function()
            {

                scope.canAnimateSlide=false;
                scope.slideAnimationMessage='';
            },elem)
                $ionicGesture.on( 'release',function()
                {
                    scope.canAnimateSlide=true;
                   },elem)
            }

        }

};

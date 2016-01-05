/**
 * Created by ssukumaran on 7/21/2015.
 */



angular.module('newsletterApp').directive('iframeLoaded', iframeLoaded);

function iframeLoaded($filter, $compile, $ionicScrollDelegate) {
    return function(scope, element, attrs) {
//        if (scope.$last) {
//            var BREAKPOINT = 715; // (Arbitrary value!)
//            var scale = Math.pow(window.innerWidth / BREAKPOINT, 1);
//            var width = 100 / scale; // Width in percent
//            offsetLeft = (width - 100) / 2;
//            var IFRAME_HEIGHT;
//
////PREVIOUS EMAIL
//            var prev_email_iframe = document.getElementById('prev_email_iframe');
//            //SCALING
//            if (prev_email_iframe != null && scope.prevEmail!=null) {
//                IFRAME_HEIGHT = parseInt(getComputedStyle(prev_email_iframe).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                prev_email_iframe.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//                //HTML BODY CONTENT
//                prev_email_iframe.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.prevEmail.emailBody)
//            }
////MAIN EMAIL
//            var email_iframe = document.getElementById('email_iframe');
//            if (email_iframe != null) {
//                //SCALING
//                IFRAME_HEIGHT = parseInt(getComputedStyle(email_iframe).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                email_iframe.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//
////HTML BODY CONTENT
//                email_iframe.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.email.emailBody)
//            }
////PREVIOUS EMAIL
//            var prev_email_iframe2 = document.getElementById('prev_email_iframe2');
//            if (prev_email_iframe2 != null && scope.prevEmail !=null) {
//                //SCALING
//                IFRAME_HEIGHT = parseInt(getComputedStyle(prev_email_iframe2).height, 10);
//                var height = IFRAME_HEIGHT  / scale;
//                prev_email_iframe2.setAttribute('style', transformStr({
//                    scale: scale,
//                    translateX: '-' + offsetLeft + '%'
//                }) + '; width: ' + width + '%; ' + 'height: ' + height + 'px');
//                //HTML BODY CONTENT
//                prev_email_iframe2.contentDocument.body.innerHTML = $filter('unsafeHtml')(scope.prevEmail.emailBody)
//            }
//
//
//        }
        if (scope.$last) {

            var initZoom = 0.6;
            var initzoomHeight=1;
            var emailScroll=document.getElementById('emailScroll');
            var mainEmail=document.getElementById('emailBody')
            //var prevEmail=document.getElementById('prevEmail')
            //var prevEmail1=document.getElementById('prevEmail1')
            mainEmail.innerHTML=$filter('unsafeHtml')(scope.email.emailBody);
            var email=mainEmail.getElementsByClassName("unreadAppResize")
            var width=window.screen.width;
            var height=window.screen.height
            if(email[0]!=null && angular.isDefined(email[0]))
            {

                var appliedHeight=height>email[0].scrollHeight?height:email[0].scrollHeight ;
                var newheight=appliedHeight+200;
              // emailScroll.setAttribute('style','width:100%;height:'+appliedHeight+'px')

                var scrollWidth=email[0].scrollWidth;
                var scrollHeight=email[0].scrollHeight
               initZoom=width/scrollWidth;
                initzoomHeight=height/scrollHeight
              //  mainEmail.setAttribute('style','width:100%;height:'+newheight+'px;')
                if(scrollWidth>width )
                {
                    $ionicScrollDelegate.$getByHandle('detailScroller').zoomBy(initZoom);
                    scope.initZoom=initZoom;
                }
                scope.showEmailDSMActionFn();
            }
            //if ( scope.prevEmail !=null) {
            //    prevEmail.innerHTML=$filter('unsafeHtml')(scope.prevEmail.emailBody);
            //    prevEmail1.innerHTML=$filter('unsafeHtml')(scope.prevEmail.emailBody);
            //    $ionicScrollDelegate.$getByHandle('detailScrollerPrev').zoomBy(initZoom);
            //    $ionicScrollDelegate.$getByHandle('detailScrollerPrev1').zoomBy(initZoom);
            //}


        }
    };

};
function transformStr(obj) {
    var obj = obj || {},
        val = '',
        j;
    for ( j in obj ) {
        val += j + '(' + obj[j] + ') ';
    }
    val += 'translateZ(0)';
    return '-webkit-transform: ' + val + '; ' +
        '-moz-transform: ' + val + '; ' +
        'transform: ' + val;
};


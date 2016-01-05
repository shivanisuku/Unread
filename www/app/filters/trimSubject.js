/**
 * Created by ssukumaran on 8/29/2015.
 */
angular.module('newsletterApp').filter('trimSubject', function() {
    return function(text) {
        if(angular.isDefined(text)) {
            var fromEmail=text.substring(0,text.lastIndexOf('<'));
       if(angular.isUndefined(fromEmail) || fromEmail.length<1) {
       fromEmail=text;
       }

            return angular.isUndefined(fromEmail)?text:fromEmail;
        }
        else
        {
            return text;
        }
    };
});
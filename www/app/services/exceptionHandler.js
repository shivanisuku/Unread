/**
 * Created by ssukumaran on 12/1/2015.
 */
angular.module('newsletterApp').factory('$exceptionHandler', function() {
    return function(exception, cause) {
       // alert('s')
        console.log(exception,cause);
        //log.error('angular exception: ' + exception.message + ' (caused by ' + cause + ')');
    };
});


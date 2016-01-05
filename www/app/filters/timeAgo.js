/**
 * Created by ssukumaran on 9/9/2015.
 */
angular.module('newsletterApp').filter('timeAgo', function ($filter) {
//time: the time
//local: compared to what time? default: now
//raw: wheter you want in a format of "5 minutes ago", or "5 minutes"
    return function (time, local, raw) {
        if (!time) return "never";

        if (!local) {
            (local = Date.now())
        }

        //if (angular.isDate(time)) {
        //
        //    time = time.getTime();
        //} else if (typeof time === "string") {
        //    time = new Date(time).getTime();
        //}

        // create Date object for current location
        var d = new Date(time);

        // convert to msec
        // add local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        var offsetl=-5
        // create new Date object for different city
        // using supplied offset
       var  nd = new Date(utc + (offsetl));
        time=nd.getTime();
        if (angular.isDate(local)) {

            local = local.getTime();
        }else if (typeof local === "string") {
            local = new Date(local).getTime();
        }

        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }

        var
            offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744,
            YEAR = 31556926,
            DECADE = 315569260;

        //if (offset <= MINUTE)              span = 'now';
        //else if (offset < (MINUTE * 60))   span = Math.round(Math.abs(offset / MINUTE))+ ' min' ;
        //else if (offset < (HOUR * 24))     span =  Math.round(Math.abs(offset / HOUR))+ ' hr' ;
        //else if (offset < (DAY * 7))       span =  Math.round(Math.abs(offset / DAY))+ Math.round(Math.abs(offset / DAY))>1?' days' :' day';
        if (offset <= MINUTE)              span = 'now';
        else if (offset < (MINUTE * 60))   span =$filter('date')(time, 'h:mm a');
        else if (offset < (HOUR * 24))     span = $filter('date')(time, 'h:mm a');
        else if (offset < (DAY * 7))        span =$filter('date')(time, 'MMM dd');
        // else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
        else if (offset < (WEEK * 52))     span =$filter('date')(time, 'MMM dd');
        else if (offset < (YEAR * 10))     span =$filter('date')(time, 'mediumDate');
        else if (offset < (DECADE * 100)) span =$filter('date')(time, 'mediumDate');
        else                               span = [ '', 'a long time' ];

        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        //span = span.join(' ,');

        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ' : ' ' + span;
    }
});
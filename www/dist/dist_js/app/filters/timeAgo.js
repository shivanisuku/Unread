angular.module("newsletterApp").filter("timeAgo",["$filter",function(e){return function(t,a,n){if(!t)return"never";a||(a=Date.now());var m=new Date(t),i=m.getTime()+6e4*m.getTimezoneOffset(),r=-5,d=new Date(i+r);if(t=d.getTime(),angular.isDate(a)?a=a.getTime():"string"==typeof a&&(a=new Date(a).getTime()),"number"==typeof t&&"number"==typeof a){var u=Math.abs((a-t)/1e3),f=[],o=60,g=3600,l=86400,D=604800,M=31556926,s=315569260;return f=o>=u?"now":60*o>u?e("date")(t,"h:mm a"):24*g>u?e("date")(t,"h:mm a"):7*l>u?e("date")(t,"MMM dd"):52*D>u?e("date")(t,"MMM dd"):10*M>u?e("date")(t,"mediumDate"):100*s>u?e("date")(t,"mediumDate"):["","a long time"],f[1]+=0===f[0]||f[0]>1?"s":"",n===!0?f:a>=t?f+" ":" "+f}}}]);
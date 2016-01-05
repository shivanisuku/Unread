/**
 * Created by ssukumaran on 9/10/2015.
 */
angular.module('newsletterApp').filter('unsafeHtml', function($sce)
{
    //return $sce.trustAsHtml;
    return function (htmlText) {
        //console.log(htmlText);
        if(htmlText.indexOf('<style')>-1) {
            var text = htmlText.split('<style')[1].split('</style>')[0]
            // var text = htmlText.match("<style (.*?) </style>");
            if (text != null && !angular.isUndefined(text)) {
                htmlText = htmlText.replace(text, ' [newcss]')
                text = text.replace(/a{/g, ".EmailContent a ")
                text = text.replace(/p{/g, ".EmailContent p ")
                text = text.replace(/img{/g, ".EmailContent img ")
                text = text.replace(/h1/g, ".EmailContent h1 ")
                text = text.replace(/h2/g, ".EmailContent h2 ")
                text = text.replace(/h3/g, ".EmailContent h3 ")
                text = text.replace(/h4/g, ".EmailContent h4 ")
                text = text.replace(/strong/g, ".EmailContent strong ")
                text = text.replace(/b{/g, ".EmailContent b ")
                text = text.replace(/li{/g, ".EmailContent li ")
                text = text.replace(/ul{/g, ".EmailContent ul ")
                text = text.replace(/span{/g, ".EmailContent span ")
                text = text.replace(/ol{/g, ".EmailContent ol ")
                text = text.replace(/body{/g, ".EmailContent body ")
                text = text.replace(/html{/g, ".EmailContent html ")
                text = text.replace(/table{/g, ".EmailContent table ")
                text = text.replace(/td{/g, ".EmailContent td ")
                text = text.replace(/th{/g, ".EmailContent th ")
                text = text.replace(/tr{/g, ".EmailContent tr ")
                text = text.replace(/.button{/g, ".EmailContent .button ")
                text = text.replace(/div{/g, ".EmailContent div")
                text = text.replace(/@media/g, ".EmailContent@media")
                htmlText = htmlText.replace('[newcss]', text);
            }
        }
        if(htmlText.indexOf('<table')>-1) {


            // htmlText = htmlText.replace('<table', '<table id="unreadAppResize" width="100%" style="table-layout:fixed;word-wrap:break-word"')
            htmlText = htmlText.replace('<table', '<table class="unreadAppResize"')
        }
        else if(htmlText.indexOf('<div')>-1)
        {
            htmlText = htmlText.replace('<div', '<div id="unreadAppResize"')
        }
        var regex = /href="([\S]+)"/g;
        var newString = htmlText.toString().replace(regex, "onClick=\"window.parent.open('$1', '_system', 'location=yes')\"");
        return $sce.trustAsHtml(newString);

    }

});
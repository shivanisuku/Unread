!function(){"use strict";function e(e,o,n,t,a,i,s,l,u){function d(){a(function(){m.showUndoInbox=!1,m.undoEmailIdInbox=0},3e3)}var m=this;m.selectedCategory=angular.isUndefined(i.category)?"":i.category,m.category=[],m.activeslide=1,m.inboxItems=[],m.searchItems=[],m.swipedToSave=[],m.pageNumber=0,m.moreItemsAvailable=!0,m.showUndoInbox=!1,m.showUndoInbox=!1,m.undoEmail={},m.undoEmailIdInbox=0,m.undoMessageInbox="",m.showTutorialOverlay=!1,m.showloader=!0,m.defaultImg="img/newsletter/default_inbox.png",m.showDefaultImage=!1,m.canrefresh=!0,m.emailStatus=i.status,m.searchPhase,m.onSlide=function(n,t){m.undoEmailIdInbox=n;var a=0;0===t?(a="Inbox"===m.emailStatus?2:1,m.undoMessageInbox="1 item moved to"+m.emailStatus=="Inbox"?" saved.":"inbox"):(a=3,m.undoMessageInbox="1 item deleted."),u.canDragContent(!1),o.updateEmailToDeviceDB(n,a).then(function(t){t&&(e.updateEmail(n,a).then(function(e){if(!e.isSuccessful&&e.saveToApiLog){var t={Emailid:n,StatusId:a},i={apiCallType:"emailStatusChange",dataObject:JSON.stringify(t)};o.InsertIntoApiFailedLog(i)}}),m.removeEmail(n))}),m.showUndoInbox=!0,d()},m.removeEmail=function(e){var o=n("filter")(m.inboxItems,{emailid:e},!0);if(o.length){var t=m.inboxItems.indexOf(o[0]);m.inboxItems.splice(t,1),m.undoEmail=o[0]}},m.undoPreviousActionInbox=function(){if(m.showUndoInbox=!1,m.undoEmailIdInbox>0){var n="Inbox"===m.emailStatus?1:2;o.updateEmailToDeviceDB(m.undoEmailIdInbox,n).then(function(o){m.inboxItems.push(m.undoEmail),m.showUndoInbox=!1,m.undoEmailIdInbox=0,e.updateEmail(m.undoEmailIdInbox,n).then(function(e){})})}},m.goback=function(){s.nextViewOptions({historyRoot:!0}),"Inbox"===m.emailStatus?l.go("app.inbox"):l.go("app.saved")},t.getEmails=function(e){m.searchPhase=e,o.search(e,m.emailStatus).then(function(e){return m.inboxItems=[],m.inboxItems=e,e},function(e){return console.log(e),null})},m.updateCssFromModal=function(e){var o="email"+e,n=document.getElementById(o);null!=n&&(n.style.backgroundColor="#eee")}}angular.module("newsletterApp").controller("searchController",e),e.$inject=["dataService","sqlLiteService","$filter","$scope","$timeout","$stateParams","$ionicHistory","$state","$ionicSideMenuDelegate"]}();
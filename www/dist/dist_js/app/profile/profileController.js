!function(){"use strict";function t(t,e,i,a,n,o,r,s,u){function g(){i.getMemberFromDeviceDB().then(function(t){p.signupData=t})}var p=this;p.submitted=!1,p.signupData=[],p.showloading=!1,p.errorMessage,p.showThankYou=!1,p.year=(new Date).getFullYear(),p.maxyear=p.year-13,p.minyear=p.year-150,t.broadcastNetworkAvailability(),u.$on("$ionicView.enter",function(){g()}),p.signFormsubmit=function(e){p.validateDate(),p.submitted=!0,e||p.errorMessage.length>0||(p.showloading=!0,p.signupData.birthday=p.signupData.birthyear+"-"+p.signupData.birthmonth+"-"+p.signupData.birthdate,i.updateMemberToDeviceDB(p.signupData).then(function(e){e&&t.SaveMember(p.signupData).then(function(t){if(t.isSuccessful)p.showloading=!1,s.confirm({title:"Success",content:"Thank you for keeping your profile up to date.",buttons:[{text:"Close",type:"button-positive"}]}).then(function(t){});else if(p.showloading=!1,p.errorMessage=t.message,t.message.length<1){if(!angular.isUndefined(t.saveToApiLog)&&t.saveToApiLog){var e={memberId:p.signupData.id,apiCallType:"profile",dataObject:JSON.stringify(p.signupData)};i.InsertIntoApiFailedLog(e)}s.confirm({title:"Success",content:"Thank you for keeping your profile up todate.",buttons:[{text:"Close",type:"button-positive"}]}).then(function(t){})}})}))},p.validateDate=function(){return(4==p.signupData.birthmonth||6==p.signupData.birthmonth||9==p.signupData.birthmonth||11==p.signupData.birthmonth)&&p.signupData.birthdate>=31?void(p.errorMessage="Please enter valid birth date"):(p.errorMessage="",void(p.signupData.birthmonth>0&&p.signupData.birthdate>0&&(2==p.signupData.birthmonth&&p.signupData.birthdate>29?p.errorMessage="Please enter valid birth date":p.errorMessage="")))},u.$on("$locationChangeStart",function(t,e,i){p.signupForm.$setUntouched(),p.submitted=!1})}angular.module("newsletterApp").controller("profileController",t),t.$inject=["authService","dataService","sqlLiteService","$state","$ionicHistory","$filter","$q","$ionicPopup","$scope"]}();
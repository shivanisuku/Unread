/**
 * Created by ssukumaran on 8/18/2015.
 */
var envVariables={
    dbName:'newsletterDB',
    url:'http://tools-stg1.wiredmessenger.com/WmNewsletterSignupApp/api/',
    login:'http://tools-stg1.wiredmessenger.com/WmNewsletterSignupApp/token',
    checkEmail:'Member/CheckEmailAddressAvailability?emailaddress=',
    checkUsername:'Member/CheckUserNameAvailability?username=',
    getCategory:'Newsletter/GetCategoryList?searchPhrase&status=1&lowerBound=1&upperBound=100&pageSize=100&sortBy=OrderAsc&pageNum=',
    getNewsletters:'Newsletter/GetNewsletterSignupList?status=1&lowerBound=1&upperBound=1000&pageSize=[[pageSize]]&pageNum=1&sortBy=OrderAsc&categoryId=[[categoryId]]',
    saveMember:'Member/SaveMember',
    saveMemberSignupList:'Member/SaveMemberSignupList',
    getMemberNewsletterEmails:'Member/GetMemberNewsletterEmails?lastSentId=[[lastSentId]]&memberId=[[mid]]',
    getMemberById:'Member/GetMemberById?memberId=[[mid]]',
    getTrendingNewsletters:'Member/GetTrendingNewsletters?memberId=[[mid]]',
    updateMemberNewsletterEmailStatus:'Member/UpdateMemberNewsletterEmailStatus?memberId=[[mid]]&emailId=[[emailid]]&statusId=[[statusid]]',
    saveNewsletterAsUnsub:'Member/SaveNewsletterAsUnsub?memberId=[[mid]]&signupId=[[id]]',
    getMemberNewsletter:'Member/GetMemberNewsletter?memberId=[[mid]]',
    feedback:'Member/SendFeedBack',
    batchUpdateMemberEmailStatus:'Member/BatchUpdateMemberEmailStatus',
    forgotPassword:'Member/ForgotPassword?email='
};
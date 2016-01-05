/**
 * Created by ssukumaran on 8/29/2015.
 */

angular.module('newsletterApp').factory('sqlLiteService', sqlLiteService)
sqlLiteService.$inject=['$q', '$rootScope','envVariables','$cordovaSQLite','authService','dataService','$cordovaNetwork','$filter','CacheFactory'];
function sqlLiteService( $q,$rootScope,envVariables,$cordovaSQLite,authService,dataService,$cordovaNetwork,$filter,CacheFactory) {
    createDBTables();
    RunOnLineTask();
    var inboxCache;
   return{
       setMemberTODeviceDB:setMemberTODeviceDB,
       getMemberFromDeviceDB: getMemberFromDeviceDB,
       updateMemberToDeviceDB:updateMemberToDeviceDB,
       getNewsLetterCategoriesFromDeviceDB:getNewsLetterCategoriesFromDeviceDB,
       getNewsletterFromDeviceDB:getNewsletterFromDeviceDB,
       getNewslettersFromDeviceDB:getNewslettersFromDeviceDB,
       insertMemberNewsletterToDeviceDB:insertMemberNewsletterToDeviceDB,
       updateMemberNewsletterToDeviceDB:updateMemberNewsletterToDeviceDB,
       getMemberNewslettersFromDeviceDB:getMemberNewslettersFromDeviceDB,
       getMemberNewsletterCategoryIdsFromDeviceDB:getMemberNewsletterCategoryIdsFromDeviceDB,
       syncMemberEmailsToDeviceDB:syncMemberEmailsToDeviceDB,
       getEmailsFromDeviceDB:getEmailsFromDeviceDB,
       updateEmailToDeviceDB:updateEmailToDeviceDB,
       getTrendingEmailFromDeviceDB:getTrendingEmailFromDeviceDB,
       getEmailDetailfromDeviceDB:getEmailDetailfromDeviceDB,
       getCategoryFromDeviceDB:getCategoryFromDeviceDB,
       saveNewsletterAsUnsubFromDeviceDb:saveNewsletterAsUnsubFromDeviceDb,
       initNewsletterCategory:initNewsletterCategory,
       login:login,
       InsertIntoApiFailedLog:InsertIntoApiFailedLog,
       ProcessApiFailedLog:ProcessApiFailedLog,
       getEmailCount:getEmailCount,
       getEmailBodyfromDeviceDB:getEmailBodyfromDeviceDB,
       search:search,
       getNewEmailsFromDeviceDB:getNewEmailsFromDeviceDB,
       markAsRead:markAsRead,
       veirfySubscribed:veirfySubscribed,
       getEmailsByCategory:getEmailsByCategory
    };


    function createDBTables()
    {

        if(db===null)
        {
            if (window.cordova) {
                db = $cordovaSQLite.openDB({name:'newsletterDB'});

            }else {
                db = window.openDatabase('newsletterDB', '1', 'newsletterDB', 1024 * 1024 * 100);

            }
        }

        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS member(id integer primary key,email text , firstName text ,lastName text,phone text,mobileNo text,gender text,postalCode text,password ,language text,birthday text)");
        //newsletter category Db
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS category(id integer primary key,name text,orderNumber integer,iconName text,syncdate text)");
        //newsletter
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS newsletter(id integer primary key,clientId integer,categoryId integer,pointId integer,signupAddress text,domainName text ,imagePath text ,orderNumber integer,syncdate text)");
        //Member newsletter
      //  $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS memberNewsletter(id integer primary key,memberId integer,categoryId integer,newsletterId integer,syncdate text)");
        //Member newsletter
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS memberNewsletters(id integer primary key,memberId integer,categoryId integer,newsletters text,syncdate text)");
        //Inbox items
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS newsletterEmail(emailid integer primary key,memberId integer,categoryId integer,newsletterSignupId integer,subject text,fromEmail text ,createdDate text,emailSendingDate text,emailBody text,imagePath text,statusName text,pointforSave integer,pointforNotInterest integer,pointforFeedback integer,pointforShare integer,opened integer)");
        //Trending items
        $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS trendingEmail(emailid integer primary key,memberId integer,categoryId integer,newsletterSignupId integer,subject text,fromEmail text ,createdDate text,emailSendingDate text,emailBody text,imagePath text,statusName text,pointforSave integer,pointforNotInterest integer,pointforFeedback integer,pointforShare integer,opened integer)");
        //Internet failed log table
        $cordovaSQLite.execute(db,"CREATE TABLE IF NOT EXISTS ApiFailedLog(id integer primary key AUTOINCREMENT,memberId integer,apiCallType text,dataObject text,created text)");

        //Create variables

        //if (!CacheFactory.get('inboxCache')) {
        //    inboxCache = CacheFactory('inboxCache',
        //        {
        //            maxAge: 60 * 60 * 1000 ,
        //            deleteOnExpire: 'aggressive',
        //            storageMode: 'localStorage'
        //        });
        //}

    }

    //MEMBER

    function setMemberTODeviceDB(dataObject)
    {
        var deferred = $q.defer();
        var data=false;
        var query = "INSERT INTO member (id , email , firstName ,lastName ,phone ,mobileNo,gender ,postalCode,password ,language,birthday) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.email,dataObject.firstName,dataObject.lastName,dataObject.phone,dataObject.mobileNo,dataObject.gender,dataObject.postalCode,dataObject.password,dataObject.language,dataObject.birthday])
            .then(function(res) {
            console.log("INSERT ID -> " + res.insertId);
            data=true;
            deferred.resolve(data);
        }, function (err) {
                console.log(err)
            deferred.resolve(data);
        });

        return deferred.promise;
    }
    function getMemberFromDeviceDB() {
        var deferred = $q.defer();
        var oAuth=authService.getoAuth();
        var id=oAuth.member_id;
        var data =null;
        var query = "SELECT email , firstName ,lastName ,phone ,mobileNo,gender ,postalCode,password ,language,birthday FROM member WHERE id = ?";
        $cordovaSQLite.execute(db, query, [id]).then(function (res) {
            if (res.rows.length > 0) {
                 data = {
                    email: res.rows.item(0).email,
                    firstName: res.rows.item(0).firstName,
                    lastName: res.rows.item(0).lastName,
                    postalCode: res.rows.item(0).postalCode,
                    password: res.rows.item(0).password,
                    phone:  res.rows.item(0).phone,
                    province:'',
                    city:'',
                    mobileNo: res.rows.item(0).mobileNo,
                    gender: res.rows.item(0).gender,
                    language:res.rows.item(0).language,
                    birthyear:spilitDate(res.rows.item(0).birthday,0),
                     birthmonth:spilitDate(res.rows.item(0).birthday,1),
                     birthdate:spilitDate(res.rows.item(0).birthday,2),
                    id: id

                }
                deferred.resolve(data);
            } else {

                //member is empty get it from api
                var profile=authService.GetMemberById().then(function(data)
                {
                    console.log('m not available')
                    if(!angular.isUndefined(data) && data !=null) {
                       setMemberTODeviceDB(data).then(function (data) {
                           if(data) {
                               dataService.getMemberNewsletter().then(function(mnl)
                                   {
                                       console.log(" nl recvd")
                                       console.log(mnl);
                                       //data.cId,data.nlId
                                       console.log(mnl.data.memberNewsletterSignupList);
                                       if( angular.isDefined(mnl.data.memberNewsletterSignupList) && mnl.data.memberNewsletterSignupList.length)
                                       {var signupIdsCategory=[];
                                           angular.forEach(mnl.data.memberNewsletterSignupList,function(item)
                                           {
                                               var value=item.newsletterSignupId;
                                               var cId=item.categoryId;
                                               var categorysignup=$filter('filter')(signupIdsCategory,{cId:cId},true);

                                               if(!angular.isUndefined(categorysignup) && categorysignup.length)
                                               {
                                                   var rootIndex=signupIdsCategory.indexOf(categorysignup[0]);

                                                   var nlIds=categorysignup[0].nlIds;
                                                   var index = nlIds.indexOf(value );
                                                   if (index > -1) {
                                                       // nlIds.splice(index, 1);
                                                   }
                                                   else {
                                                       nlIds.push(value);
                                                   }
                                                   categorysignup[0].nlIds=nlIds;
                                                   if(categorysignup[0].nlIds.length<1)
                                                   {
                                                       signupIdsCategory.splice(rootIndex,1);
                                                   }
                                                   else {
                                                       signupIdsCategory[rootIndex] = angular.copy(categorysignup[0]);
                                                   }
                                               }
                                               else{
                                                   var nlIds=[];
                                                   nlIds.push(value);
                                                   signupIdsCategory.push({cId:cId,nlIds:nlIds});
                                               }
                                           })
                                           console.log(signupIdsCategory);
                                           insertMemberNewsletterToDeviceDB( signupIdsCategory,true)
                                       }
                                   }
                               );
                               getMemberFromDeviceDB().then(function(profile)
                               {
                                   console.log(profile);
                                   deferred.resolve(profile);
                               })
                           }
                       });
                    }
                    else{
                        authService.logout();
                    }
                })
                console.log("No results found");
                deferred.resolve(data);
            }

        }, function (err) {
            console.error(err);
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    function updateMemberToDeviceDB(dataObject)
    {
        var deferred = $q.defer();
        var data=false;
        var query = "UPDATE member SET  email=(?) , firstName=(?) ,lastName=(?) ,phone=(?) ,mobileNo=(?),gender=(?) ,postalCode=(?),password=(?) ,language=(?),birthday=(?) WHERE id = (?)";
        $cordovaSQLite.execute(db, query, [dataObject.email,dataObject.firstName,dataObject.lastName,dataObject.phone,dataObject.mobileNo,dataObject.gender,dataObject.postalCode,dataObject.password,dataObject.language,dataObject.birthday,dataObject.id])
            .then(function(res) {
                    data=true;
                    deferred.resolve(data);
            }, function (err) {
                deferred.resolve(data);
            });

        return deferred.promise;
    }
    function spilitDate(date,datepart)
    {
        if(!angular.isUndefined(date) && date !=null) {
            return parseInt(date.split(/-/)[datepart], 10);
        }
        else
        {
            return null;
        }
    }
    function getMemberByEmail(email,password)
    {
        var deferred = $q.defer();
        var data =null;
        var query = "SELECT  id, email ,password  FROM member WHERE email = (?) and password=(?)";
        $cordovaSQLite.execute(db, query, [email,password]).then(function (res) {
            if (res.rows.length > 0) {
                data = {
                    success:true,
                    email: res.rows.item(0).email,
                    password: res.rows.item(0).password,
                    id:res.rows.item(0).id
                }
                deferred.resolve(data);
            }
            else{
                data={
                    success:false,
                    message:"Email and Password does not match"
                }
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }
    function login(email,password)
    {

        var deferred = $q.defer()
        if(authService.isNetworkAvailable())
        {
            authService.login(email,password).then(function(data)
            {
                broadcastUnReadCount()
                deferred.resolve(data);
            },function(err)
            {
                deferred.resolve(err);
            })
        }
        else{
            getMemberByEmail(email,password).then(function(memberData) {
                if (memberData.success)
                {
                    var someDate = new Date();
                    someDate.setDate(someDate.getDate()+1);
                    var member = {email: email, password: password,access_token:memberData.id.toString(),member_id:memberData.id,expiry:someDate}
                    localStorage.oAuth ='';
                    localStorage.oAuth = JSON.stringify(member);
                    $rootScope.$broadcast('user:loggedIn',memberData);
                    broadcastUnReadCount()
                    deferred.resolve(member);
            }
                else
            {
                var member = {email: email, password: password,access_token:'',error_description:'The internet is disconnected on your device.Connect to internet and try again'}
                broadcastUnReadCount()
                deferred.resolve(member);
            }

            })
        }
        return deferred.promise;
    }
    //NEWSLETTER Category

    function CreateIndex()
    {
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueId  ON newsletter (categoryId)').then(function (){},function(err){console.log(err)});
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueStatus  ON newsletterEmail (statusName)').then(function (){},function(err){console.log(err)});
        $cordovaSQLite.execute(db,'CREATE INDEX IF NOT EXISTS _indexUniqueMemberId  ON newsletterEmail (memberId)').then(function (){},function(err){console.log(err)});
    }
    function initNewsletterCategory()
    {
        CreateIndex();
        var  deferred = $q.defer();
        var promises = [];
        var forceRefresh=true;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                if (now - res.rows.item(0).syncdate < 10000){
                    forceRefresh=true;
                }
                else{
                    forceRefresh=false;
                }
            }
            else{
                forceRefresh=true;
            }
        });
        console.log(forceRefresh);
        if(forceRefresh) {
            getNewsLetterCategoriesFromDeviceDB(true).then(function (data) {
                if(data!=null) {
                    var category = data.categories;
                    var cnt = 1;
                    angular.forEach(category, function (value, key) {
                        getNewsletterFromDeviceDB(value.id, true).then(function (nldata) {
                            promises.push(true);

                            if (cnt == category.length) {

                                $q.all(promises)
                                deferred.resolve(true);
                                //return  deferred.promise;
                            }
                            cnt++;
                        }, function (err) {
                            console.log(err)
                        });
                    });
                }
                else
                {
                    deferred.resolve(false);
                }


            });
        }
        else{
            promises.push(true);
            $q.all(promises)
            deferred.resolve(true);
        }

        return  deferred.promise;
    }
    function insertNewsLetterCategory(data)
    {
        var  deferred = $q.defer();
        var promises = [];
        angular.forEach(data,function(dataObject)
        {
            var now = new Date();
            var syncdate =Math.floor(Date.now() / 1000);


            var query = "INSERT INTO category (id ,name,orderNumber,iconName,syncdate) VALUES (?,?,?,?,?)";
            $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.name,dataObject.orderNumber,dataObject.iconName, syncdate])
                .then(function(res) {
                    console.log("INSERT ID -> " + res.insertId);
                    promises.push(true);
                }, function (err) {
                    console.log(err)

                    deferred.resolve(true);
                });

        })
        $q.all(promises)
        deferred.resolve(true);
        return  deferred.promise;
    }

    function getNewsLetterCategoriesFromDeviceDB(forceRefresh)
    {
        var categories=[];
        var deferred = $q.defer();
        var data=null;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                //check the last synced date
                // if not synced recently.sync it

              if(forceRefresh) {

                  if (now - res.rows.item(0).syncdate < 10000) {
                      console.log('hours do  match');
                      for (var j=0; j<res.rows.length; j++) {
                          var row = res.rows.item(j);
                          categories.push(row);
                      }
                      data = {categories: categories};
                      deferred.resolve(data);
                  }
                  else {
                      console.log('hours do not match');
                      getCatgeoryFromApi(1).then(function (apiData) {
                          if (apiData) {
                              getNewsLetterCategoriesFromDeviceDB(false).then(function (newData) {
                                  deferred.resolve(newData);
                              });
                          }
                          else{
                              deferred.resolve(data);
                          }
                      });
                  }
              }
              else{
                  for (var j=0; j<res.rows.length; j++) {
                      var row = res.rows.item(j);
                      categories.push(row);
                  }
                  data = {categories: categories};
                  deferred.resolve(data);
                  //return deferred.promise;
              }//force refresh ends
            }
            else {
                console.log("No records in Db")
                getCatgeoryFromApi(1).then(function (apiDataNew) {
                        console.log(apiDataNew);
                        if (apiDataNew) {
                            getNewsLetterCategoriesFromDeviceDB(false).then(function(newData)
                            {
                                console.log(newData);
                                deferred.resolve(newData);
                            });
                        }
                        else{
                            deferred.resolve(data);
                        }
                    }
                )
            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    function getCatgeoryFromApi(page)
    {
        var deferred = $q.defer();
        var getdata=true;
        dataService.getNewsletterCategory(page).then(function(data)
        {
            console.log(data);
            if(angular.isUndefined(data.categories) ||data==null || !data.isSuccessful)
            {
                console.log("No data is available gh");
                getdata=false;
                deferred.resolve(getdata);
            }
            else {

                if(page===1) {
                    $cordovaSQLite.execute(db, "delete from category")

                }
                insertNewsLetterCategory(data.categories).then(function(insertdata)
                        {
                            if (data.currentPage < data.totalPages) {
                                // alert('s');
                                getCatgeoryFromApi(data.currentPage + 1);
                            }
                            else{

                                getdata=true;
                                deferred.resolve(getdata);

                            }
                        })

                    }
        })
        return deferred.promise;
    }

    function getCategoryFromDeviceDB(id)
    {
        var deferred = $q.defer();
        var data=null;
        var query = "SELECT id ,name,orderNumber,iconName,syncdate FROM category where id=(?)";
        var now  =Math.floor(Date.now() / 1000)
        $cordovaSQLite.execute(db, query,[id]).then(function (res) {
            if (res.rows.length > 0) {
                data=res.rows.item(0)
                deferred.resolve(data);
            }
        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    //NEWSLETTER
    function getNewsletterFromDeviceDB(id,forceRefresh) {

        var deferred = $q.defer();
        var data = null;
        var query = "SELECT id,clientId,categoryId ,pointId,signupAddress,domainName,imagePath,orderNumber,syncdate FROM newsletter WHERE categoryId = (?) ORDER BY orderNumber";
        $cordovaSQLite.execute(db, query,[id]).then(function (res) {
            if (res.rows.length > 0) {
                //check the last synced date
                var now = Math.floor(Date.now() / 1000)
                var newsletterSignup=[];
                if(!forceRefresh)
                {
                    for (var j=0; j<res.rows.length; j++) {
                        var row = res.rows.item(j);
                        newsletterSignup.push(row);
                    }
                    data = {newsletterSignup: newsletterSignup};
                    deferred.resolve(data);
                }
                else {
                    if (now - res.rows.item(0).syncdate < 50000) {
                        console.log('hours do  match');
                        for (var j = 0; j < res.rows.length; j++) {
                            var row = res.rows.item(j);
                            newsletterSignup.push(row);
                        }
                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);

                    }
                    else {
                        console.log('hours do not match');
                        getNewsletterFromApi(id).then(function (data) {
                            if (data) {
                                getNewsletterFromDeviceDB(id,false).then(function(newdata)
                                {
                                    deferred.resolve(newdata);
                                });
                            }

                        });
                    }
                }
            }
            else {
                console.log("No records in Db")
                getNewsletterFromApi(id).then(function (data) {
                        if (data) {
                            getNewsletterFromDeviceDB(id,false).then(function(newdata)
                            {

                                deferred.resolve(newdata);
                            });
                        }
                        else{
                            deferred.resolve(data);
                        }
                    }
                )
            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;

    }

    function getNewslettersFromDeviceDB(id,limit,ids) {
        var deferred = $q.defer();
        var data = null;
        var newsletterSignup=[];
        populatenewsletters(id,limit,ids,false).then(function (result)
        {
            if(result!=null) {
                newsletterSignup = result;
            }
           // console.log(newsletterSignup);
            if(ids!=null && ids.length>0 && ids.length<11)
            {
                populatenewsletters(id,limit,ids,true).then(function (result2) {
                    if(result2!=null) {
                        angular.forEach(result2,function(item)
                        {
                            newsletterSignup.push(item);
                        })

                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);
                    }
                    else {
                        data = {newsletterSignup: newsletterSignup};
                        deferred.resolve(data);
                    }
                });
            }
            else{
                data = {newsletterSignup: newsletterSignup};
                deferred.resolve(data);
            }

        },function(err)
        {
            deferred.resolve(data);
        });

        return deferred.promise;

    }
    function populatenewsletters(id,limit,ids,notIn)
    {

        var deferred = $q.defer();
        var data = null;
        var query = "SELECT id,clientId,categoryId ,pointId,signupAddress,domainName,imagePath,orderNumber,syncdate FROM newsletter " ;
        if(id>0) {
            query=query+  " WHERE categoryId =" +id;
        }
        if(ids!=null && ids.length>0)
        {
            if(id>0) {
                query=query+' And ';
            }
            else
            {
                query=query+' where ';
            }
            if(notIn)
            {
                query = query + ' id not  in (' + ids + ')';
            }
            else {
                query = query + ' id in (' + ids + ')';
            }
        }
        if(id>0) {
            query = query + " ORDER BY orderNumber ";
        }
        else{
            query = query + " ORDER BY imagePath ";
        }
        if(limit>0)
        {
            query=query+' Limit '+limit
        }
       // console.log(query)
        $cordovaSQLite.execute(db, query).then(function (res) {
            if (res.rows.length > 0) {
                var newsletterSignup=[];
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    newsletterSignup.push(row);
                }
                data =  newsletterSignup;
               // console.log(data);
                deferred.resolve(data);
            }
            else {
                console.log("No records in Db")
                deferred.resolve(data);

            }

        }, function (err) {
            console.log(err)
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    function insertNewsletter(data)
    {
        var  deferred = $q.defer();
        var promises = [];
        angular.forEach(data,function(dataObject)
        {
            var now = new Date();
            var syncdate =Math.floor(Date.now() / 1000);
            var query = "INSERT INTO newsletter (id ,clientId ,categoryId ,pointId ,signupAddress ,domainName ,imagePath,orderNumber ,syncdate) VALUES (?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute(db, query, [dataObject.id,dataObject.clientId,dataObject.categoryId,dataObject.pointId,dataObject.signupAddress,dataObject.domainName,dataObject.imagePath,dataObject.orderNumber,syncdate])
            promises.push(true);
        })
        $q.all(promises)
        deferred.resolve(true);
        return  deferred.promise;
    }
    function getNewsletterFromApi(id){

        var deferred = $q.defer();
        var getdata=true;
        dataService.getNewsletters(id,1000).then(function(data) {
                if(!angular.isUndefined(data.newsletterSignup) && data.newsletterSignup.length >0)
                {
                    var query="delete  from newsletter where categoryId=(?)";
                    $cordovaSQLite.execute(db,query,[id] );
                    insertNewsletter(data.newsletterSignup).then(function(data)
                    {

                        getdata=true;
                        deferred.resolve(getdata);
                    })
                }
                else
                {
                    deferred.resolve(getdata);
                }
            }
        )
        return deferred.promise;

    }

    //MEMBER NEWSLETTER
    function insertMemberNewsletterToDeviceDB(dataObject,updateAll)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        if(updateAll)
        {

            var delQuery = "DELETE FROM memberNewsletters WHERE memberId = (?)";
            $cordovaSQLite.execute(db, delQuery, [id]).then(function()
            {
                console.log('deleted');
            })

        }
        if(!angular.isUndefined(dataObject)) {

            var promises = [];
            var syncdate = Math.floor(Date.now() / 1000);
            angular.forEach(dataObject, function (data) {


                        var query = "INSERT INTO memberNewsletters (memberId ,categoryId ,newsletters ,syncdate) VALUES (?,?,?,?)";
                        $cordovaSQLite.execute(db, query, [id, data.cId,data.nlIds, syncdate]).then(function()
                        {

                        },function(err)
                            {
                                console.log(err);
                            }
                        )

                        promises.push(true);
                    });

            $q.all(promises)
            deferred.resolve(true);
        }
        else{
            deferred.resolve(true);
        }
        return  deferred.promise;

    }
    function updateMemberNewsletterToDeviceDB(dataObject,cId)
    {

        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        if(!angular.isUndefined(dataObject)) {
            var delQuery = "DELETE FROM memberNewsletters WHERE memberId =(?) AND categoryId = (?)";
            $cordovaSQLite.execute(db, delQuery, [id,cId])

            var promises = [];
            var syncdate = Math.floor(Date.now() / 1000);
if(dataObject.length>0) {
    var query = "INSERT INTO memberNewsletters (memberId ,categoryId ,newsletters ,syncdate) VALUES (?,?,?,?)";
    $cordovaSQLite.execute(db, query, [id, cId, dataObject, syncdate])
}
                promises.push(true);

            $q.all(promises)
            deferred.resolve(true);
        }
        else{
            deferred.reject();
        }
        return  deferred.promise;
    }
    function getMemberNewslettersFromDeviceDB(cId) {

        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var signUpIds=[];
        var query = "SELECT newsletters FROM memberNewsletters WHERE memberId = (?)";
        if (cId > 0) {
            query = "SELECT newsletters FROM memberNewsletters WHERE memberId =(?) AND categoryId = (?)";

            $cordovaSQLite.execute(db, query, [id,cId]).then(function(res)
            {
                if(res.rows.length>0) {
                    var row = res.rows.item(0);
                    var ids_str = row.newsletters;
                    var newsletters = ids_str.split(',').map(function (ids_str) {
                        return Number(ids_str);
                    });
                    for (var j = 0; j < newsletters.length; j++) {
                        signUpIds.push(newsletters[j]);
                    }
                    deferred.resolve(signUpIds);
                }
                else
                {
                    deferred.resolve(signUpIds);
                }
            },function(err)
            {
               // console.log(err)
                deferred.resolve(signUpIds);
            });
        }
        else {
            $cordovaSQLite.execute(db, query, [id]).then(function(res) {
                if(res.rows.length>0) {
                    for (var j = 0; j < res.rows.length; j++) {
                        var ids_str = res.rows.item(j).newsletters;
                        var newsletters = ids_str.split(',').map(function (ids_str) {
                            return Number(ids_str);
                        });
                        for (var k = 0; k < newsletters.length; k++) {
                            signUpIds.push(newsletters[k]);
                        }
                    }
                    deferred.resolve(signUpIds);
                }
                else
                    {
                        deferred.resolve(signUpIds);
                    }
            },function(err)
            {
                console.log(err)
                deferred.resolve(signUpIds);
            });

        }
        return  deferred.promise;
    }

    function getMemberNewsletterCategoryIdsFromDeviceDB()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var Ids=[];
        var query = "SELECT categoryId,newsletters FROM memberNewsletters WHERE memberId = (?)";
        $cordovaSQLite.execute(db, query, [id]).then(function(res) {
            for (var j = 0; j < res.rows.length; j++) {
                var row = res.rows.item(j);
                var ids_str=row.newsletters;
                var nlIds=ids_str.split(',').map(function(ids_str){return Number(ids_str);});
               // console.log(nlIds);
                Ids.push({cId:row.categoryId,nlIds:nlIds});
                //console.log(Ids)
            }
            deferred.resolve(Ids);
        },function(err)
        {
            console.log(err)
            deferred.resolve(Ids);
        });
        return  deferred.promise;
    }
    function veirfySubscribed(nlId,categoryId)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var data={result:false};
        var Ids=[];
        var query = "SELECT categoryId,newsletters FROM memberNewsletters WHERE memberId = (?) AND  categoryId = (?)";
        $cordovaSQLite.execute(db, query, [id,categoryId]).then(function (res) {
            if (res.rows.length > 0) {
                var newsletters=res.rows.item(0).newsletters;
                var nlIds=newsletters.split(',').map(function(ids_str){return Number(ids_str);});
                if(nlIds.indexOf(nlId)>-1) {
                    data={result:true};
                    deferred.resolve(data);
                }
                else
                {
                    deferred.resolve(data);
                }
            }
            else {
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        });
        return  deferred.promise;
    }
    //INBOX ITems
    function syncMemberEmailsToDeviceDB()
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;
            var lastSentId = 0;
            var query = "SELECT emailid  FROM newsletterEmail WHERE memberId = (?)" +
                "ORDER BY emailid DESC " +
                "LIMIT 1";
            $cordovaSQLite.execute(db, query, [id]).then(function (res) {

                if (res.rows.length > 0) {
                    lastSentId = res.rows.item(0).emailid;
                }
                    insertMemberEmailsToDeviceDB(lastSentId).then(function (data) {
                        if(data) {
                            deferred.resolve(lastSentId);
                        }
                        else {
                            deferred.resolve(0);
                        }
                    })

            }, function (err) {
                console.log(err);
                    deferred.resolve(lastSentId);
            } );
        }
        else
        {
            deferred.resolve(lastSentId);

        }
        return  deferred.promise;
    }

    function  insertMemberEmailsToDeviceDB(lastId)
    {

        var deferred = $q.defer();
        var promises = [];
        dataService.getMemberNewsletterEmails(lastId).then(function(data)
        {
            if (data.msg.isSuccessful && data.memberNewsletterEmailList.length>0) {

                angular.forEach(data.memberNewsletterEmailList, function (item)
                {
                    var query="INSERT INTO newsletterEmail(emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                        " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                        ",pointforFeedback ,pointforShare,opened ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute(db, query, [item.emailid ,item.memberId,item.categoryId,item.newsletterSignupId ,item.subject ,item.fromEmail  ,item.createdDate ,item.emailSendingDate ,item.emailBody ,item.imagePath
                        ,item.statusName ,item.pointforSave ,item.pointforNotInterest ,item.pointforFeedback ,item.pointforShare ,0])
                        .then(function(res) {
                            promises.push(true);

                        }, function (err) {
                            console.log(err);
                            promises.push(true);
                        });

                });
                $q.all(promises)
                deferred.resolve(true);
            }
            else {
                deferred.resolve(false);
            }
        });
        return  deferred.promise;
    }

    function getEmailsFromDeviceDB(status,pageNumber,lastId) {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var totalCount = 0;

        var memberNewsletterEmailList = [];
        var offset = (pageNumber - 1) * 10
        offset = isNaN(offset) ? 0 : offset;

        if (!angular.isUndefined(oAuth) && oAuth.member_id > 0) {
            var id = oAuth.member_id;
            //var cacheKey = status + 'items' + id;
            var lastSentId = 0;
            var unreadCountQuery = "select statusName,count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0 group by statusName"
            $cordovaSQLite.execute(db, unreadCountQuery, [id]).then(function (res) {
                if (res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        if (res.rows.item(i).statusName === 'Inbox') {
                            $rootScope.$broadcast('UnreadCount', res.rows.item(i).total);
                        }
                        if (res.rows.item(i).statusName === 'Save') {
                            $rootScope.$broadcast('UnreadCountSaved', res.rows.item(i).total);
                        }
                    }
                }

            }, function (err) {
                console.log(err);

            });


            var query = "SELECT emailid ,emailBody,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare ,opened FROM newsletterEmail WHERE memberId = (?) AND statusName = (?) ";
            if (lastId > 0) {
                query = query + 'And emailId < ' + lastId;
            }
            query = query + "  ORDER BY emailid DESC " +
            " LIMIT 10"
            +
            " OFFSET " + offset;

            $cordovaSQLite.execute(db, query, [id, status]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data = memberNewsletterEmailList;
                    // console.log(data);
                    //if (pageNumber == 1) {
                    //    inboxCache.put(cacheKey, data);
                    //    console.log(inboxCache)
                    //}
                    deferred.resolve(data);
                }
                else {
                    deferred.resolve(data);
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(data);
            });


        }

            else {
                deferred.resolve(data);
            }

        return  deferred.promise;
    }
    function getNewEmailsFromDeviceDB(status,lastId)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();

        var memberNewsletterEmailList=[];


        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;

            broadcastUnReadCount();
            var query = "SELECT emailid,emailBody ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND statusName = (?) " ;
            if(lastId>0)
            {
                query =query + 'And emailId > '+lastId   ;
            }
            query =query +  "  ORDER BY emailid  "


            $cordovaSQLite.execute(db, query, [id, status]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data =  memberNewsletterEmailList;
                    // console.log(data);
                    deferred.resolve(data);
                }
                else{
                    deferred.resolve(data);
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(data);
            });
        }
        else{
            deferred.resolve(data);
        }
        return  deferred.promise;
    }
    function updateEmailToDeviceDB(id,statusId)
    {
        var oAuth = authService.getoAuth();

        var status='Inbox'
        if(statusId===2)
        {
            status='Save';
        }
        if(statusId===3)
        {
            status='Delete';
        }
        var deferred = $q.defer();
        var data=false;
        if(oAuth!=null) {
            var memberid = oAuth.member_id;
            var query = "UPDATE newsletterEmail SET statusName=(?)  WHERE emailid = (?)";
            $cordovaSQLite.execute(db, query, [status, id])
                .then(function (res) {
                    data = true;
                    broadcastUnReadCount();


                    deferred.resolve(data);
                }, function (err) {
                    deferred.resolve(data);
                });

            //get unread count




        }
        return deferred.promise;
    }
    function broadcastUnReadCount()
    {
        var oAuth = authService.getoAuth();
        if(oAuth!=null) {
            var memberid = oAuth.member_id;
            //Inbox
            var unreadInboxCountQuery = "select count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0  And statusName='Inbox'"
            $cordovaSQLite.execute(db, unreadInboxCountQuery, [memberid]).then(function (resCnt) {

                if (resCnt.rows.length > 0) {
                    $rootScope.$broadcast('UnreadCount', resCnt.rows.item(0).total);
                } else {
                    $rootScope.$broadcast('UnreadCount', 0);
                }
            }, function (err) {
                console.log(err);

            });
            //saved
            var unreadSavedCountQuery = "select count(*)  total from newsletterEmail WHERE memberId = (?)  AND opened=0  And statusName='Save'"
            $cordovaSQLite.execute(db, unreadSavedCountQuery, [memberid]).then(function (resSavedCnt) {
                if (resSavedCnt.rows.length > 0) {
                    $rootScope.$broadcast('UnreadCountSaved', resSavedCnt.rows.item(0).total);
                } else {
                    $rootScope.$broadcast('UnreadCountSaved', 0);
                }
            }, function (err) {
                console.log(err);

            });
        }
        else{
            $rootScope.$broadcast('UnreadCount', 0);
            $rootScope.$broadcast('UnreadCountSaved', 0);
        }


    }
    function insertTrendingEmailToDeviceDB()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        dataService.getTrendingNewsletters().then(function(data){
            if(!angular.isUndefined(data) && data.msg.isSuccessful && data.memberNewsletterEmailList.length>0) {
                var query2 ="DELETE from trendingEmail where memberId=(?)"
                $cordovaSQLite.execute(db, query2,[id]);
                angular.forEach(data.memberNewsletterEmailList, function (item) {
                    var query = "INSERT INTO trendingEmail(emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                                 " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                                 ",pointforFeedback ,pointforShare,opened ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    $cordovaSQLite.execute(db, query, [item.emailid, item.memberId, item.categoryId, item.newsletterSignupId, item.subject, item.fromEmail, item.createdDate, item.emailSendingDate, item.emailBody, item.imagePath
                                             , item.statusName, item.pointforSave, item.pointforNotInterest, item.pointforFeedback, item.pointforShare,0])
                        .then(function (res) {



                        }, function (err) {
                            console.log(err);

                        });

                });
                deferred.resolve(true);
            }
            else{
                deferred.resolve(true);
            }

        });
        return  deferred.promise;
    }
    function getTrendingEmailFromDeviceDB(forceRefresh)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var memberNewsletterEmailList=[];
        if(!angular.isUndefined(oAuth) && oAuth.member_id>0) {
            var id = oAuth.member_id;
            var lastSentId = 0;
            var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                ",pointforFeedback ,pointforShare,opened FROM trendingEmail WHERE memberId = (?) " +
                "ORDER BY emailid DESC ";

            $cordovaSQLite.execute(db, query, [id]).then(function (res) {
                if (res.rows.length > 0) {
                    //memberNewsletterEmailList
                    for (var j = 0; j < res.rows.length; j++) {
                        var row = res.rows.item(j);
                        memberNewsletterEmailList.push(row);
                    }
                    data =  memberNewsletterEmailList;
                    deferred.resolve(data);
                }
                else{
                    if(forceRefresh) {
                        insertTrendingEmailToDeviceDB().then(function (indata) {
                            if (indata) {
                                getTrendingEmailFromDeviceDB(false).then(function(newdata)
                                {
                                    deferred.resolve(newdata);
                                });
                            }
                            else{
                                deferred.resolve(data);
                            }
                        })
                    }
                    else{
                        deferred.resolve(data);
                    }
                }


            }, function (err) {
                console.log(err);
                deferred.resolve(false);
            });
        }
        return  deferred.promise;
    }

    function getEmailDetailfromDeviceDB(emailId,status)
    {

        var deferred = $q.defer();
        var data = null;
        var prevEmail=0;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var lastSentId = 0;
        //var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        //    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        //    ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND emailid=(?) AND statusName = (?) " +
        //    "ORDER BY emailid DESC ";
        var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?) AND emailid=(?) AND statusName = (?) " +
            "ORDER BY emailid DESC ";

        var query2 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare FROM newsletterEmail WHERE memberId = (?)  AND emailid < (?)  AND statusName = (?)" +
            "ORDER BY emailid DESC " +
            "LIMIT 1";
        //var query3 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        //    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        //    ",pointforFeedback ,pointforShare  FROM newsletterEmail WHERE memberId = (?)  AND emailid > (?) AND statusName = (?) " +
        //    "ORDER BY emailid  " +
        //    "LIMIT 1";
        var parmas=[id,emailId,status]
        if(status==='Trending')
        {
            query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                    ",pointforFeedback ,pointforShare FROM trendingEmail WHERE memberId = (?)  AND emailid=(?) "
                    "ORDER BY emailid DESC ";
            query2 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
                    " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
                    ",pointforFeedback ,pointforShare  FROM trendingEmail WHERE memberId = (?)  AND emailid < (?) " +
                    "ORDER BY emailid DESC " +
                    "LIMIT 1";
            //query3 = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            //        " ,createdDate ,emailSendingDate ,emailBody ,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            //        ",pointforFeedback ,pointforShare  FROM trendingEmail WHERE memberId = (?)  AND emailid > (?) " +
            //        "ORDER BY emailid  " +
            //        "LIMIT 1";
            parmas=[id,emailId]
        }
        $cordovaSQLite.execute(db, query,parmas).then(function (res) {

            if (res.rows.length > 0) {
                $cordovaSQLite.execute(db, query2, parmas).then(function (res2) {
                    prevEmail=res2.rows.length>0?res2.rows.item(0):null;
                       data = {email:res.rows.item(0),prevEmail:prevEmail};
                       deferred.resolve(data);
                    //$cordovaSQLite.execute(db, query3,parmas).then(function (res3) {
                    //
                    //
                    //    nextEmail=res3.rows.length>0?res3.rows.item(0):null;
                    //    data = {email:res.rows.item(0),nextEmail:nextEmail,prevEmail:prevEmail};
                    //    deferred.resolve(data);
                    //},function(err)
                    //{
                    //    console.log(err)
                    //    deferred.resolve(data);
                    //});


                },function(err)
                {
                    console.log(err)
                    deferred.resolve(data);
                });

            }
            else{
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        })
        return  deferred.promise;
    }
    function getEmailBodyfromDeviceDB(emailId)
    {

        var deferred = $q.defer();
        var data = null;

        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var lastSentId = 0;
        var query = "SELECT emailBody  FROM newsletterEmail WHERE memberId = (?) AND emailid=(?)  " +
            "ORDER BY emailid DESC ";


        var parmas=[id,emailId]
        if(status==='Trending')
        {
            query = "SELECT emailBody  FROM trendingEmail WHERE memberId = (?)  AND emailid=(?) "
            "ORDER BY emailid DESC ";


        }
        $cordovaSQLite.execute(db, query,parmas).then(function (res) {

            if (res.rows.length > 0) {
               data={emailBody:res.rows.item(0).emailBody}
                deferred.resolve(data);

            }
            else{
                deferred.resolve(data);
            }
        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        })
        return  deferred.promise;
    }
    function saveNewsletterAsUnsubFromDeviceDb(nlId,categoryId)
    {
        var deferred = $q.defer();
        var data = false;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var query='SELECT * FROM memberNewsletters WHERE memberId = (?)  AND  categoryId = (?)'
        $cordovaSQLite.execute(db, query, [id,categoryId]).then(function (res) {
            if (res.rows.length > 0) {
                var newsletters=res.rows.item(0).newsletters;
                if(newsletters.indexOf(nlId)>-1)
                { var nlIds=newsletters.split(',').map(function(ids_str){return Number(ids_str);});
                    var index=nlIds.indexOf(nlId)
                    nlIds.splice(index,1);
                    var updatequery="UPDATE memberNewsletters  set newsletters =(?) WHERE memberId = (?)  AND  categoryId = (?)";
                    $cordovaSQLite.execute(db, updatequery, [nlIds,id,categoryId]).then(function (res2) {

                        data = true;
                        deferred.resolve(data);
                    },function(errs)
                    {
                        console.log(errs);
                    })
                }
                else {
                    data = true;
                    deferred.resolve(data);
                }
            }
            else
            {
                data = true;
                deferred.resolve(data);
            }

        },function(err)
        {
            console.log(err)
            deferred.resolve(data);
        });
        return  deferred.promise;
    }

    function getEmailCount()
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var total=0;
        var query="SELECT count(*) Total  FROM newsletterEmail WHERE memberId = (?)";
        $cordovaSQLite.execute(db, query, [oAuth.member_id]).then(function (res) {

            if (res.rows.length > 0) {
               total=res.rows.item(0).Total;
                deferred.resolve(total);
            }
          else{
                deferred.resolve(total);
            }

        }, function (err) {
            console.log(err);
            deferred.resolve(total);
        } );
        return  deferred.promise;
    }

    function markAsRead(id ,status)
    {
        var deferred = $q.defer();
        var oAuth = authService.getoAuth();
        var query="Update newsletterEmail set opened =1  WHERE memberId = (?) AND emailid=(?) AND statusName = '"+status+"' And opened=0 ";
        if(status==='Trending') {
            query="Update trendingEmail set opened =1  WHERE memberId = (?) AND emailid=(?)  And opened=0 ";
        }
        $cordovaSQLite.execute(db, query, [oAuth.member_id,id]).then(function (res) {

                deferred.resolve(true);

        }, function (err) {
            console.log(err);
            deferred.resolve(true);
        } );

        broadcastUnReadCount();
        return  deferred.promise;
    }
    //search

    function search(searchPhase,status)
    {
        //console.log(searchPhase)
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var memberNewsletterEmailList=[];
        var ids=[];
        var query = "SELECT * from(SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare ,opened , 2 rank FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And ( Lower(subject) LIKE '%" +searchPhase.toLowerCase()  +"%'   )"


         query =  query +" UNION SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
         " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
         ",pointforFeedback ,pointforShare ,opened , 1 rank  FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And (  Lower(fromEmail) LIKE '%" +searchPhase.toLowerCase() +"%'   )"
        query =  query +" UNION SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
        " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
        ",pointforFeedback ,pointforShare ,opened , 3 rank  FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
            " And (  Lower(emailBody) LIKE '%" +searchPhase.toLowerCase() +"%' ) )"+
            " ORDER BY rank ";

       // console.log(query)
        //var query = "SELECT * FROM newsletterEmail WHERE memberId = "+id +"  AND statusName = '"+status +"'" +
        //    " And ( Lower(subject) LIKE '%" +searchPhase.toLowerCase() +"%'   OR Lower(fromEmail) LIKE '%" +searchPhase.toLowerCase() +"%'  OR Lower(emailBody) LIKE '%" +searchPhase.toLowerCase() +"%' )" +
        //    " ORDER BY emailid DESC ";
        $cordovaSQLite.execute(db,query).then(function (res) {
       // console.log(res)
            if (res.rows.length > 0) {
                //memberNewsletterEmailList
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    if (ids.indexOf(row.emailid) < 0) {
                        memberNewsletterEmailList.push(row);
                        ids.push(row.emailid)
                    }

                }
            }
                data =  memberNewsletterEmailList;
              // console.log(data);
                deferred.resolve(data);

        },function(err)
        {
            console.log(err);
            data =  memberNewsletterEmailList;
            deferred.resolve(data);
        });
        return  deferred.promise;
    }

    function getEmailsByCategory(status,cId)
    {
        var deferred = $q.defer();
        var data = null;
        var oAuth = authService.getoAuth();
        var id = oAuth.member_id;
        var memberNewsletterEmailList=[];
        var query = "SELECT emailid ,memberId ,categoryId ,newsletterSignupId ,subject ,fromEmail " +
            " ,createdDate ,emailSendingDate,imagePath ,statusName ,pointforSave ,pointforNotInterest " +
            ",pointforFeedback ,pointforShare ,opened FROM newsletterEmail WHERE memberId = (?) AND statusName = (?)  AND categoryId=(?)" ;
        $cordovaSQLite.execute(db, query, [id, status,cId]).then(function (res) {
            if (res.rows.length > 0) {
                //memberNewsletterEmailList
                for (var j = 0; j < res.rows.length; j++) {
                    var row = res.rows.item(j);
                    memberNewsletterEmailList.push(row);
                }
                data =  memberNewsletterEmailList;
                // console.log(data);
                deferred.resolve(data);
            }
            else{
                deferred.resolve(data);
            }


        }, function (err) {
            console.log(err);
            deferred.resolve(data);
        });
        return  deferred.promise;
    }
    //Api log

    function InsertIntoApiFailedLog(dataObject) {
        if (!angular.isUndefined(dataObject)) {
            var oAuth = authService.getoAuth();
            var member_id=oAuth.member_id
            var query = "INSERT INTO ApiFailedLog (memberId ,apiCallType ,dataObject ,created) VALUES (?,?,?,?)";
            $cordovaSQLite.execute(db, query, [member_id ,dataObject.apiCallType ,dataObject.dataObject, new Date()])
                .then(function(res)
            {
                console.log("INSERT ID -> " + res.insertId)
            },function(err)
                {
                    console.log(err);
                });
        }
    }

    function ProcessApiFailedLog()
    {
        var oAuth = authService.getoAuth();
        var member_id=oAuth.member_id
        var deleteQuery="DELETE FROM ApiFailedLog WHERE id=(?)"
        //profile Update
        var profileQuery = "SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"+
            "ORDER BY created DESC "+
            "LIMIT 1";

        $cordovaSQLite.execute(db, profileQuery, [member_id, 'profile']).then(function (res) {
            if (res.rows.length > 0) {
                    authService.SaveMember(JSON.parse(res.rows.item(0).dataObject)).then(function(profileResult)
                    {
                        if(profileResult.isSuccessful)
                        {
                            var table_id=res.rows.item(0).id
                            $cordovaSQLite.execute(db, deleteQuery,[table_id]).then(function()
                            {

                            },function(err)
                            {
                                console.log(err);
                            })
                        }
                    })
            }
        },function(err)
        {
            console.log(err);
        })

        //subscription

        var subQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"+
            "ORDER BY created ";
        $cordovaSQLite.execute(db, subQuery, [member_id, 'sub']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var row=res.rows.item(j);
                    var subData = JSON.parse(row.dataObject)

                    dataService.saveMemberSignupList(subData.signupIds, subData.cId).then();

                    if(j==(res.rows.length-1))
                    {
                        var delsubQuery="Delete FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                        $cordovaSQLite.execute(db, delsubQuery, [member_id, 'sub']).then(function(datadel)
                        {

                        },function(err) {
                            console.log(err);
                        });

                    }

                }//for loop ends
            }
        },function(err)
        {
            console.log(err);
        })

        //email ststus change
        var emailStatusQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)";
        var EmailStatusList=[];

        $cordovaSQLite.execute(db, emailStatusQuery, [member_id, 'emailStatusChange']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var emailStatusData = JSON.parse(res.rows.item(j).dataObject)
                    EmailStatusList.push({Emailid:emailStatusData.Emailid, StatusId:emailStatusData.StatusId});

                }

                if(EmailStatusList.length>0) {
                    var emailStatusDataObject={MemberId:member_id,EmailStatusList:EmailStatusList};

                    dataService.batchUpdateMemberEmailStatus(emailStatusDataObject).then(function (emailStatusDataResult) {
                        if (emailStatusDataResult.isSuccessful) {
                            var emailStatusDeletequery="DELETE FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                            $cordovaSQLite.execute(db, emailStatusDeletequery, [member_id, 'emailStatusChange']).then(function (data) {
                            }, function (err) {
                                console.log(err);
                            })
                        }
                    })
                }
            }
        },function(err)
        {
            console.log(err);
        })

        //Not Interested


        var notInterestedQuery="SELECT id,memberId ,apiCallType ,dataObject ,created FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)";


        $cordovaSQLite.execute(db, emailStatusQuery, [member_id, 'notInterested']).then(function (res) {
            if (res.rows.length > 0) {
                for (var j = 0; j < res.rows.length; j++) {
                    var row=res.rows.item(j);
                    dataService.saveNewsletterAsUnsub(row.dataObject).then(function(apiData)
                    {

                    });
                    if(j==(res.rows.length-1))
                    {
                        var delNIQuery="Delete FROM ApiFailedLog WHERE memberId = (?) AND apiCallType = (?)"
                        $cordovaSQLite.execute(db,delNIQuery, [member_id, 'notInterested']).then(function(datadel)
                        {

                        },function(err) {
                            console.log(err);
                        });

                    }
                }

                }
        },function(err)
        {
            console.log(err);
        })
    }

    function RunOnLineTask() {
        if (authService.isNetworkAvailable()) {

            var oAuth = authService.getoAuth();
            if (oAuth != null && !angular.isUndefined(oAuth)) {
                var member_id = oAuth.member_id;
                var total = 0;
                var query = 'SELECT count(*) as total  FROM ApiFailedLog WHERE memberId = (?)';
                $cordovaSQLite.execute(db, query, [member_id]).then(function (res) {

                    if (res.rows.length > 0) {
                        total = res.rows.item(0).total;

                        if (!angular.isUndefined(localStorage.oAuth) && localStorage.oAuth.length > 0) {
                            var oauth = JSON.parse(localStorage.oAuth);

                            if (oauth.access_token == oauth.member_id) {
                                authService.login(oauth.email, oauth.password).then(function () {
                                    if (total > 0) {
                                        ProcessApiFailedLog();
                                    }
                                });
                            }
                            else {
                                if (total > 0) {

                                   ProcessApiFailedLog();
                                }
                            }
                        }
                    }
                });
            }//oauth check
        }//
    }// networl check
};
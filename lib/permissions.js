"use strict";
 const
      request = require('request'),
      jwt=require('jsonwebtoken'),
      fs = require('fs');

function setallTenantPermissions(bl,cb){
  //var token;
  var tenantId;
	// fs.readFile('./bannerAccessToken.txt', 'utf8', function (err, bannerAccessToken) {
 //       if (err) {
 //          return console.log(err);
 //      }
 //      console.log("\nBanner Access Token from file: " + bannerAccessToken);
 //      token = bannerAccessToken;
      fs.readFile('./sessionStorage.txt', 'utf8', function (err, userToken) {
          if (err) {
               console.log(err);
               cb(err); 
          }
          console.log("\nUser Token from file: " + userToken);
          var decodedjwt=jwt.verify(userToken,'test scales right up');
          if (decodedjwt)
            tenantId=decodedjwt.tenant.id;
            console.log("tenantId="+tenantId);
            console.log("token="+userToken);
            if (userToken && tenantId){
              let opts = {
                        'method': 'POST',
                          'url': 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/privileges/'+tenantId,
                          'headers': {
                                'Authorization': 'Bearer '+userToken,
                                'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                           },
                          'body':'{"allTenant": '+bl+'}'
                      };
              request(opts, function(error, response, body){
                             if (error){
                                  console.log("privileges api returned an error"+ error);
                                  cb(error);
                              }
                              else{
                               console.log(body);
                               cb(null);
                             }
              });
            }
            else
            {
                console.log("cannot get userToken/tenantid");
                cb(new Error('cannot get userToken/tenantid'));
            }
     
      });
  // });
 }
exports = module.exports = {setallTenantPermissions: setallTenantPermissions}
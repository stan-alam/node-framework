"use strict";
 const
      request = require('request'),
      jwt=require('jsonwebtoken'),
      fs = require('fs');
var id;
var tenant;
function addCredentials(cb){
   fs.readFile('./sessionStorage.txt', 'utf8', function (err, userToken) {
          if (err) {
               console.log(err);
               cb(err);
          }
          var decodedjwt=jwt.verify(userToken,'test scales right up');
                if (decodedjwt)
                  tenant=decodedjwt.tenant.alias;
          console.log("\nUser Token from file: " + userToken);
          if (userToken){
              fs.readFile('./bannerAppID.txt', 'utf8', function(err, data) {
                      if (err) {
                         console.log(err);
                         cb(err);
                         return;
                      }

                      var postBody = {"id": "670eb5ed-7c00-4cba-bcfa-0d16a1b1d73a","title": "Banner configuration","credentials": [{"application": {"id": data },"password": "passwordforbanner","username": "usernameforbanner"}]};
                      let opts = {
                              'method': 'POST',
                                'url': 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/'+tenant+'/api/privileged-app-credentials',
                                'headers': {
                                      'Authorization': 'Bearer '+userToken,
                                      'Content-Type': 'application/vnd.hedtech.privileged-app-credentials.v2+json'
                                 },

                                'json': postBody
                            };

                      request(opts, function(error, response, body){
                                   if (error){
                                        console.log("privileged-app-credentials api returned an error"+ error);
                                 //       console.log('body is ' + JSON.stringify(body));
                                        cb(error);
                                    }
                                    else{
                                     console.log(body);
                                     id=body.id;
                                     cb(null,body);
                                   }
                     });
             });
         }
            else
            {
                console.log("cannot get userToken/tenantid");
                cb(new Error('cannot get userToken/tenantid'));
            }

    });

 }
 function putCredentialswithoutPassword(cb){
  fs.readFile('./sessionStorage.txt', 'utf8', function (err, userToken) {
          if (err) {
               console.log(err);
               cb(err);
          }
          var decodedjwt=jwt.verify(userToken,'test scales right up');
                if (decodedjwt)
                  tenant=decodedjwt.tenant.alias;

          console.log("\nUser Token from file: " + userToken);
          if (userToken){
              fs.readFile('./bannerAppID.txt', 'utf8', function(err, data) {
                      if (err) {
                         console.log(err);
                         cb(err);
                         return;
                      }

                      var postBody = {"id": id,"title": "Banner configuration","credentials": [{"application": {"id": data },"username": "usernameforbanner"}]};
                      let opts = {
                              'method': 'PUT',
                                'url': 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/'+tenant+'/api/privileged-app-credentials/'+id,
                                'headers': {
                                      'Authorization': 'Bearer '+userToken,
                                      'Content-Type': 'application/vnd.hedtech.privileged-app-credentials.v2+json'
                                 },

                                'json': postBody
                            };

                      request(opts, function(error, response, body){
                                   if (error){
                                        console.log("privileged-app-credentials api returned an error"+ error);
                                 //       console.log('body is ' + JSON.stringify(body));
                                        cb(error);
                                    }
                                    else{
                                     console.log(body);
                                     cb();
                                   }
                     });
             });
         }
            else
            {
                console.log("cannot get userToken/tenantid");
                cb(new Error('cannot get userToken/tenantid'));
            }

    });

 }
exports = module.exports = {addCredentials: addCredentials,
                            putCredentialswithoutPassword : putCredentialswithoutPassword}
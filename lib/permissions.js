"use strict";
 const
      request = require('request'),
      fs = require('fs'),
      jwt=require('jsonwebtoken');

function setDataAccessPermissions(bl){
	var token=getToken();
  var tenantID=getTenantID();
  if (token && tenantID){
  	let opts = {
  	                'method': 'POST',
                      'url': 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/privileges/'+tenantId,
                      'headers': {
                            'Authorization': 'Bearer '+token,
                            'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                       },
                      'body':{"dataAccess": bl }
                  };
                  request(opts, function(error, response, body){
                         if (error){
                         	    console.log("privileges api returned an error"+ error);
                          }
                          else
                            console.log(body);
                  });
  }
  else
  {
    console.log("cannot get token/tenantid");
  }
  return;
}


function getToken()
{
	fs.readFile('./bannerAccessToken.txt', 'utf8', function (err, bannerAccessToken) {
		  if (err) {
		     console.log(err);
         return;
		  }
      else{
  		  console.log("\nBanner Access Token from file: " + bannerAccessToken);
  		  return bannerAccessToken;
      }
 	});
}

function getTenantID()
{
  var id;
  fs.readFile('./sessionStorage.txt', 'utf8', function (err, userToken) {
      if (err) {
           console.log(err);
           return;
      }
      else
      {
       console.log("\nUser Token from file: " + userToken);
       var decodedjwt=jwt.verify(userToken,'test scales right up');
       if (decodedjwt)
           id=decodedjwt.tenant.id;
       return id;
      }
  });
}

exports = module.exports = {setDataAccessPermissions: setDataAccessPermissions}
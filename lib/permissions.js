"use strict";
 const
      request = require('request'),
      fs = require('fs');

function setDataAccessPermissions(tenantId,bl){
	var token=getToken();
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
                       	    log.info("privileges api returned an error"+ error);
                        }
                        else
                        log.info(body);
                });
}


function getToken()
{
	fs.readFile('./bannerAccessToken.txt', 'utf8', function (err, bannerAccessToken) {
		  if (err) {
		      return console.log(err);
		  }
		  console.log("\nBanner Access Token from file: " + bannerAccessToken);
		  return bannerAccessToken;
 	});
}

exports = module.exports = { setDataAccessPermissions: setDataAccessPermissions}
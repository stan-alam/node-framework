'use strict';

const authFunctions = require('../../lib/authFunctions'),
    proxyFunctions = require('../../lib/proxyFunctions');
var epatoken;
var tenantID;
var accesstoken;
//Controller for hub-proxy-api
let controller = function(driver, options, callback){
     if(options.action == 'getEPAccessToken'){
         authFunctions.getAccessToken(options.APIKey, function(error,Token){
         	if(error)
         		callback(driver,null,error);
         	else{
	         	authFunctions.getEPAtoken(Token,function(error,token){
	         	  if(error)
	                  callback(driver,null,error);
	              else{
	         		epatoken=token;
	         		callback(driver,token);
	         	   }
	         	});
           }
       });
     }else if(options.action == 'epaRequest'){
         if (epatoken)
	         proxyFunctions.epaGetMany(epatoken,options.resource,tenantID,function(statusCode){
	         	       epatoken="";
	         	       tenantID="";  
	         	       callback(driver, {"text":statusCode});
	        });
	     else
	     	callback(driver,{"text":"Cannot make the proxy call because there is no EPAtoken"});
     }else if(options.action=='getTenantIdFromUItoken'){
     	authFunctions.getUiToken(driver, function(Token){
                authFunctions.openJwt(Token, function(error,t){
                	if(error)
                		 callback(driver,null,error);
                	else{	
	                    tenantID=t.tenant.id;
	                    callback(driver,t.tenant.id)
                    }
                });
        });
      }else if(options.action=='getAccessToken'){
          authFunctions.getAccessToken(options.APIKey, function(error,Token){
            if(error)
                callback(driver,null,error);
            else{
                accesstoken=Token;
                callback(driver,Token);
            }
           });
      }else if(options.action=='post'){
         proxyFunctions.post(accesstoken,function(statusCode){
              console.log("statusCode="+statusCode);
              callback(driver, {"text":statusCode});
         });

      }else if(options.action=='getMany'){
          proxyFunctions.getMany(accesstoken,function(statusCode){
              console.log("statusCode="+statusCode);
              callback(driver, {"text":statusCode});
      }
      else
        callback(driver, null, { "msg":"No hub-proxy-api Controller found for: "+options.action });
}

module.exports = exports = {
    controller: controller
}

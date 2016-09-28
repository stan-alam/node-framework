'use strict';

const authFunctions = require('../../lib/authFunctions'),
    proxyFunctions = require('../../lib/proxyFunctions');
var epatoken;
var tenantID;
var accesstoken;
var id;
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
	         		callback(driver,{ 'text': token });
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
                callback(driver,{ 'text': Token });
            }
           });
      }else if(options.action=='post'){
         console.log("calling post");
         proxyFunctions.post(accesstoken,options.urlpath,function(statusCode){
               callback(driver, {"text":statusCode});
         });
      }else if(options.action=='getMany'){
          console.log("calling getMany");
          proxyFunctions.getMany(accesstoken,options.resource,function(result){
            if(options.resource=='subjects')
               id=JSON.parse(result.body)[0].id;
             callback(driver, {"text":result});
          });
     }else if(options.action=='put'){
         console.log("calling put");
         proxyFunctions.put(accesstoken,id,options.contentType,function(result){
               callback(driver, {"text":result});
         });
     }
    else if(options.action =='deleteResource'){
         console.log("calling deleteResource");
         proxyFunctions.deleteResource(accesstoken,id,function(statusCode){
               callback(driver, {"text":statusCode});
         });
    }else if(options.action =='getOne'){
          console.log("calling getOne");
          proxyFunctions.getOne(accesstoken,id,function(result){
              callback(driver, {"text":result});
          });
     }else if(options.action =='getManyWithExpiredToken'){
          console.log("calling getMany with expired token");
          authFunctions.expireToken(accesstoken, function(error, jwt){
              proxyFunctions.getMany(jwt,options.resource,function(result){
                callback(driver, {"text":result});
              });
          });
      }else if(options.action=='postwithNoAuthorization'){
         console.log("calling postwithNoAuthorization");
         proxyFunctions.postwithNoAuthorization(function(statusCode){
               callback(driver, {"text":statusCode});
         });
     }
      else
        callback(driver, null, { "msg":"No hub-proxy-api Controller found for: "+options.action });
}

module.exports = exports = {
    controller: controller
}

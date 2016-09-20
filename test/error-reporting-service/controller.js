'use strict';

const adminFunctions = require('../../lib/adminFunctions');

//Controller for error-reporting-service
let controller = function(driver, options, callback){
        authFunctions.getUiToken(driver, function(Token){
            if(options.actions = '__Replace_me__')
            }else{
                callback(driver, null, { "msg":"No error-reporting-service Controller found for: "+options.action })
            }
        });
}

module.exports = exports = {
    controller: controller
}
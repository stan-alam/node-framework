'use strict';

const uiFunctions = require('../../lib/uiFunctions'),
    adminFunctions = require('../../lib/adminFunctions'),
    xpaths = require('./lib/xpaths').xpaths;


//Controller for hub-admin-ui
//this is primary just xpath information
let controller = function(driver, options, callback){
    adminFunctions.sharedDataCheck(options, function(options){
    if(options.action == 'urllocation'){
        uiFunctions.loadUrl(driver, options, function(driver){
            callback(driver);
        });
    }else if(!xpaths[options.element]){
        console.log('UI xpath Element not defined in xpaths: '+ options.element);
        callback(driver);
    }else{
        options['xpath'] = xpaths[options.element];
        if (options.hoverElement) {
            options['hoverXpath'] = xpaths[options.hoverElement];
        }
        uiFunctions.uiAction(driver, options, function(driver, result){
            callback(driver, result);
        });
    }
    });
}

module.exports = exports = {
    controller: controller
}

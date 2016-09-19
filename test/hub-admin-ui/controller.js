'use strict';

const uiFunctions = require('../../lib/uiFunctions'),
    adminFunctions = require('../../lib/adminFunctions'),
    xpaths = require('./lib/xpaths').xpaths;


//Controller for hub-admin-ui
//this is primary just xpath information
let controller = function(driver, options, callback){
    if(options.action == 'urllocation'){
        uiFunctions.loadUrl(driver, options, function(driver, result, error){
            callback(driver, result, error);
        });
    }else if(!xpaths[options.element]){
        console.log('UI xpath Element not defined in xpaths: '+ options.element);
        let error = 'message': 'Xpath element: '+options.element+' Is not defined in Schema';
        callback(driver, null, error);
    }else{
        options['xpath'] = xpaths[options.element];
        if (options.hoverElement) {
            options['hoverXpath'] = xpaths[options.hoverElement];
        }
        uiFunctions.uiAction(driver, options, function(driver, result, error){
            callback(driver, result, error);
        });
    }
}

module.exports = exports = {
    controller: controller
}

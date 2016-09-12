'use strict';

const uiFunctions = require('../../lib/uiFunctions'),
    xpaths = require('./lib/xpaths').xpaths;


//Controller for hub-admin-ui
//this is primary just xpath information
let controller = function(driver, options, callback){
    if(!xpaths[options.element]){
        console.log('UI xpath Element not defined in xpaths: '+ options.element);
        callback(driver);
    }else{
        options['xpath'] = xpaths[options.element];
        uiFunctions.uiAction(driver, options, function(driver, result){
            callback(driver, result);
        });
    }
}

module.exports = exports = {
    controller: controller
}

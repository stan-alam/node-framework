'use strict';

const uiFunctions = require('../../lib/uiFunctions'),
    adminFunctions = require('../../lib/adminFunctions'),
    sleep = require('system-sleep'),
    xpaths = require('./lib/xpaths').xpaths;

//Controller for hub-admin-ui
//this is primary just xpath information
let controller = function(driver, options, callback){
    if(options.action == 'urllocation'){
        uiFunctions.loadUrl(driver, options, function(driver, result, error){
            callback(driver, result, error);
        });
    }else if(options.action == 'switchUser'){
        options['xpath'] = xpaths['userprofilecard'];
        options['action'] = 'click';
         uiFunctions.uiAction(driver, options, function(driver, result, error){
            options['xpath'] = xpaths['signout'];
            uiFunctions.uiAction(driver, options, function(driver, result, error){
                options.driver = driver;
                uiFunctions.configLoadUi(options, function(driver){
                        callback(driver, {text: ''});
                });
              });
        });
    }else if(!xpaths[options.element]){
        console.log('UI xpath Element not defined in xpaths: '+ options.element);
        let error = { 'message': 'Xpath element: '+options.element+' Is not defined in Schema' };
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

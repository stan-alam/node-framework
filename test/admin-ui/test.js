"use strict";

const
    hub_test_lib = require("hub-test-lib"),
    function_library = require('./lib/functionLibrary'),
    driverLib = require('./lib/driver.js');

/**
 *  supertest = require('supertest'),
    assert    = require('assert'),
    expect  = require("chai").expect,
    hub_test_lib = require("hub-test-lib"),
    uiFunctions = require('../../lib/uiFunctions.js'),
    function_library = require('./lib/functionLibrary'),
    driverLib = require('./lib/driver.js');

 *
 *
 */

describe('Start admin-ui tests', function() {
    for (var test of hub_test_lib.testCases) {
        for (var browser of test.browsers) {
            describe(test.name + ' - ' + browser.name,function() {

                // get driver for specific browser
                let driver = driverLib.startDriver(browser.name);

                for (var step of test.testSteps) {
                    if (step.hasOwnProperty('script')) {
                        // execute custom function
                        step.library[step.function](driver, step.params, function(callbackDriver) {
                            driver = callbackDriver;
                        });
                    } else {
                        //execute function from library
                        function_library[step.function](driver, step.params, function(callbackDriver) {
                            driver = callbackDriver;
                        });
                    }
                }

                //  uncomment to kill driver/browser
                  driver = driverLib.endDriver(driver);
            });
        }
    }

});

"use strict";

const
    supertest = require('supertest'),
    assert    = require('assert'),
    expect  = require("chai").expect,
    hub_test_lib = require("hub-test-lib"),
    uiFunctions = require('../../lib/uiFunctions.js'),
    function_library = require('./lib/functionLibrary');


describe('Start admin-ui tests', function() {

    let driver;

    var testCaseFunction = function(testCount) {

        if (hub_test_lib.testCases[testCount]) {
            var test = hub_test_lib.testCases[testCount];
            describe(test.name,function() {
                var stepFunction = function(count) {
                    if (test.testSteps[count]) {
                                var step = test.testSteps[count];

                                if (step.hasOwnProperty('script')) {
                                    // execute custom function
                                        step.library[step.function](driver, step.params, function(callbackDriver) {
                                            driver = callbackDriver;
                                            stepFunction(count+1);
                                        });
                                        
                                    } else {
                                    
                                        //execute function from library
                                        function_library[step.function](driver, step.params, function(callbackDriver) {
                                            driver = callbackDriver;
                                            stepFunction(count+1);
                                        });

                                    }
                                }
                    else {
                        // call next test case
                        testCaseFunction(testCount+1);
                    }
                };
                stepFunction(0);
           });
        }
    }    

    testCaseFunction(0);
   
       
});

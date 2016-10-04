"use strict";

const
    _ = require('lodash'),
     _eval = require('eval'),
    fs = require('fs'),
    formatJson = require('format-json'),
    async = require('async'),
    assert = require("chai").assert,
    validator = require('jsonschema').Validator,
    envVars = require('./framework/environments'),
    schema = require('./framework/testCaseSchema.json'),
    availableAsserts = require('./framework/validation'),
    uiFunctions = require('./lib/uiFunctions.js'),
    preSetupLib = require('./lib/presetup.js'),
    adminFunctions = require('./lib/adminFunctions.js');

var runExtraLogs = process.env.logging || false;

let runTestFramework = function(microservice){
    var driver;
    var uiToken;
    var preSetup;

    before(function(done) {
        this.timeout(500000000)

        //Set UI config Information from environment file
        let uiConfig = {
            'username': envVars.credentials.username,
            'password': envVars.credentials.password,
            'browser': 'chrome'
        };

        uiFunctions.configLoadUi(uiConfig, function(uiDriver) {
            driver = uiDriver;

            //If user is mbmormann call to clean out all config information
            if(envVars.credentials.username == 'mbmormann'){
                //Call to delete all configuration information
                preSetupLib.deleteAll(driver, function(driver){
                    //Call to run pre setup with templates and applications
                    preSetupLib.setup(driver, function(driver, setup){
                        preSetup = setup;
                        done();
                    });
                });
            }else{
                //Call to run pre setup with templates and applications
                preSetupLib.setup(driver, function(driver, setup){
                    preSetup = setup;
                    done();
                });
           }
        });
    });

    after(function(done){
        this.timeout(800000000);
        //Call to cleanup preSetup config applications
        preSetupLib.cleanUp(driver, preSetup, function(){
            driver.quit();
            done();
        });
    });

    //Loop thought all the TestCases for Hub-admin-ui
    let testCasefiles = fs.readdirSync('./testStories/'+microservice+'/');

    //If testStories has a develop.json only run that file and exit
    if(testCasefiles.indexOf('develop.json') !== -1){
        testCasefiles = ['develop.json'];
    }

    let runAssertions = function(driver, validate, validateResult, callback){
        console.error('============================================')
        console.error("Validate: "+ JSON.stringify(validate));
        console.error("Result: "+ JSON.stringify(validateResult));

        let ValidateResult = { text: '' };
        //See if result is from api and is an array of responses [{body, statuscode}]
        if(Array.isArray(validateResult.text) && (validateResult.text.length > 0) && (validateResult.text[0].body)){
            //Validate only the first response in array
            validateResult.text = validateResult.text[0];
        }

        //Check if user is validating on a location in the responding data (multi levels of response: body.id)
        if((validate.test.location) && (validate.test.location.indexOf('.') > -1)){
            //Validate on the exact location of object with in result
            let rval = _eval('module.exports = function () { return '+ JSON.stringify(validateResult.text)+'.'+validate.test.location+'} ');
            ValidateResult.text = rval();
        }else if(validate.test.location){
            //If location is set with no children validate on first location ( location: body )
            ValidateResult.text = validateResult.text[validate.test.location];
        }else{
            //No location is set for validation, validate on whole response
            ValidateResult.text = validateResult.text;
        }

        //If caseSensitive is set to false then lowercase validation and test
        if(('caseSensitive' in validate.test) && (validate.test.caseSensitive == false)){
            if(!Array.isArray(validate.test.value))
                validate.test.value == validate.test.value.toLowerCase();
            if(!Array.isArray(ValidateResult.text))
                ValidateResult.text = ValidateResult.text.toLowerCase();
        }

        //Custom validation to see if response is array and empty
        if('isEmpty' in validate.test){
            assert.isAbove(result.text.length, 0);
            callback();
        }

        //Run builtin chai assertions based on what is in validation.json
        if( availableAsserts.chaiTwo.indexOf(validate.test.action) !== -1){
                assert[validate.test.action](ValidateResult.text, validate.test.name || '');
                callback();
        }else if( availableAsserts.chaiThree.indexOf(validate.test.action) !== -1){
                assert[validate.test.action](ValidateResult.text, validate.test.value, validate.test.name || '');
                callback();
        }else if( availableAsserts.chaiThreeReverse.indexOf(validate.test.action) !== -1){
                 assert[validate.test.action]( validate.test.value, ValidateResult.text, validate.test.name || '');
                 callback();
         }else{
            //List of Extra lookups other then chai
            //Custom use of action operator where you can see if a number is (<,>,=,!=) result
            if(validate.test.action == 'operator'){
                if(!validate.test.operator){
                    console.error('With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                    assert.equal(true, false, 'With using operator Action you need to set validate.test.operator (<,>,=,!=)');
                    callback(true);
                }else{
                    assert.operator(ValidateResult.text, validate.test.operator, validate.test.value, validate.test.name || '');
                    callback();
                }
            }else{
                //Validation to check is not in the validation mapping file
                console.error('The Validation defined in JSON is invalid referrer to "framework/validation.json" File')
                assert.equal(true, false, 'No Validation Action Defined ('+validate.test.action+')');
                callback(true);
            }
        }
    }

    let testCase = '';
    let v = new validator();
    async.each(testCasefiles, function(testCase){
        let test = require('./testStories/'+microservice+'/' + testCase);
        //Validate test case with Schema before running
        let passValidation = v.validate(test, schema);
        if(passValidation.valid === true){
            var i = 0;

            var sharedData = {};
            for (var testCaseLoop of test.testCases) {
                //Console out testCase Information
                it('(EIH-'+test.id+') - Test Case: ' + testCaseLoop.name, function(done) {
                    this.timeout(80000000);
                    let runTest = test.testCases[i]; //Will need to loop through
                    let runSteps = function(stepindex) {
                        if(!runTest || (runTest.steps.length == 0)){
                           done();
                        } else if('validation' in runTest){
                            console.log('Validation is in wrong location Move to new location in steps');
                            console.error("Step: "+stepindex);
                            assert.equal(true, false, 'Error on Step: '+ stepindex);
                            done();
                        }else{
                           // Sort Steps By ID
                            runTest.steps.sort(function(a, b) {
                              if (a.id > b.id)
                                 return 1;
                              return a.id === b.id ? 0 : -1;
                            });

                            //Load Step Data
                            let step = runTest.steps[stepindex];

                            //Load Controller of step type
                            let path = './test/' + step.type + '/controller.js';
                            let stepController = require(path);

                            //Append All previous step results for shared data
                            step.params.shared = sharedData;

                            //Append preSetup data to be used with shared data flag as Step: preSetup
                            step.params.shared.preSetup = preSetup;
                            adminFunctions.sharedDataCheck(step.params, function(options){
                                if(runExtraLogs){
                                    console.log('Steps to Preform:');
                                    console.log(formatJson.diffy(options));
                                }
                                stepController.controller(driver, options, function(driver, sharedResult, error) {
                                    function writeScreenshot(data, name) {
                                      name = name || 'default.png';
                                      fs.writeFileSync('screenshots/'+microservice+'/' + name, data, 'base64');
                                    };

                                    driver.takeScreenshot().then(function(data) {
                                      writeScreenshot(data, 'testCaseID_'+test.id+'-Step_'+stepindex+'.png');
                                    });

                                    //Stop Step and display error that came back from controller
                                    if(error){
                                        console.error("Step: "+stepindex);
                                        console.error("Options: "+ JSON.stringify(step));
                                        console.error("Error Message: "+ JSON.stringify(error));
                                        console.trace("Stack Trace");
                                        assert.equal(true, false, 'Error on Step: '+ stepindex);
                                        done();
                                    }

                                    //Added result from controller to global Shared Data for Next loop append
                                    if(sharedResult)
                                        sharedData['step'+stepindex] = sharedResult;

                                    //Check if Test is a validation also
                                    if((step.tests) && (step.tests[0])){

                                        //StepTests - driver, web driver - index test location in array
                                        let runStepTest = function(driver, index){

                                            //Pass Step information to Step Index
                                            runAssertions(driver, { 'test': step.tests[index] }, sharedResult, function(end){

                                               //Run all validations in a loop
                                               if(end){
                                                  //Assertion check comeback with end all tests and step
                                                  done();
                                                }else if(step.tests[(index+1)]){
                                                    //Run Next Test incrementing index
                                                    runStepTest(driver, (index+1));
                                                }else{
                                                    //Check for Next step and if so Run next step in json
                                                    if (runTest.steps[stepindex + 1])
                                                        runSteps((stepindex + 1));
                                                    else{
                                                        //No More Steps in JSON file so increment testcase counter
                                                        //Call done for mocha to run next testcase
                                                        i = i + 1;
                                                        done();
                                                    }
                                                }
                                            });
                                        }

                                        //Run step Tests
                                        runStepTest(driver, 0);
                                    }else{
                                        //Step has no Test so Go to next step in list
                                        if (runTest.steps[stepindex + 1])
                                            runSteps((stepindex + 1));
                                        else {
                                            // End of steps run next testcase
                                            i = i + 1;
                                            done();
                                        }
                                    }
                                });
                            });
                        }
                    }
                    //Start Running steps
                    runSteps(0);
                });
            }
        }else{
            console.error("Test JSON Validation Error: "+ passValidation.valid)
            console.error(JSON.stringify(passValidation));
        }
    });
}
module.exports = exports = { runTestFramework: runTestFramework }

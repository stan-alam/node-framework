'use strict'

const fs = require('fs'),
    fsExtra = require('fs-extra'),
    sleep = require('system-sleep'),
    spawn = require('child_process').exec,
    shell = require('shelljs'),
    path = require('path'),
    fileExists = require('file-exists');

var testToRun = process.argv[2] || 'EndToEnd';

//Setup Selenium
var logdir = new Date().getTime();

try{
    fs.mkdirSync("logs");
    fs.mkdirSync("screenshots");
} catch(e){
    console.info("logs already created");
}
fs.mkdirSync("logs/"+logdir);
spawn("./node_modules/.bin/selenium-standalone install && ./node_modules/.bin/selenium-standalone start > logs/"+logdir+"/selenium.log");
spawn("xvfb-run --server-args='-screen 0, 1024x768x16' ./node_modules/chromedriver/bin/chromedriver --port=19515 --verbose > logs/"+logdir+"/chromedriver.log");

function runTests(loopCount){
    if (fileExists("logs/"+logdir+"/selenium.log")) {
        //Get Available Tests
        function getDirectories() {
          return fs.readdirSync('testStories').filter(function(file) {
            return fs.statSync(path.join('test', file)).isDirectory();
          });
        }

        var testList = getDirectories();
        var failedRun = false;
        if(testList.indexOf(testToRun) == -1){
            console.error("Running Tests End To End Tests ");
            let startTest = function(testIndex){
                if(!testList[testIndex]){
                    if(failedRun){
                        process.exit(1);
                    }else{
                        process.exit(0);
                    }
                }
                let test = testList[testIndex];
                fsExtra.remove("screenshots/"+test, function(){
                    fs.mkdirSync("screenshots/"+test)
                });;
                shell.exec("./node_modules/mocha/bin/_mocha test/"+test+"/test.js --reporter mochawesome --reporter-options reportDir=mochawesome-reports/"+test+",reportName="+test+",reportTitle="+test+",inlineAssets=false", function(){
                    let resultReport = require('./mochawesome-reports/'+test+'/'+test+'.json');
                    if(resultReport.stats.failures > 0){
                        failedRun = true;
                    }
                    startTest((testIndex+1))
                });
            };
            startTest(0)
        }else{
            console.error("Running Tests Just for: "+ testToRun);
            try{
                fsExtra.emptyDir("screenshots/"+testToRun);
                fs.mkdirSync("screenshots/"+testToRun);
            }catch(e){
                console.error('Directory screenshots/'+testToRun+ ' is Setup.')
            }
            shell.exec("./node_modules/mocha/bin/_mocha test/"+testToRun+"/test.js --reporter mochawesome", function(){
                let resultReport = require('./mochawesome-reports/mochawesome.json');
                process.exit(resultReport.stats.failures);
            });
        }
    }else if(loopCount > 60){
        console.error('Selenium Server Never started');
        process.exit('0');
    }else{
        sleep(1000);
        console.error('Checking if Selenium has started ('+logdir+') - Check: #' + loopCount);
        runTests(loopCount+1);
    }
}

//runTests
runTests(0);

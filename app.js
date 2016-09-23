'use strict'

const fs = require('fs'),
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
} catch(e){
    console.info("logs already created");
}
fs.mkdirSync("logs/"+logdir);
spawn("./node_modules/.bin/selenium-standalone install && ./node_modules/.bin/selenium-standalone start > logs/"+logdir+"/selenium.log");
spawn("xvfb-run ./node_modules/chromedriver/bin/chromedriver --port=19515 --verbose > logs/"+logdir+"/chromedriver.log");

function runTests(loopCount){
    if (fileExists("logs/"+logdir+"/selenium.log")) {
        //Get Available Tests
        function getDirectories() {
          return fs.readdirSync('test').filter(function(file) {
            return fs.statSync(path.join('test', file)).isDirectory();
          });
        }

        var testList = getDirectories();
        if(testList.indexOf(testToRun) == -1){
            console.error("Running Tests End To End Tests ");
            let startTest = function(testIndex){
                if(!testList[testIndex]){
                    process.exit();
                }
                let test = testList[testIndex];
                shell.exec("./node_modules/mocha/bin/_mocha test/"+test+"/test.js --reporter mochawesome --reporter-options reportDir=mochawesome-reports/"+test+",reportName="+test+",reportTitle="+test+",inlineAssets=true", function(){
                    let resultReport = require('./mochawesome-reports/'+test+'/mochawesome.json');
                    if(resultReport.stats.failures > 0){
                        process.exit(resultReport.stats.failures);
                    }else{
                        startTest((testIndex+1))
                    }
                });
            };
            startTest(0)
        }else{
            console.error("Running Tests Just for: "+ testToRun);
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

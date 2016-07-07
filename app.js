const fs = require('fs'),
    shell = require('shelljs'),
    path = require('path');



var testToRun = process.argv[2] || 'EndToEnd';

//Get Available Tests
function getDirectories() {
  return fs.readdirSync('test').filter(function(file) {
    return fs.statSync(path.join('test', file)).isDirectory();
  });
}

var testList = getDirectories();

console.error('test/'+testList.join(' test/'));

if(testList.indexOf(testToRun) == -1){
    console.error("Running Tests End To End Tests ");
    shell.exec("./node_modules/mocha/bin/_mocha test/"+testList.join(" test/") + " --reporter mochawesome")
}else{
    console.error("Running Tests Just for: "+ testToRun);
    shell.exec("./node_modules/mocha/bin/_mocha test/"+testToRun+" --reporter mochawesome")
}


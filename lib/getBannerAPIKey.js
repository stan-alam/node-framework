"use srtict"

var fs = require('fs');
var request = require("request");
var bannerAppID;
var data;
var sessionStorage;
var bannerAPIKey;



fs.readFile('./bannerAPIKey.txt', 'utf8', function (err, bannerAPIKey) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner API Key from file: " + bannerAPIKey);



fs.readFile('./sessionStorage.txt', 'utf8', function (err, sessionStorage) {
  if (err) {
    return console.log(err);
  }
  console.log("\nSession Storage from file: " + sessionStorage);


var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/nic/api/applications/' + data;
var headers = {
    'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
    'Authorization' : 'Bearer ' + sessionStorage
    };



    request.get({ url: url, headers: headers }, function (error, response, body) {
    console.log("\nBanner API Key: " + body);
    bannerAPIKey = body;
    console.log("\nThis is the Banner API Key " + bannerAPIKey);
    });

  });

})




"use strict";

var fs = require('fs');
var bannerAppID;
var bannerAPIKey;
//var jsonResponseFromConfigApi;
var data;
var sessionStorage;

var request = require("request"); 



fs = require('fs') 
fs.readFile('./bannerAppID.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner AppID from file: " + data);


fs = require('fs')
fs.readFile('./bannerAPIKey.txt', 'utf8', function (err, bannerAPIKey) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner API Key from file: " + bannerAPIKey);


fs = require('fs')
fs.readFile('./sessionStorage.txt', 'utf8', function (err, sessionStorage) {
  if (err) {
    return console.log(err);
  }
  console.log("\nSession Storage from file: " + sessionStorage);




var resourceOwnerData = {

  "id": data,
  "name": "Banner",
  "apiKey": bannerAPIKey,
  "resources": {
    "baseUri": "http://hub-authoritative-source-example.2020ar.com:443/nic/api",
    "resources": [{
      "name": "subjects"
    }]
  }

}

var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/nic/api/applications/'+ data;
var headers = {
    'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
    'Authorization' : 'Bearer ' + sessionStorage
    };


    request.put({ url: url, headers: headers, json: resourceOwnerData }, function (error, response, body) {
    console.log(body);   
    });

  });

});

})

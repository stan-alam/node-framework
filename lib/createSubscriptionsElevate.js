"use strict";

var fs = require('fs');
var elevateAppID;
//var jsonResponseFromConfigApi;
var data;
var sessionStorage;

var request = require("request");



fs = require('fs')
fs.readFile('./elevateAppID.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log("\nElevate AppID from file: " + data);


fs = require('fs')
fs.readFile('./elevateAPIKey.txt', 'utf8', function (err, elevateAPIKey) {
  if (err) {
    return console.log(err);
  }
  console.log("\n Elevate API Key from file: " + elevateAPIKey);



fs = require('fs')
fs.readFile('./sessionStorage.txt', 'utf8', function (err, sessionStorage) {
  if (err) {
    return console.log(err);
  }
  console.log("\n Session Storage from file: " + sessionStorage);




var subscriptionData = {

  "id": data,
  "apiKey": elevateAPIKey,
  "name": "Elevate",
  "subscriptions": [{
  "resourceName": "subjects"
  }]

}

var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/nic/api/applications/' + data;
var headers = {
    'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
    'Authorization' : 'Bearer ' + sessionStorage
    };


    request.put({ url: url, headers: headers, json: subscriptionData }, function (error, response, body) {
    console.log(body);
    });


  });
});

})

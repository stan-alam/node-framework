"use strict";
// This script creates four applications: Banner, Colleague, Elevate and Pilot

var Nightmare = require('nightmare');
var fs = require('fs');
var vo = require('vo');
var bannerAppID;
var bannerAPIKey;
var colleagueAppID;
var colleagueAPIKey;
var elevateAppID;
var elevateAPIKey;
var pilotAppID;
var pilotAPIKey;
var jsonResponseFromConfigApi;
var data;
var tenantId;

vo(run)(function(err, result) {
  if (err) throw err;
});

function *run() {
  var nightmare = Nightmare();
  var sessionStorage = yield nightmare
    .goto('https://test-integrationhub-integrate.10004.elluciancloud.com/')
    .wait(1000)
    .type('input[name="username"]', 'aamayer@ellucian.me.sandbox')
    .type('input[name="password"]', 'Demo99!?')
    .click('input[type=submit]')
    .wait(10000)


    .evaluate(function() {

     return sessionStorage.token;

   done();
    });

  console.log("This is the User's session token " + sessionStorage)

  fs.writeFile("./sessionStorage.txt", sessionStorage, function(err) {
    if(err) {
        return console.log(err);
    }
  })


  yield nightmare.end();

var request = require("request");

var postData4 = {

  'id' : '31642a8c-3226-4cff-8703-40bb6b4389fa',
  'name' : 'Pilot',
};




var postData3 = {

  'id' : '830df3d9-9299-4814-8124-fd6d8adf80dd',
  'name' : 'Elevate',
};



var postData2 = {

  'id' : '3e189501-62ea-4811-9e4f-d970452613f6',
  'name' : 'Colleague',
};



var postData1 = {

  'id' : '0289f224-50d6-4f2d-9934-1c3226e735cd',
  'name' : 'Banner',
};




function createTheApplications(thisData) {

var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/nic/api/applications/';
var headers = {
    'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
    'Authorization' : 'Bearer ' + sessionStorage
    };


    request.post({ url: url, headers: headers, json: thisData }, function (error, response, body) {


   if (thisData == postData1) {
    var jsonResponse = body;

    bannerAppID = (jsonResponse.id);
    bannerAPIKey = (jsonResponse.apiKey);
    console.log("Banner Application ID = " + bannerAppID);
    console.log("Banner API Key = " + bannerAPIKey);
    fs.writeFile("./bannerAPIKey.txt", bannerAPIKey);
    fs.writeFile("./bannerAppID.txt", bannerAppID, function(err) {
    if(err) {
        return console.log(err);
    }
  })

    } else {


  if (thisData == postData2) {

    var jsonResponse = body;

    colleagueAppID = (jsonResponse.id);
    colleagueAPIKey = (jsonResponse.apiKey);
    console.log("Colleague Application ID = " + colleagueAppID);
    console.log("Colleague API Key = " + colleagueAPIKey);
    fs.writeFile("./colleagueAPIKey.txt", colleagueAPIKey);
    fs.writeFile("./colleagueAppID.txt", colleagueAppID, function(err) {
    if(err) {
        return console.log(err);
    }
  })


      } else {

   if (thisData == postData3) {

    var jsonResponse = body;

    elevateAppID = (jsonResponse.id);
    elevateAPIKey = (jsonResponse.apiKey);
    console.log("Elevate Application ID = " + elevateAppID);
    console.log("Elevate API Key = " + elevateAPIKey);
    fs.writeFile("./elevateAPIKey.txt", elevateAPIKey);
    fs.writeFile("./elevateAppID.txt", elevateAppID, function(err) {
    if(err) {
        return console.log(err);
    }
  })


      }

    }

   if (thisData == postData4) {

    var jsonResponse = body;

    pilotAppID = (jsonResponse.id);
    pilotAPIKey = (jsonResponse.apiKey);
    console.log("Pilot Application ID = " + pilotAppID);
    console.log("Pilot API Key = " + pilotAPIKey);
    fs.writeFile("./pilotAPIKey.txt", pilotAPIKey);
    fs.writeFile("./pilotAppID.txt", pilotAppID, function(err) {
    if(err) {
        return console.log(err);
    }

  })


  }

}


  });




  }


var   payLoads = [postData1, postData2, postData3, postData4];
var   count = 0;


for( count = 0;  count < payLoads.length;  count++) {

    var thisData =  payLoads[count];

    createTheApplications(thisData);




   }

}



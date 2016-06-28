"use srtict"

var fs = require('fs');
var request = require("request");
var bannerAppID;
var colleagueAppID;
var elevateAppID;
var pilotAppID;
var sessionStorage;
var appID;


function deleteApplications(thisData) {

fs.readFile('./sessionStorage.txt', 'utf8', function (err, sessionStorage) {
  if (err) {
    return console.log(err);
  }
  console.log("\nSession Storage from file: " + sessionStorage);

var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/nic/api/applications/' + thisData;
var headers = {
    'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
    'Authorization' : 'Bearer ' + sessionStorage
    };



    request.delete({ url: url, headers: headers }, function (error, response, body) {
    console.log("\nBanner API Key: " + body);
    });

  })

}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           




fs.readFile('./bannerAppID.txt', 'utf8', function (err, bannerAppID) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner App ID from file: " + bannerAppID);

fs.readFile('./colleagueAppID.txt', 'utf8', function (err, colleagueAppID) {
  if (err) {
    return console.log(err);
  }
  console.log("\nColleague App ID from file: " + colleagueAppID);

fs.readFile('./elevateAppID.txt', 'utf8', function (err, elevateAppID) {
  if (err) {
    return console.log(err);
  }
  console.log("\nElevate App ID from file: " + elevateAppID);

fs.readFile('./pilotAppID.txt', 'utf8', function (err, pilotAppID) {
  if (err) {
    return console.log(err);
  }
  console.log("\nPilot App ID from file: " + pilotAppID);


var sevParams = [bannerAppID, colleagueAppID, elevateAppID, pilotAppID]
var count                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ;

for( count = 0; count < sevParams.length; count++ {

    var thisData = sevParams[count];

    deleteApplications(thisData);

  }

      });

    });

  });

});
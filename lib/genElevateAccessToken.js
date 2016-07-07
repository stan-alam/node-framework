"use strict";
//This genElevateAccessToken script generates an Access Token for Elevate and place in txt file

var fs = require('fs');
var elevateAPIKey;
var data;
//var bannerAppID;
var elevateAccessToken;
var body;
var jsonResponse = body;
var request = require("request");

function getElevateAccessToken()
{
  fs.readFile('./elevateAPIKey.txt', 'utf8', function (err, elevateAPIKey) {
    if (err) {
        return console.log(err);
    }
    else
    {
      console.log("\nElevate API Key from file: " + elevateAPIKey);
      var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/auth';
      var headers = {
          'Authorization' : 'Bearer ' + elevateAPIKey
          };
          request.post({ url: url, headers: headers}, function (error, response, body) {
            elevateAccessToken = (jsonResponse);
            fs.writeFile("./elevateAccessToken.txt", body);
            console.log("\nElevate Aceess Token: " + body);
            return(body);
          });
    }
  });
}

getElevateAccessToken();

exports = module.exports = {getElevateAccessToken: getElevateAccessToken}
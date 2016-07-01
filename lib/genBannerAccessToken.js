"use strict";
//This genBannerAccessToken script generates an Access Token for Banner and place in txt file

var fs = require('fs');
var bannerAPIKey;
var data;
//var bannerAppID;
var bannerAccessToken;
var body;
var jsonResponse = body;
var request = require("request");

function getBannerAccessToken()
{
  fs.readFile('./bannerAPIKey.txt', 'utf8', function (err, bannerAPIKey) {
    if (err) {
        return console.log(err);
    }
    else
    {
      console.log("\nBanner API Key from file: " + bannerAPIKey);
      var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/auth';
      var headers = {
          'Authorization' : 'Bearer ' + bannerAPIKey
          };
          request.post({ url: url, headers: headers}, function (error, response, body) {
            bannerAccessToken = (jsonResponse);
            fs.writeFile("./bannerAccessToken.txt", body);
            console.log("\nBanner Aceess Token: " + body);
            return(body);
          });
    }
  });
}

getBannerAccessToken();

exports = module.exports = {getBannerAccessToken: getBannerAccessToken}
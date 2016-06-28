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



fs = require('fs')
fs.readFile('./bannerAPIKey.txt', 'utf8', function (err, bannerAPIKey) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner API Key from file: " + bannerAPIKey);


/*
fs = require('fs')
fs.readFile('./bannerAppID.txt', 'utf8', function (err, bannerAppID) {
  if (err) {
    return console.log(err);
  }
  console.log("\nBanner App ID from file: " + bannerAppID);
*/



var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/auth';
var headers = {
    'Authorization' : 'Bearer ' + bannerAPIKey
    };


    request.post({ url: url, headers: headers}, function (error, response, body) {
    bannerAccessToken = (jsonResponse);
    fs.writeFile("./bannerAccessToken.txt", body);
    console.log("\nBanner Aceess Token: " + body);
    });


  });

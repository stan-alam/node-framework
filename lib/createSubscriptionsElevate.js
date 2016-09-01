"use strict";

    module.exports = {
        addSubscription: function(cb) {
            var fs = require('fs');
            var elevateAppID;
            //var jsonResponseFromConfigApi;
            var data;
            var sessionStorage;
            var request = require("request");

            fs.readFile('./elevateAppID.txt', 'utf8', function(err, data) {
                if (err) {
                    console.log(err);
                    cb(err);
                    return;
                }
                console.log("\nElevate AppID from file: " + data);
                fs = require('fs')
                fs.readFile('./elevateAPIKey.txt', 'utf8', function(err, elevateAPIKey) {
                    if (err) {
                       console.log(err);
                       cb(err);
                       return;
                    }
                    console.log("\n Elevate API Key from file: " + elevateAPIKey);
                    fs = require('fs')
                    fs.readFile('./sessionStorage.txt', 'utf8', function(err, sessionStorage) {
                        if (err) {
                          console.log(err);
                          cb(err);
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
                        var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/du/api/applications/' + data;
                        var headers = {
                            'Content-Type': 'application/vnd.hedtech.applications.v2+json',
                            'Authorization': 'Bearer ' + sessionStorage
                        };
                        request.put({
                            url: url,
                            headers: headers,
                            json: subscriptionData
                        }, function(error, response, body) {
                             if (error)
                                cb(error);
                            else{
                              console.log(body);
                              cb(null);
                            }
                            return;
                        });

                    });
                });

            })
        }
    }

"use strict";
   module.exports = {
        addResource: function(cb) {
            var fs = require('fs');
            var bannerAppID;
            var bannerAPIKey;
            //var jsonResponseFromConfigApi;
            var data;
            var sessionStorage;
            var request = require("request");
            fs.readFile('./bannerAppID.txt', 'utf8', function(err, data) {
                if (err) {
                   console.log(err);
                   cb(err);
                   return;
                }
                console.log("\nBanner AppID from file: " + data);

                fs.readFile('./bannerAPIKey.txt', 'utf8', function(err, bannerAPIKey) {
                    if (err) {
                        console.log(err);
                        cb(err);
                        return;
                    }
                    console.log("\nBanner API Key from file: " + bannerAPIKey);

                    fs.readFile('./sessionStorage.txt', 'utf8', function(err, sessionStorage) {
                        if (err) {
                            console.log(err);
                            cb(err);
                            return;
                        }
                        console.log("\nSession Storage from file: " + sessionStorage);
                        var resourceOwnerData = {

                            "id": data,
                            "name": "Banner",
                            "apiKey": bannerAPIKey,
                            "resources": {
                                "baseUri": "http://hub-authoritative-source-example.2020ar.com:443/du/api",
                                "resources": [{
                                    "name": "subjects"
                                }]
                            }

                        }

                        var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/du365/api/applications/' + data;
                        var headers = {
                            'Content-Type': 'application/vnd.hedtech.applications.v2+json',
                            'Authorization': 'Bearer ' + sessionStorage
                        };


                        request.put({
                            url: url,
                            headers: headers,
                            json: resourceOwnerData
                        }, function(error, response, body) {
                            if(error)
                                cb(error);
                            else
                            {
                                console.log(body);
                                cb(null);
                                return;
                            }
                        });

                    });

                });

            });
        }
    }

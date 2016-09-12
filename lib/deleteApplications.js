"use srtict"


module.exports = {
        // This script deletes four applications: Banner, Colleague, Elevate and Pilot
        deleteApplications: function(callback) {



                var fs = require('fs');
                var request = require("request");
                var bannerAppID;
                var colleagueAppID;
                var elevateAppID;
                var pilotAppID;
                var sessionStorage;
                var appID;
                var url;
                var headers;




                function removeApplications(thisData, cb) {

                    console.log('* inner deleteApplications');


                    fs.readFile('./sessionStorage.txt', 'utf8', function(err, sessionStorage) {
                        console.log('* in readfile');
                        console.log('======================');
                        console.log(sessionStorage)
                        if (err) {
                            console.log('ERROR=' + err);
                            return console.log(err);
                        }
                        console.log("\nSession Storage from file used for deleting: " + sessionStorage);



                        console.log('* before request.delete');

                        var url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/admin/du/api/applications/' + thisData
                        var headers = {
                        'Content-Type' : 'application/vnd.hedtech.applications.v2+json',
                        'Authorization' : 'Bearer ' + sessionStorage
                         }

                         request({ method: "delete", url: url, headers: headers }, function (error, response, body) {
                         console.log(body);
                            cb();
                         });

                        // request.delete({
                        //     url: url,
                        //     headers: headers
                        // }, function(error, response, body) {

                        // });

                    })


                    console.log('* after readfile');
                }

                console.log('start reading files');


                fs.readFile('./bannerAppID.txt', 'utf8', function(err, bannerAppID) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("\nBanner App ID from file for deleting: " + bannerAppID);

                    fs.readFile('./colleagueAppID.txt', 'utf8', function(err, colleagueAppID) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("\nColleague App ID from file for deleting: " + colleagueAppID);

                        fs.readFile('./elevateAppID.txt', 'utf8', function(err, elevateAppID) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("\nElevate App ID from file for deleting: " + elevateAppID);

                            fs.readFile('./pilotAppID.txt', 'utf8', function(err, pilotAppID) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("\nPilot App ID from file for deleting: " + pilotAppID);


                                var sevParams = [bannerAppID, colleagueAppID, elevateAppID, pilotAppID]
                                console.log("now start deleting")
                                var startRemove = function(params, index){
                                    if(params[index]){
                                        console.log("Removing: "+ JSON.stringify(params[index]))
                                        removeApplications(params[index], function(){
                                            startRemove(params, index+1);
                                        })
                                    }else{
                                        callback();
                                    }
                                }
                                startRemove(sevParams, 0);

                                // for (count = 0; count < sevParams.length; count++) {
                                //     console.log("this is the count" + count);
                                //     var thisData = sevParams[count];
                                //     console.log("this is thisData" + thisData);
                                //     removeApplications(thisData);


                                // }
                                // callback();
                            });

                        });

                    });

                });

            }

        }
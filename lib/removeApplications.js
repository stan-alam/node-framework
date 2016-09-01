var fs = require('fs');
var bannerAppID;
var colleagueAppID;
var elevateAppID;
var pilotAppID;
var data;
var sessionStorage;

var request = require("request");


function deleteApplications(thisData) {



    fs = require('fs')
    fs.readFile('/tmp/sessionStorage.txt', 'utf8', function(err, sessionStorage) {
        if (err) {
            return console.log(err);
        }
        console.log("sessionStorage from file " + sessionStorage);

        console.log(thisData);
        var url = 'https://testhub-admin-api.2020ar.com/du/api/applications/' + thisData
        var headers = {
            'Content-Type': 'application/vnd.hedtech.applications.v2+json',
            'Authorization': 'Bearer ' + sessionStorage
        }


        request({
            method: "delete",
            url: url,
            headers: headers
        }, function(error, response, body) {
            console.log(body);
        });


    })

}

fs = require('fs')
fs.readFile('/tmp/elevateAppID.txt', 'utf8', function(err, elevateAppID) {
    if (err) {
        return console.log(err);
    }
    console.log("ElevateAppID from file " + elevateAppID);



    fs = require('fs')
    fs.readFile('/tmp/bannerAppID.txt', 'utf8', function(err, bannerAppID) {
        if (err) {
            return console.log(err);
        }
        console.log("Banner Application ID from file " + bannerAppID);


        fs = require('fs')
        fs.readFile('/tmp/colleagueAppID.txt', 'utf8', function(err, colleagueAppID) {
            if (err) {
                return console.log(err);
            }
            console.log("Colleague Application ID from file " + colleagueAppID);



            fs = require('fs')
            fs.readFile('/tmp/pilotAppID.txt', 'utf8', function(err, pilotAppID) {
                if (err) {
                    return console.log(err);
                }
                console.log("Pilot Application ID from file " + pilotAppID);



                var sevParams = [elevateAppID, bannerAppID, colleagueAppID, pilotAppID];
                var count = 0;

                for (count = 0; count < sevParams.length; count++) {

                    var thisData = sevParams[count];

                    deleteApplications(thisData);

                }

            });

        });

    });

});
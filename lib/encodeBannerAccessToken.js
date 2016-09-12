"use strict";

module.exports = {
    // This script deletes four applications: Banner, Colleague, Elevate and Pilot
    encodeBannerAccessToken: function(cb) {


        var jwt = require('jwt-simple');
        var secret = 'test scales right up';
        var sessionStorage;
        var fs = require('fs');



//function encodeMe(callback) {

        fs.readFile('./bannerAccessToken.txt', 'utf8', function(err, sessionStorage) {

            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('\n special bannerAccessToken from file used for use in JWT: ' + sessionStorage);




            var token = sessionStorage;
            // decode
            var decoded = jwt.decode(token, secret);
            console.log(decoded.tenant.name);
            decoded.tenant.name = 'ethos';
            var payload = decoded;
            var encoded = jwt.encode(payload, secret);
            console.log(encoded);





            fs.writeFile("./specialBannerAccessToken.txt", encoded, function(err) {
                if (err) {
                    return console.log(err);
                }
            });

             fs.writeFile("./specialBannerTenantID.txt", decoded.tenant.id, function(err) {
                if (err) {
                    return console.log(err);
                }
            });


cb(null);


        });

  //  }
  //  cb(null);
    }

}
"use strict";

module.exports = {
    // This script deletes four applications: Banner, Colleague, Elevate and Pilot
    decodeBannerAccessToken: function(cb) {


        var jwt = require('jwt-simple');
        var secret = 'test scales right up';
        var sessionStorage;
        var fs = require('fs');







        fs.readFile('./bannerAccessToken.txt', 'utf8', function(err, sessionStorage) {

            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('\n *****************Banner Access Token from file used for use in JWT: ' + sessionStorage);




            var token = sessionStorage;
            // decode
            var decoded = jwt.decode(token, secret);
            console.log(decoded);

           var decodedString = JSON.stringify(decoded.tenant.permissions);




            fs.writeFile("./decodedAccessToken.txt", decodedString, function(err) {
                if (err) {
                    return console.log(err);
                }
            });



        });

  //  }
    cb(null);
    }

}
"use strict";

module.exports = {
    // This script deletes four applications: Banner, Colleague, Elevate and Pilot
    searchTextFile: function(cb) {


        var jwt = require('jwt-simple');
        var secret = 'test scales right up';
        var sessionStorage;
        var fs = require('fs');
        var TextSearch = require('rx-text-search');




            TextSearch.find('sometext', 'stanText.txt').subscribe(
                function (result) {
               console.log("found stanText");
                },
                    function (err) {
                      console.log("error");
                })



  //  }
    cb(null);
    }

}
"use strict";

var token;
var token2;
var tenantID;


const
    sleepy = require('sleep'),
    request = require('request'),
    assert = require('assert'),
    fs = require('fs'),
    createApp = require('../../lib/createApplications.js'),
    addResource = require('../../lib/createResourcesOwnerBanner.js'),
    createSub = require('../../lib/createSubscriptionsElevate.js'),
    permissions = require('../../lib/permissions.js'),
    readBannerAccessToken = require('../../lib/genBannerAccessToken.js'),
    deleteApps = require('../../lib/deleteApplications.js'),
    createSpecialToken = require('../../lib/encodeDecodeJWT.js'),
    TextSearch = require('rx-text-search'),
    parseFlagFromBannerApplication = require('../../lib/decodeBannerAccessToken.js'),
    searchForString = require('../../lib/searchTextFile.js'),
    createSpecialBannerAccessToken = require('../../lib/encodeBannerAccessToken.js'),
    async = require('async');




// after(function(done) {
//     console.log('Finished.'),




describe('Running ConsumeAll Integration Tests', function() {



    before(function(done) {
        this.timeout(170000);
        async.series([
            function(callback) {
                console.log('creating applications');
                createApp.createApplications(callback);
            },
            function(callback) {
                console.log('adding resource');
                addResource.addResource(callback);
            },
            function(callback) {
                console.log('adding subscription');
                createSub.addSubscription(callback);
            },
            // function(callback) {
            //     console.log('turning Off DataAccess Flag');
            //     permissions.setDataAccessPermissions(true, callback);
            // },


            function(callback) {
                console.log('Generate special token');
                createSpecialToken.encodeDecodeJWT(callback);
            },

            function(callback) {
                console.log('Generate Banner Access Token');
                readBannerAccessToken.getBannerAccessToken(callback);
            },

            function(callback) {
                console.log('Parse flag from Banner Access Token');
                parseFlagFromBannerApplication.decodeBannerAccessToken(callback);
            },

            function(callback) {
                console.log('create special token from banner Access Token');
                createSpecialBannerAccessToken.encodeBannerAccessToken(callback);



            }




        ], function(err, results) {


            if (!err) {
                console.log("setup complete");
                console.log("results=" + results);
                token = results[4];
                done();
            } else
                console.log("setup complete with error" + err);

        });

    });

    after(function(done) {
        deleteApps.deleteApplications(function() {
            done();
        });
    })


    it(" Test Case ATW-51, consume All", function(done, callback) {
      //  sleepy.sleep(10);
        fs.readFile('./specialBannerAccessToken.txt', 'utf8', function(err, data) {
            token2 = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from special bannerAccessToken ' + token2);
          //  process.exit();


            fs.readFile('./specialBannerTenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token2);

                var url1 = 'https://test-integrationhub-integrate.10004.elluciancloud.com';
                var url2 = '/admin/privileges/' + tenantID;
                var url3 = url1 + url2;

                    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<token>>>>>>>>>>>>>>>>>> = ' + token2);
                //    console.log(url3);

                var postData = {
                    "allTenants": false
                }


                var url = url3;
                var headers = {
                    'Content-Type': 'application/vnd.hedtech.applications.v2+json',
                    'Authorization': 'Bearer ' + token2
                };
                request.post({
                    url: url,
                    headers: headers,
                    json: postData
                }, function(error, response, body) {
                    if (error)
                    console.log(url3);
                 //   console.log("hello");
                    //          cb(error);
                    else {
                        console.log('**************' + token2),
                       console.log(url3),
                        console.log(body);
                        done();
                        //     cb(null);
                    }
                    return;
                });

            });
        });
    });

    it(" Test Case ATW-52, set allTenants: false", function(done, callback) {
      //  sleepy.sleep(10);
        fs.readFile('./specialBannerAccessToken.txt', 'utf8', function(err, data) {
            token2 = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from special bannerAccessToken ' + token2);
          //  process.exit();


            fs.readFile('./specialBannerTenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token2);

                var url1 = 'https://test-integrationhub-integrate.10004.elluciancloud.com';
                var url2 = '/admin/privileges/' + tenantID;
                var url3 = url1 + url2;

                    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<token>>>>>>>>>>>>>>>>>> = ' + token2);
                //    console.log(url3);

                var postData = {
                    "allTenants": false
                }


                var url = url3;
                var headers = {
                    'Content-Type': 'application/vnd.hedtech.applications.v2+json',
                    'Authorization': 'Bearer ' + token2
                };
                request.post({
                    url: url,
                    headers: headers,
                    json: postData
                }, function(error, response, body) {
                    if (error)
                    console.log(url3);
                 //   console.log("hello");
                    //          cb(error);
                    else {
                        console.log('**************' + token2),
                        console.log(url3),
                        console.log(body);
                        done();
                        //     cb(null);
                    }
                    return;
                });

            });
        });
    });


    it(" Test Case ATW-52-4, set allTenants: false", function(done, callback) {
      //  sleepy.sleep(10);
        fs.readFile('./specialBannerAccessToken.txt', 'utf8', function(err, data) {
            token2 = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from special bannerAccessToken ' + token2);
          //  process.exit();


            fs.readFile('./specialBannerTenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token2);

                var url1 = 'https://test-integrationhub-integrate.10004.elluciancloud.com';
                var url2 = '/consumeAll?lastProcessedID=0';
                var url3 = url1 + url2;

                    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<token>>>>>>>>>>>>>>>>>> = ' + token2);
                //    console.log(url3);

                var postData = {
                    "allTenants": false
                }


                var url = url3;
                var headers = {
                    'Content-Type': 'application/vnd.hedtech.applications.v2+json',
                    'Authorization': 'Bearer ' + token2
                };
                request.get({
                    url: url,
                    headers: headers,
                }, function(error, response, body) {
                    if (error)
                    console.log(url3);
                 //   console.log("hello");
                    //          cb(error);
                    else {
                        console.log('**************' + token2),
                        console.log(url3),
                        console.log(body);
                        assert(response.statusCode === 200);
                        done();
                        //     cb(null);
                    }
                    return;
                });

            });
        });
    });



    // it(" Test Case ATW-53, set allTenants: true", function(done, callback) {
    //   //  sleepy.sleep(10);
    //     fs.readFile('./specialBannerAccessToken.txt', 'utf8', function(err, data) {
    //         token2 = data;
    //         if (err) {
    //             console.log('ERROR=' + err);
    //             return console.log(err);
    //         }
    //         console.log('Token Used from special bannerAccessToken ' + token2);
    //       //  process.exit();


    //         fs.readFile('./specialBannerTenantID.txt', 'utf8', function(err, data2) {
    //             tenantID = data2;
    //             if (err) {
    //                 console.log('ERROR=' + err);
    //                 return console.log(err);
    //             }
    //             console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

    //             console.log("token=" + token2);

    //             var url1 = 'https://test-integrationhub-integrate.10004.elluciancloud.com';
    //             var url2 = '/consumeAll?lastProcessedID=0';
    //             var url3 = url1 + url2;

    //                 console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<token>>>>>>>>>>>>>>>>>> = ' + token2);
    //             //    console.log(url3);

    //             var postData = {
    //                 "allTenants": true
    //             }


    //             var url = url3;
    //             var headers = {
    //                 'Content-Type': 'application/vnd.hedtech.applications.v2+json',
    //                 'Authorization': 'Bearer ' + token2
    //             };
    //             request.post({
    //                 url: url,
    //                 headers: headers,
    //             }, function(error, response, body) {
    //                 if (error)
    //                 console.log(url3);
    //              //   console.log("hello");
    //                 //          cb(error);
    //                 else {
    //                     console.log('**************' + token2),
    //                     console.log(url3),
    //                     console.log(body);
    //                     assert(response.statusCode === 200);
    //                     done();
    //                     //     cb(null);
    //                 }
    //                 return;
    //             });

    //         });
    //     });
    // });








    // it("should not return an empty array on GET ", function(done) {

    //     supertest('https://test-integrationhub-integrate.10004.elluciancloud.com')
    //         .get('/consumeAll?lastProcessedID=-1')
    //         .set('Authorization', token)
    //         .expect(401)
    //         .end(function(err, res) {l




    //             if (err) {
    //                 assert.ifError(err);
    //             } else {
    //                 // assert(res.statusCode === 401);
    //                 // console.log("res.body=" + JSON.stringify(res.body));
    //                 // assert(res.body.length === 7);
    //             }


    //             done();
    //         });

    // });



});

"use strict";
//This script tests admin api

var bannerAccessToken;
var token;
var tenantID;
var sessionStorage;
var expiredToken;



const
    assert = require('assert'),
    vo = require('vo'),
    fs = require('fs'),
    sleepy = require('sleep'),
    request = require('supertest'),
    url = 'https://test-integrationhub-integrate.10004.elluciancloud.com',
    createApp = require('../../lib/createApplications.js'),
    addResource = require('../../lib/createResourcesOwnerBanner.js'),
    createSub = require('../../lib/createSubscriptionsElevate.js'),
    permissions = require('../../lib/permissions.js'),
    genAccessToken = require('../../lib/genBannerAccessToken.js'),
  //  deleteApps = require('../../lib/deleteApplications.js'),
    async = require('async'),
    createSpecialToken = require('../../lib/encodeDecodeJWT.js'),
    createUserToken = require('../../lib/createSessionToken.js');

describe('Running  --Admin query auth  Ellucian privileged applications, Integration Tests--', function() {
    before(function(done) {
        this.timeout(70000);
        async.series([

            // function(callback) {
            //     console.log('create user token');
            //     createUserToken.createSessionToken(callback);

            // },



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
                console.log('Generate access token');
                genAccessToken.getBannerAccessToken(callback);
            },


            function(callback) {
                console.log('Generate special token');
                createSpecialToken.encodeDecodeJWT(callback);
            },



            // function(callback) {
            //     console.log('deleting applications');
            //     deleteApps.deleteApplications(callback);
            // }

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




    it('test case 4 -admin-api-should respond with status 200', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(200)
                    //   .expect({id: tenantID})
                    //         assert(request.statusCode = 200)

                //       console.log("request.body="+JSON.stringify(request.body))
                // //      assert(request.body.length === 0)




                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    console.log(request.statusCode);
                    console.log("request.body=" + JSON.stringify(request.body));
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    });



    it('test case 5 -admin-api-should respond with status 200', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(200)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })



    it('test case 7 -admin-api-should respond with status 401, invalid tenant ID', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/invalidTenantID/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(401)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })




    it('test case 8 -admin-api-should respond with status 404, missing tenant ID', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(404)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })


    it('test case 9 -admin-api-should respond with status 404, application resources missing from URL', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(404)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })


    it('test case 10 -admin-api-should respond with status 401, api missing from URL', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(404)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })



    it('test case 11 -admin-api-should respond with status 401, No special token', function(done) {


        fs.readFile('./sessionStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionStorage(this is not a special token) ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(401)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })




    it('test case 12 -admin-api-should respond with status 401, No token', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer ',
                        'Accept': 'application/json',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(401)
                    //   .expect({id: tenantID})



                .end(function(err, res) {
                    console.log(url);
                    if (err) {
                        console.log('error' + err);
                        return done(err);
                    }
                    console.log(url);
                    done();

                });




                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })



    it('test case 13 -admin-api-should respond with status 401, expired Token', function(done) {

        expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJFbGx1Y2lhbiBDbG91ZCBQbGF0Zm9ybSIsInN1YiI6Imtpbmdmb3hAZWxsdWNpYW4ubWUuc2FuZGJveCIsInRlbmFudCI6eyJpZCI6IjMwMjVjODRmLTc4ZDgtNDk4OC05ZmRkLWE1YmI2YTgyYjFlNyIsImFsaWFzIjoiZHUiLCJuYW1lIjoiRHJldyBVbml2ZXJzaXR5IiwiZW52aXJvbm1lbnRzIjpbeyJsYWJlbCI6IlByb2R1Y3Rpb24iLCJpZCI6IjhmNTlhMWEwLTk0NWYtNDU1YS04NTZmLTVmMDAxY2E0MzcxMSJ9LHsibGFiZWwiOiJUZXN0IiwiaWQiOiIzMDI1Yzg0Zi03OGQ4LTQ5ODgtOWZkZC1hNWJiNmE4MmIxZTcifV19LCJleHAiOjE0NzI3NDI1MDQsImlhdCI6MTQ3Mjc0MjUwMX0.t5U1FTkOkE62WVZ4j6NPiUODgFcuEtEgsLfmfHicC0E';

        console.log("This should print the URL " + url);
        request(url)
            .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
            .set({
                'Charset': 'utf-8',
                'Authorization': 'Bearer' + expiredToken,
                'Accept': 'application/json',
                'Content-Type': 'application/vnd.hedtech.applications.v2+json'
            })
            .send()
            .timeout(5000)
            .expect(401)
            //   .expect({id: tenantID})



        .end(function(err, res) {
            console.log(url);
            if (err) {
                console.log('error' + err);
                return done(err);
            }
            console.log(url);
            done();

        });




        // after(function(done) {
        //     this.timeout(70000);
        //     async.series([
        //         function(callback) {
        //             console.log('deleting applications');
        //             deleteApps.deleteApplications(callback);
        //             console.log("Here is the URL" + url);
        //         }
        //     ], function(err, results) {
        //         if (!err) {
        //             console.log("after setup complete");
        //             console.log("results=" + results);
        //             token = results[4];
        //             done();
        //         } else
        //             console.log("after setup complete with error" + err);

        //     });
        // });




    })




    it('test case 14 -admin-api-should respond with status 401, missing Authorization Header', function(done) {


        fs.readFile('./sessionSpecialStorage.txt', 'utf8', function(err, data) {
            token = data;
            if (err) {
                console.log('ERROR=' + err);
                return console.log(err);
            }
            console.log('Token Used from sessionSpecialStorage ' + token);


            fs.readFile('./tenantID.txt', 'utf8', function(err, data2) {
                tenantID = data2;
                if (err) {
                    console.log('ERROR=' + err);
                    return console.log(err);
                }
                console.log('the Tenant ID Used from sessionSpecialStorage ' + tenantID);

                console.log("token=" + token);

                console.log("This should print the URL " + url);
                request(url)
                    .get('/admin/' + tenantID + '/api/authoritative-application-resources/')
                    .set({
                        'Charset': 'utf-8',
                        'Authorization': 'Bearer' + token,
                        'Accept': '',
                        'Content-Type': 'application/vnd.hedtech.applications.v2+json'
                    })
                    .send()
                    .timeout(5000)
                    .expect(401)
                    //   .expect({id: tenantID})


                .end(function(err, res) {
                    if (err) {
                        assert.ifError(err);
                    } else {
                        //   assert(res.statusCode === 401);
                        console.log("res.body=" + JSON.stringify(res.body));
                        //     assert(res.body.length === 61);

                        //   console.log(res.body.length);
                    }
                    done();
                });



                // after(function(done) {
                //     this.timeout(70000);
                //     async.series([
                //         function(callback) {
                //             console.log('deleting applications');
                //             deleteApps.deleteApplications(callback);
                //             console.log("Here is the URL" + url);
                //         }
                //     ], function(err, results) {
                //         if (!err) {
                //             console.log("after setup complete");
                //             console.log("results=" + results);
                //             token = results[4];
                //             done();
                //         } else
                //             console.log("after setup complete with error" + err);

                //     });
                // });


            });
        });
    })

});
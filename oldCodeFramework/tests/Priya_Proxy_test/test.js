
"use strict"
//This script tests publisher api {test/publisher.js}

var token;
var tenantId;
const
    request = require('supertest'),
    credentials=require('../../lib/credentials.js'),
    url = 'https://test-integrationhub-integrate.10004.elluciancloud.com',
    createApp = require('../../lib/createApplications.js'),
    addResource = require('../../lib/createResourcesOwnerBanner.js'),
    createSub = require('../../lib/createSubscriptionsElevate.js'),
    genAccessToken = require('../../lib/genBannerAccessToken.js'),
    jwt=require('jsonwebtoken'),
    fs = require('fs'),
    async = require('async');

describe('Running  --Provide Proxy access for Ellucian privileged applications, Integration Tests--', function() {
    before(function(done) {
        this.timeout(70000);
        async.series([
            function(callback) {
                console.log('creating applications');
                createApp.createApplications(callback,'ppatria');
            },
            function(callback) {
                console.log('adding resource');
                addResource.addResource(callback);
            },
           function(callback){
              console.log('adding credentials');
              credentials.addCredentials(callback);
           },
           function(callback){
             console.log('getting tenantID');
             fs.readFile('./sessionStorage.txt', 'utf8', function (err, userToken) {
                if (err) {
                     console.log(err);
                     callback(err);
                }
                console.log("\nUser Token from file: " + userToken);
                var decodedjwt=jwt.verify(userToken,'test scales right up');
                if (decodedjwt)
                  tenantId=decodedjwt.tenant.id;
                callback();
             });
           },
          function(callback){
            console.log('create applications for EPA');
            createApp.createApplications(callback,'ebachle');
           },
           function(callback) {
                console.log('Generate access token');
                genAccessToken.getBannerAccessToken(callback);
            }

        ], function(err, results) {
            if (!err) {
                token=results[5];
                var decodedjwt=jwt.verify(token,'test scales right up');
                if (decodedjwt){
                  decodedjwt.tenant.name=decodedjwt.tenant.name + ' ethos';
                  token = jwt.sign(decodedjwt, 'test scales right up');
                  console.log("setup complete");
                  console.log("token="+token);
                }
                else
                {
                  console.log("token verification failed while trying to decode the token to change the tenant name to include the word ethos" + token);
                }
                done();
            } else
                console.log("setup complete with error" + err);

        });

    });


 it('EIH-1858 -Make Proxy privileged call with stored credentials on UI', function(done) {
    console.log("token="+token);
        request(url)
            .get('/proxy/'+tenantId+'/api/subjects')
            .set({
                'Charset': 'utf-8',
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json',
                'Content-Type': 'application/vnd.hedtech.applications.v2+json'
            })
            .send()
            .timeout(5000)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

  });
 //commenting this out because it is not a valid test for 1799.This is using a fake token to get the 401 response. The 401 response should come from authoritative source (due to credentials not being sent) and not from proxy.This needs to be reworked. -Priya 9/8/2016
    //it('test case 1-proxy-should respond with status 401', function(done) {
    //  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNDgxMGM2ZC01YWY4LTQzNDctOTRjNi04YTEzNGMwYTEzMzUiLCJ0ZW5hbnQiOnsiaWQiOiJlZmM3NjM4MC03YzhhLTRkNjEtOTdmNy0wNDZhMTIyY2Q1YzIiLCJhbGlhcyI6Im5pYyIsIm5hbWUiOiJFdGhvcyBOb3J0aCBJZGFobyBDb2xsZWdlIiwiZW52aXJvbm1lbnRzIjpbeyJsYWJlbCI6IlByb2R1Y3Rpb24iLCJpZCI6IjEyNzY4Y2I5LTdiMDQtNGJjZi05YzE5LWJmOTgyZjNlNzEzMyJ9LHsibGFiZWwiOiJUZXN0IiwiaWQiOiJlZmM3NjM4MC03YzhhLTRkNjEtOTdmNy0wNDZhMTIyY2Q1YzIifV0sInBlcm1pc3Npb25zIjp7ImFsbFRlbmFudHMiOmZhbHNlfX0sImV4cCI6MTQ3MTY0MjEyNiwiaWF0IjoxNDcxNjQxODI2fQ.WxbpOKwUAnxvLfOSlsQ0qVjXjFMyjgk2mQkHJXL0hBU"
    //   console.log("token="+token);
    //     var req = request(url);
    //       console.log(url)
    //        req.get(url)
    //         .set({
    //             'Charset': 'utf-8',
    //             'Authorization': 'Bearer '+token,
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/vnd.hedtech.applications.v2+json'
    //         })
    //         .send()
    //         .timeout(5000)
    //         .expect(401)
    //         .end(function(err, res) {
    //             if (err) {
    //                 return done(err);
    //             }
    //             done();
    //         });

    // });
});
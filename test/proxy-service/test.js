"use strict"
//This script tests publisher api {test/publisher.js}

var fs = require('fs');
var bannerAccessToken;
var token;


const
    request = require('supertest'),

    url = 'https://test-integrationhub-integrate.10004.elluciancloud.com/proxy/efc76380-7c8a-4d61-97f7-046a122cd5c2/api/subjects/',
    createApp = require('../../lib/createApplications.js'),
    addResource = require('../../lib/createResourcesOwnerBanner.js'),
    createSub = require('../../lib/createSubscriptionsElevate.js'),
    permissions = require('../../lib/permissions.js'),
    genAccessToken = require('../../lib/genBannerAccessToken.js'),
    createSpecialToken = require('../../lib/encodeDecodeJWT.js'),
    createUserToken = require('../../lib/createSessionToken.js'),
    deleteApps = require('../../lib/deleteApplications.js'),
    async = require('async');

describe('Running  --Provide Proxy access for Ellucian privileged applications, Integration Tests--', function() {
    before(function(done) {
        this.timeout(70000);
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
            //     permissions.setDataAccessPermissions(false, callback);
            // },

            function(callback) {
                console.log('Generate access token');
                genAccessToken.getBannerAccessToken(callback);
            },


            function(callback) {
                console.log('Generate special token');
                createSpecialToken.encodeDecodeJWT(callback);
            },



            function(callback) {
                console.log('deleting applications');
                deleteApps.deleteApplications(callback);
            }


        ], function(err, results) {
            if (!err) {
                console.log("setup complete");
                console.log("results="+results);
                token=results[4];
                done();
            } else
                console.log("setup complete with error" + err);

        });

    });

    it('test case 1-proxy-should respond with status 401', function(done) {
    	token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNDgxMGM2ZC01YWY4LTQzNDctOTRjNi04YTEzNGMwYTEzMzUiLCJ0ZW5hbnQiOnsiaWQiOiJlZmM3NjM4MC03YzhhLTRkNjEtOTdmNy0wNDZhMTIyY2Q1YzIiLCJhbGlhcyI6Im5pYyIsIm5hbWUiOiJFdGhvcyBOb3J0aCBJZGFobyBDb2xsZWdlIiwiZW52aXJvbm1lbnRzIjpbeyJsYWJlbCI6IlByb2R1Y3Rpb24iLCJpZCI6IjEyNzY4Y2I5LTdiMDQtNGJjZi05YzE5LWJmOTgyZjNlNzEzMyJ9LHsibGFiZWwiOiJUZXN0IiwiaWQiOiJlZmM3NjM4MC03YzhhLTRkNjEtOTdmNy0wNDZhMTIyY2Q1YzIifV0sInBlcm1pc3Npb25zIjp7ImFsbFRlbmFudHMiOmZhbHNlfX0sImV4cCI6MTQ3MTY0MjEyNiwiaWF0IjoxNDcxNjQxODI2fQ.WxbpOKwUAnxvLfOSlsQ0qVjXjFMyjgk2mQkHJXL0hBU"
      console.log("token="+token);
        var req = request(url);
          console.log(url)
           req.get(url)
            .set({
                'Charset': 'utf-8',
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json',
                'Content-Type': 'application/vnd.hedtech.applications.v2+json'
            })
            .send()
            .timeout(5000)
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

    });


  /*
  it('GET / operation: enum created - response with status 200', function(done) {
  		request(url)
  			.post('/')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': token,
  				'Accept': 'application/json',
  				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
  			})
  			.send(oc.oc())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});
  */
});
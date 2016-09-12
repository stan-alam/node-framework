"use strict"
//This script tests publisher api {test/publisher.js}

var fs = require('fs');
var bannerAccessToken;
var token;

const
    request = require('supertest'),
    envVars = require('../../framework/environments'),
    hp = require('./changeNotifications/happyPath.js'),
    oc = require('./changeNotifications/operationCreated.js'),
    or = require('./changeNotifications/operationReplaced.js'),
    op = require('./changeNotifications/operationPatched.js'),
    od = require('./changeNotifications/operationDeleted.js'),
    ol = require('./changeNotifications/operationLimited.js'),
    oi = require('./changeNotifications/operationInvalid.js'),
    onp = require('./changeNotifications/operationNotPresent.js'),
    ri = require('./changeNotifications/resourceInvalid.js'),
    rnp = require('./changeNotifications/resourceNotPresent.js'),
    cti = require('./changeNotifications/contentTypeInvalid.js'),
    ctn = require('./changeNotifications/contentTypeNotPresent.js'),
    url = 'https://test-integrationhub-integrate.10004.elluciancloud.com',
    createApp = require('../../lib/createApplications.js'),
    addResource = require('../../lib/createResourcesOwnerBanner.js'),
    createSub = require('../../lib/createSubscriptionsElevate.js'),
    permissions = require('../../lib/permissions.js'),
    genAccessToken = require('../../lib/genBannerAccessToken.js'),
    async = require('async');

describe('Running Publish Integration Tests', function() {
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
            function(callback) {
                console.log('turning Off allTenants Flag');
                permissions.setallTenantsPermissions(false, callback);
            },
            function(callback) {
                console.log('Generate access token');
                genAccessToken.getBannerAccessToken(callback);
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

    it('test case 1-publisher should respond with status 200', function(done) {
        request(url)
            .post('/publish')
            .set({
                'Charset': 'utf-8',
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json',
                'Content-Type': envVars.headers.publisher
            })
            .send(hp.hp())
            .timeout(5000)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });

    });

  it('POST / operation: enum created - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(oc.oc())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / operation: enum replaced - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(or.or())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / operation: enum patched - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(op.op())
  			.timeout(5000)
 			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / operation: enum deleted - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(od.od())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / operation: enum limited - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(ol.ol())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / operation: enum invalid - response with status 400', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(oi.oi())
  			.timeout(5000)
  			.expect(400)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / required operation: not present - response with status 400', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(onp.onp())
  			.timeout(5000)
  			.expect(400)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / required resource: enum invalid - response with status 403', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(ri.ri())
  			.timeout(5000)
  			.expect(403)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / required resource: not present - response with status 400', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(rnp.rnp())
  			.timeout(5000)
  			.expect(400)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / contentType: invalid - response with status 400', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(rnp.rnp())
  			.timeout(5000)
  			.expect(400)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / contentType: Not Present - response with status 200', function(done) {
  		request(url)
  			.post('/publish')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
 				'Content-Type': envVars.headers.publisher
  			})
 			.send(ctn.ctn())
  			.timeout(5000)
  			.expect(200)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  	});

  it('POST / invalid endpoint - response with status 404', function(done) {
  		request(url)
  			.post('/publisher')
  			.set({
  				'Charset':'utf-8',
  				'Authorization': 'Bearer ' + token,
  				'Accept': 'application/json',
  				'Content-Type': envVars.headers.publisher
  			})
  			.send(hp.hp())
  			.timeout(5000)
  			.expect(404)
  			.end(function(err, res){
  				if (err) return done(err);
  				done();
  			});
  });
});
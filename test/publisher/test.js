"use strict"
//This script tests publisher api {test/publisher.js}

var fs = require('fs');
var bannerAccessToken;
var token;

const
	request = require('supertest'),
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
	url = 'https://test-integrationhub-integrate.10004.elluciancloud.com';


describe('POST / Publisher Tests', function() {
		
	before(function(done){
	 fs.readFile('../bannerAccessToken.txt', 'utf8', function (err, bannerAccessToken) {
		  if (err) {
		      return console.log(err);
		  }
		  console.log("\nBanner Access Token from file: " + bannerAccessToken);
		  token = "Bearer " + bannerAccessToken;
		  done();
 	  });
	
	});
   

	describe('POST / happy path', function() {
		it('response with status 200', function(done) {
			request(url)
				.post('/publish')
				.set({
					'Charset':'utf-8', 
					'Authorization': token, 
					'Accept': 'application/json', 
					'Content-Type': 'application/vnd.hedtech.applications.v2+json'
				})
				.send(hp.hp())
				.timeout(5000)
				.expect(200)
				.end(function(err, res){
					if (err) 
						{   
							return done(err);
						}
					done();
				});

	});

});

 describe('POST / operation: enum created', function() {
	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
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

 });

 describe('POST / operation: enum replaced', function() {
 	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(or.or())
 			.timeout(5000)
 			.expect(200)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

 });

 describe('POST / operation: enum patched', function() {
 	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(op.op())
 			.timeout(5000)
			.expect(200)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

 });

 describe('POST / operation: enum deleted', function() {
 	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(od.od())
 			.timeout(5000)
 			.expect(200)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / operation: enum limited', function() {
 	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(ol.ol())
 			.timeout(5000)
 			.expect(200)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / operation: enum invalid', function() {
 	it('response with status 400', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(oi.oi())
 			.timeout(5000)
 			.expect(400)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / required operation: not present', function() {
 	it('response with status 400', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(onp.onp())
 			.timeout(5000)
 			.expect(400)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / required resource: enum invalid', function() {
 	it('response with status 403', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(ri.ri())
 			.timeout(5000)
 			.expect(403)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / required resource: not present', function() {
 	it('response with status 400', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token,  
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(rnp.rnp())
 			.timeout(5000)
 			.expect(400)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / contentType: invalid', function() {
 	it('response with status 400', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token,  
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
 			.send(rnp.rnp())
 			.timeout(5000)
 			.expect(400)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / contentType: Not Present', function() {
 	it('response with status 200', function(done) {
 		request(url)
 			.post('/publish')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
 			})
			.send(ctn.ctn())
 			.timeout(5000)
 			.expect(200)
 			.end(function(err, res){
 				if (err) return done(err);
 				done();
 			});
 	});

  });

 describe('POST / invalid endpoint', function() {
 	it('response with status 404', function(done) {
 		request(url)
 			.post('/publisher')
 			.set({
 				'Charset':'utf-8', 
 				'Authorization': token, 
 				'Accept': 'application/json', 
 				'Content-Type': 'application/vnd.hedtech.applications.v2+json'
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

});


"use strict";
 const
       supertest = require('supertest'),
       assert    = require('assert'),
       gt = require('../lib/getTokenFromFile.js');
var token; 

describe('GET / ConsumeAll Tests', function() {
		
	before(function(done){
	      token =gt.getSubscriberToken();
		  console.log("\nSubscriber Token from file: " + token);
		  token = "Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJFbGx1Y2lhbiBDbG91ZCBQbGF0Zm9ybSIsInN1YiI6ImFhbWF5ZXJAZWxsdWNpYW4ubWUuc2FuZGJveCIsInRlbmFudCI6eyJpZCI6Ijc2Yzk0ODA5LTg4ZmQtNGJhZC05NTRjLWZkYmYzZTE2MTcxMyIsImFsaWFzIjoibmljIiwibmFtZSI6Ik5vcnRoIElkYWhvIENvbGxlZ2UgZXRob3MifSwiaWF0IjoxNDY3MjIyMTg3fQ.47_x-ujMjz7elo19DOuQpZhBGXWt-P8Hz-rHE10BeEE' ;
		  done();
 	});
 
	it("should return an empty array on GET ", function(done) {

      supertest('https://test-integrationhub-integrate.10004.elluciancloud.com')
        .get('/consumeAll?lastProcessedID=-1')
        .set('Authorization',token)
        .expect(200)
        .end(function(err,res) {
          if (err) {
            assert.ifError(err);
           }
          else {
            assert(res.statusCode === 200);
            assert(res.body === []);
          }
          done();
      });
    });

});

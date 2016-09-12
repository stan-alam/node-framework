"use strict";
 const
       supertest = require('supertest'),
       assert    = require('assert');
      
var token; 

describe('GET / ConsumeAll Tests', function() {
//
//	before(function(done){
//	    console.log("\nSubscriber Token from file: " + token);
//		  token = "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MzNjNGRiMy1kZWFiLTRiMjItYjA4MC0wZWQ0YTNmNDYxZmIiLCJ0ZW5hbnQiOnsiaWQiOiJhZDdhODg5My1kMWQyLTRjNDQtODQyOS0zY2Q3OWU0Nzc4OTQiLCJhbGlhcyI6Im5pYyIsIm5hbWUiOiJOb3J0aCBJZGFobyBDb2xsZWdlIGV0aG9zIiwicGVybWlzc2lvbnMiOnsiZGF0YUFjY2VzcyI6ZmFsc2V9fSwiZXhwIjoxNDY3NDAxNTQ3MDAwMCwiaWF0IjoxNDY3NDAxMjQ3fQ.jdubLrQ4gYtzxRKF8XMBxxNEgYLt-he8_NoGLQWZ4Bs' ;
//		  done();
// 	});
//
//	it("should return an empty array on GET ", function(done) {
//
//      supertest('https://test-integrationhub-integrate.10004.elluciancloud.com')
//        .get('/consumeAll?lastProcessedID=-1')
//        .set('Authorization',token)
//        .expect(200)
//        .end(function(err,res) {
//          if (err) {
//            assert.ifError(err);
//           }
//          else {
//            assert(res.statusCode === 200);
//            console.log("res.body="+JSON.stringify(res.body));
//            assert(res.body.length === 0);
//          }
//          done();
//      });
//   });
//
//it("should not return an empty array on GET ", function(done) {
//
//      supertest('https://test-integrationhub-integrate.10004.elluciancloud.com')
//        .get('/consumeAll?lastProcessedID=-1')
//        .set('Authorization',token)
//        .expect(200)
//        .end(function(err,res) {
//          if (err) {
//            assert.ifError(err);
//           }
//          else {
//            assert(res.statusCode === 200);
//            console.log("res.body="+JSON.stringify(res.body));
//            assert(res.body.length === 7);
//          }
//          done();
//      });
//   });
});

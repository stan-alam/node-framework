'use strict';

global.assert = require('assert');

describe("Running Publisher Integration Tests", function() {

  it("Example First Test", function(done) {
        assert.equal(true, true);
        done();
  });

  it("Example Second Test", function(done) {
        assert.equal(true, false);
        done();
  });
});

var assert = require('chai').assert;
var heartbleed = require('../../modules/aggressive/heartbleed.js');

var templateResponse = {
 "state": "U",
};

var docker = require('../../lib/docker.js');

describe('heartbleed', function() {
  describe('run', function() {
    afterEach(function(done){
      this.timeout(99999);
      docker.stopAll(function(status){
        assert.isOk(status, 'Container did not close.');
        done();
      });
    });

    it('vulnerable', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-heartbleed'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = heartbleed.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 1);
          assert.property(res, 'message');
          done();
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('not vulnerable', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa2048'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = heartbleed.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 6);
          assert.notProperty(res, 'message');
          done();
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    after(function(done) {
      docker.stopAll(function(){
        done();
      });
    });
  });

  describe('failures', function() {

  });
});

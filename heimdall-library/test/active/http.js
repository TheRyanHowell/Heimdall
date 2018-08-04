var assert = require('chai').assert;

var http = require('../../modules/active/http.js');

var templateResponse = {
 "state": "U",
};

var docker = require('../../lib/docker.js');

describe('http', function() {
  describe('run', function() {
    afterEach(function(done){
      this.timeout(99999);
      docker.stopAll(function(status){
        assert.isOk(status, 'Container did not close.');
        done();
      });
    });

    it('no redirect', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-http-noredirect'], function(status){
        assert.isOk(status);
        templateResponse.url = 'http://heimdall.local';
        var promise = http.run(templateResponse);
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

    it('301 redirect', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-http-301'], function(status){
        assert.isOk(status);
        templateResponse.url = 'http://heimdall.local';
        var promise = http.run(templateResponse);
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

    it('302 redirect', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-http-302'], function(status){
        assert.isOk(status);
        templateResponse.url = 'http://heimdall.local';
        var promise = http.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          done();
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });
  });

  describe('failures', function() {
    it('invalid url', function(done) {
      templateResponse.url = 'abc';
      var promise = http.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 1);
        assert.property(res, 'message');
        done();
      });
    });

    it('invalid protocol', function(done) {
      templateResponse.url = 'wss://heimdall.local';
      var promise = http.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 1);
        assert.property(res, 'message');
        done();
      });
    });

    it('nothing', function(done) {
      this.timeout(99999);
      templateResponse.url = 'http://notathing.heimdall.local';
      var e = null;
      var promise = http.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 6);
        assert.property(res, 'message');
        done();
      }).catch(function(e){
        assert.isOk(e);
        assert.isString(e);
        done();
      });
    });
  });
});

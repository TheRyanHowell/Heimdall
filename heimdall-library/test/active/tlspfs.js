var assert = require('chai').assert;

var tlspfs = require('../../modules/active/tlspfs.js');
var openssl = require('../../lib/openssl.js');
const fs = require('fs');

var templateResponse = {
 "state": "U",
 "ca": fs.readFileSync(__dirname + '/../../test-certs/ca.crt'),
 "openssl": openssl.openssl
};

var docker = require('../../lib/docker.js');

describe('tlspfs', function() {

  describe('run', function() {
    afterEach(function(done){
      this.timeout(99999);
      docker.stopAll(function(status){
        assert.isOk(status, 'Container did not close.');
        done();
      });
    });

    it('prime256v1', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlspfs-prime256v1'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlspfs.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 6);
          assert.notProperty(res, 'message');
          done();
        });
      });
    });

    it('dh2048', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlspfs-dh2048'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlspfs.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 6);
          assert.notProperty(res, 'message');
          done();
        });
      });
    });

    it('dh1024', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlspfs-dh1024'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlspfs.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 4);
          assert.property(res, 'message');
          done();
        });
      });
    });

    it('none', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlspfs-none'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlspfs.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 5);
          assert.property(res, 'message');
          done();
        });
      });
    });
  });

  describe('failures', function() {
    it('invalid url', function(done) {
      this.timeout(99999);
      templateResponse.url = 'abc';
      var promise = tlspfs.run(templateResponse);
      promise.then(function(res) {
        assert.isNotOk(res);
        done();
      }).catch(function(e){
        assert.isOk(e);
        assert.isString(e);
        done();
      });
    });

    it('nothing', function(done) {
      this.timeout(99999);
      templateResponse.url = 'http://notathing.heimdall.local';
      var promise = tlspfs.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
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

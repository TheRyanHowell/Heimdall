var assert = require('chai').assert;

var tlsciphers = require('../../modules/active/tlsciphers.js');
var openssl = require('../../lib/openssl.js');
const fs = require('fs');

var templateResponse = {
 "state": "U",
 "ca": fs.readFileSync(__dirname + '/../../test-certs/ca.crt'),
 "openssl": openssl.openssl
};

var docker = require('../../lib/docker.js');

describe('tlsciphers', function() {
  describe('run', function() {
    afterEach(function(done){
      this.timeout(99999);
      docker.stopAll(function(status){
        assert.isOk(status, 'Container did not close.');
        done();
      });
    });

    it('modern', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlsciphers-modern'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 6);
          assert.notProperty(res, 'message');
          done();
        });
      });
    });

    it('intermediate', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlsciphers-intermediate'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 5);
          assert.property(res, 'message');
          done();
        });
      });
    });

    it('old', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlsciphers-old'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          done();
        });
      });
    });

    it('discard', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlsciphers-discard'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 1);
          assert.property(res, 'message');
          done();
        });
      });
    });

    it('selfsigned', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-selfsigned'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
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

    it('expired', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-expired'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
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

    it('untrusted', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-untrusted'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlsciphers.run(templateResponse);
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


  });

  describe('failures', function() {
    it('invalid url', function(done) {
      templateResponse.url = 'abc';
      var promise = tlsciphers.run(templateResponse);
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
      var promise = tlsciphers.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 1);
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

var assert = require('chai').assert;

var tlscert = require('../../modules/active/tlscert.js');
var openssl = require('../../lib/openssl.js');
const fs = require('fs');

var templateResponse = {
 "state": "U",
 "ca": fs.readFileSync(__dirname + '/../../test-certs/ca.crt'),
 "openssl": openssl.openssl
};


var docker = require('../../lib/docker.js');

describe('tlscert', function() {

  describe('run', function() {
    afterEach(function(done){
      this.timeout(99999);
      docker.stopAll(function(status){
        assert.isOk(status, 'Container did not close.');
        done();
      });
    });

    it('rsa4096', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa4096'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('rsa3072', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa3072'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('rsa2048', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa2048'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('rsa1024', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa1024'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 2);
          assert.property(res, 'message');
          done();
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('rsa768', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa768'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('rsa512', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-rsa512'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('prime256v1', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-prime256v1'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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

    it('selfsigned', function(done) {
      this.timeout(99999);
      docker.command(['start', 'heimdall-nginx-tlscert-selfsigned'], function(status){
        assert.isOk(status);
        templateResponse.url = 'https://heimdall.local';
        var promise = tlscert.run(templateResponse);
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
        var promise = tlscert.run(templateResponse);
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
        var promise = tlscert.run(templateResponse);
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
      var promise = tlscert.run(templateResponse);
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
      var promise = tlscert.run(templateResponse);
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

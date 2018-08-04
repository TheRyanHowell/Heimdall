var assert = require('chai').assert;
var tlsocsp = require('../../modules/active/tlsocsp.js');

var templateResponse = {
 "state": "U",
};

describe('tlsocsp', function() {
  this.timeout(99999);
  describe('run', function() {
    this.timeout(99999);

    it('none', function(done) {
      this.timeout(99999);
      templateResponse.url = 'https://ocsp-none.heimdall.local';
      templateResponse.localOCSP = true;
      var promise = tlsocsp.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('good', function(done) {
      this.timeout(99999);
      templateResponse.url = 'https://ocsp-good.heimdall.local';
      templateResponse.localOCSP = true;
      var promise = tlsocsp.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 6);
        assert.notProperty(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('bad', function(done) {
      this.timeout(99999);
      templateResponse.url = 'https://ocsp-bad.heimdall.local';
      templateResponse.localOCSP = true;
      var promise = tlsocsp.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 1);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('bad2', function(done) {
      this.timeout(99999);
      templateResponse.url = 'https://ocsp-bad2.heimdall.local';
      templateResponse.localOCSP = true;
      var promise = tlsocsp.run(templateResponse);
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

  describe('failures', function() {
    it('invalid url', function(done) {
      templateResponse.url = 'abc';
      var promise = tlsocsp.run(templateResponse);
      promise.then(function(res) {
        assert.isNotOk(res);
        done();
      }).catch(function(err){
        assert.isOk(err);
        done();
      });
    });
  });
});

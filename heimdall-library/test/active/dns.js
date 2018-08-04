var assert = require('chai').assert;
var dns = require('../../modules/active/dns.js');
var dnsServer = require('../../lib/local-dns.js');

var templateResponse = {
 "state": "U",
};

describe('dns', function() {
  this.timeout(99999);
  describe('run', function() {
    this.timeout(99999);

    it('DS', function(done) {
      this.timeout(99999);
      templateResponse.dnsServer = dnsServer;
      templateResponse.url = 'https://ds.heimdall.local';
      var promise = dns.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('CAA', function(done) {
      this.timeout(99999);
      templateResponse.dnsServer = dnsServer;
      templateResponse.url = 'https://caa.heimdall.local';
      var promise = dns.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('DS CAA', function(done) {
      this.timeout(99999);
      templateResponse.dnsServer = dnsServer;
      templateResponse.url = 'https://caads.heimdall.local';
      var promise = dns.run(templateResponse);
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

  describe('failures', function() {
    it('nothing', function(done) {
      this.timeout(99999);
      templateResponse.dnsServer = dnsServer;
      templateResponse.url = 'https://heimdall.local';
      var promise = dns.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('timeout', function(done) {
      this.timeout(99999);
      templateResponse.dnsServer = dnsServer;
      templateResponse.url = 'https://timeout.heimdall.local';
      var promise = dns.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 5);
        assert.property(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });
  });
});

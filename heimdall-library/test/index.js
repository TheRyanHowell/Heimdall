var assert = require('chai').assert;

var openssl = require('../lib/openssl.js');
var index = require('../index.js');

var templateResponse = [{
 "responseHeaders": [
  {name: "server", value: "nginx"},
  {name: "date", value: "Thu, 15 Mar 2018 19:41:54 GMT"},
  {name: "content-type", value: "text/html"},
  {name: "content-length", value: "1684"},
  {name: "last-modified", value: "Mon, 26 Feb 2018 13:09:18 GMT"},
  {name: "connection", value: "close"},
  {name: "x-sso-wat", value: "You've just been SSOed"},
  {name: "etag", value: "\"5a9406fe-694\""},
  {name: "strict-transport-security", value: "max-age=315360000; includeSubDomains; preload"},
  {name: "x-frame-options", value: "SAMEORIGIN"},
  {name: "x-content-type-options", value: "nosniff"},
  {name: "x-xss-protection", value: "1; mode=block"},
  {name: "referrer-policy", value: "no-referrer"},
  {name: "content-security-policy", value: "script-src 'self' https://box.rhowell.io:443 https://rhowell.io:443; style-src 'self' https://fonts.googleapis.com:443 https://fonts.gstatic.com:443; img-src 'self' https://secure.gravatar.com; font-src 'self' https://fonts.googleapis.com:443 https://fonts.gstatic.com:443; connect-src 'self' https://yunohost.org:443 https://rhowell.io:443 https://box.rhowell.io:443 wss://box.rhowell.io:443 wss://rhowell.io:443; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for script style;"},
  {name: "accept-ranges", value: "bytes"},
  {name: "authorization", value: "1"}
  ],
 "url": "https://rhowell.io/",
 "state": "U",
 "quick": false,
 "type": "aggressive"
},{
  "responseHeaders": {
   "server": "nginx",
   "date": "Thu, 15 Mar 2018 20:48:58 GMT",
   "content-type": "text/html; charset=UTF-8",
   "transfer-encoding": "chunked",
   "connection": "close",
   "x-powered-by": "PHP/7.1.14",
   "expires": "Thu, 19 Nov 1981 08:52:00 GMT",
   "cache-control": "no-store, no-cache, must-revalidate",
   "pragma": "no-cache",
   "location": "/nix-notes/adding-an-existing-project-to-git",
   "strict-transport-security": "max-age=63072000; includeSubdomains;",
   "authorization": "1"
  },
  "url": "https://athomas.uk/",
  "state": "U",
  "quick": false,
  "type": "aggressive"
 }];

describe('index', function() {
  describe('run', function() {
    it('rhowell.io allowagressive full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      response.responseHeaders.push({name: 'x-heimdall-allow', value: ''});
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'A+');
          assert.lengthOf(msg.moduleResults, 18);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('rhowell.io allowagressive quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = true;
      response.responseHeaders.push({name: 'x-heimdall-allow', value: ''});
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'A+');
          assert.lengthOf(msg.moduleResults, 18);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('rhowell.io full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'A+');
          assert.lengthOf(msg.moduleResults, 16);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('rhowell.io quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = true;
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'A+');
          assert.lengthOf(msg.moduleResults, 16);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('athomas.uk allowagressive full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[1]));
      response.state = 'U';
      response.quick = false;
      response.responseHeaders['x-heimdall-allow'] = '';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'C');
          assert.lengthOf(msg.moduleResults, 18);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('athomas.uk allowagressive quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[1]));
      response.state = 'U';
      response.quick = true;
      response.responseHeaders['x-heimdall-allow'] = '';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'C');
          assert.lengthOf(msg.moduleResults, 8);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('athomas.uk full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[1]));
      response.state = 'U';
      response.quick = false;
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'C');
          assert.lengthOf(msg.moduleResults, 16);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('athomas.uk quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[1]));
      response.state = 'U';
      response.quick = true;
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'C');
          assert.lengthOf(msg.moduleResults, 6);
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });
  });

  describe('failures', function(done) {
    it('no url', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      delete response.url;
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'U');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('invalid url', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      response.url = 'abc';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'U');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('nothing allowagressive full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      response.url = 'https://notathing.heimdall.local';
      response.responseHeaders['x-heimdall-allow'] = '';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'F');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('nothing allowagressive quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = true;
      response.url = 'https://notathing.heimdall.local';
      response.responseHeaders['x-heimdall-allow'] = '';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'F');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('nothing full', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = false;
      response.url = 'https://notathing.heimdall.local';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'F');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });

    it('nothing quick', function(done) {
      this.timeout(99999);
      var response = JSON.parse(JSON.stringify(templateResponse[0]));
      response.state = 'U';
      response.quick = true;
      response.url = 'https://notathing.heimdall.local';
      try {
        index.runModules(response, function(msg, response) {
          assert.isOk(msg);
          assert.equal(msg.state, 'F');
          done();
        }, openssl.openssl);
      } catch(err) {
        done(err);
      }
    });
  });
});

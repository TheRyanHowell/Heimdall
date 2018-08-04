var assert = require('chai').assert;

var csp = require('../../modules/passive/csp.js');

var templateResponse = {
 "responseHeaders": {
   "content-security-policy": ""
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('csp', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(csp, 'run');
    });

    it('should return promise', async () => {
      var promise = csp.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = csp.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(csp, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(csp.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(csp.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(csp.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(csp, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(csp.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(csp.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(csp.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(csp, 'name');
    });

    it('should be a string', async () => {
      assert.isString(csp.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(csp, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(csp.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['content-security-policy'];
      var promise = csp.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exists', async () => {
      templateResponse.responseHeaders['content-security-policy'] = '';
      var promise = csp.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('perfect', async () => {
      templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for script style;";
      var promise = csp.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    describe('default-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "default-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe default-src', res['message']);
      });

      it('unsafe', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "default-src unsafe;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe default-src', res['message']);
      });

      it('data', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "default-src data:;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe default-src', res['message']);
      });
    });

    describe('script-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe script-src', res['message']);
      });

      it('unsafe', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src unsafe;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe script-src', res['message']);
      });

      it('data', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src data:;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe script-src', res['message']);
      });
    });

    describe('style-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "style-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe style-src', res['message']);
      });

      it('data', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "style-src data:;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe style-src', res['message']);
      });
    });

    describe('font-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "font-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe font-src', res['message']);
      });
    });

    describe('connect-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "connect-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe connect-src', res['message']);
      });
    });

    describe('media-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "media-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe media-src', res['message']);
      });
    });

    describe('object-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "object-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe object-src', res['message']);
      });
    });

    describe('child-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "child-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe child-src', res['message']);
      });
    });

    describe('frame-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "frame-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe frame-src', res['message']);
      });
    });

    describe('worker-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "worker-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe worker-src', res['message']);
      });
    });

    describe('frame-ancestors', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "frame-ancestors *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe frame-ancestors', res['message']);
      });
    });

    describe('form-action', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "form-action *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe form-action', res['message']);
      });
    });

    describe('manifest-src', async () => {
      it('*', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "manifest-src *;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('Unsafe manifest-src', res['message']);
      });
    });

    describe('upgrade-insecure-requests', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No upgrade-insecure-requests', res['message']);
      });
    });

    describe('block-all-mixed-content', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No block-all-mixed-content', res['message']);
      });
    });

    describe('disown-opener', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; reflected-xss block; referrer no-referrer; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No disown-opener', res['message']);
      });
    });

    describe('require-sri-for', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No require-sri-for for script and style', res['message']);
      });

      it('missing script', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No require-sri-for for script and style', res['message']);
      });

      it('missing style', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer no-referrer; require-sri-for script;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No require-sri-for for script and style', res['message']);
      });
    });

    describe('reflected-xss', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; referrer no-referrer; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No reflected-xss or contains allow', res['message']);
      });

      it('allow', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss allow; referrer no-referrer; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No reflected-xss or contains allow', res['message']);
      });
    });

    describe('referrer', async () => {
      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No referrer or contains unsafe-url', res['message']);
      });

      it('missing', async () => {
        templateResponse.responseHeaders['content-security-policy'] = "script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none' ; frame-src 'none' ; upgrade-insecure-requests; block-all-mixed-content; disown-opener; reflected-xss block; referrer unsafe-url; require-sri-for script style;";
        var promise = csp.run(templateResponse);
        var res = await promise;
        assert.equal(res['code'], 4);
        assert.property(res, 'message');
        assert.isString(res['message']);
        assert.equal('No referrer or contains unsafe-url', res['message']);
      });
    });
  });

  describe('failures', async () => {

  });
});

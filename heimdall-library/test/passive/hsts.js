var assert = require('chai').assert;

var hsts = require('../../modules/passive/hsts.js');

var templateResponse = {
 "responseHeaders": {
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('hsts', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(hsts, 'run');
    });

    it('should return promise', async () => {
      var promise = hsts.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = hsts.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = hsts.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(hsts, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(hsts.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(hsts.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(hsts.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(hsts, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(hsts.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(hsts.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(hsts.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(hsts, 'name');
    });

    it('should be a string', async () => {
      assert.isString(hsts.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(hsts, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(hsts.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['strict-transport-security'];
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 3);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('no preload', async () => {
      templateResponse.responseHeaders['strict-transport-security'] = 'max-age=315360000';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('low max-age', async () => {
      templateResponse.responseHeaders['strict-transport-security'] = 'max-age=7775999; preload';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exact max-age with preload', async () => {
      templateResponse.responseHeaders['strict-transport-security'] = 'max-age=7776000; preload';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('exact max-age without preload', async () => {
      templateResponse.responseHeaders['strict-transport-security'] = 'max-age=7776000';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('perfect', async () => {
      templateResponse.responseHeaders['strict-transport-security'] = 'max-age=315360000; preload';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('bypass', async () => {
      delete templateResponse.responseHeaders['strict-transport-security'];
      templateResponse.responseHeaders['x-heimdall-hsts'] = '1';
      var promise = hsts.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });
  });

  describe('failures', async () => {

  });
});

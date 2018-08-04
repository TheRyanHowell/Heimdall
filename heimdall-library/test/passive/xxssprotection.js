var assert = require('chai').assert;

var xxssprotection = require('../../modules/passive/xxssprotection.js');

var templateResponse = {
 "responseHeaders": {
   "x-xss-protection": "0"
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('xxssprotection', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(xxssprotection, 'run');
    });

    it('should return promise', async () => {
      var promise = xxssprotection.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = xxssprotection.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = xxssprotection.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(xxssprotection, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(xxssprotection.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(xxssprotection.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xxssprotection.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(xxssprotection, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(xxssprotection.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(xxssprotection.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xxssprotection.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(xxssprotection, 'name');
    });

    it('should be a string', async () => {
      assert.isString(xxssprotection.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(xxssprotection, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(xxssprotection.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['x-xss-protection'];
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exists', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('off', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '0';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('off mode', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '0; mode';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('off mode=invalid', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '0; mode=invalid';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('off mode=block', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '0; mode=block';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 4);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('on', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '1';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('on mode', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '1; mode';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('on mode=invalid', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '1; mode=invalid';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('on mode=block', async () => {
      templateResponse.responseHeaders['x-xss-protection'] = '1; mode=block';
      var promise = xxssprotection.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });
  });

  describe('failures', async () => {

  });
});

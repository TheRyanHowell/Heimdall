var assert = require('chai').assert;

var referrerpolicy = require('../../modules/passive/referrerpolicy.js');

var templateResponse = {
 "responseHeaders": {
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('referrerpolicy', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(referrerpolicy, 'run');
    });

    it('should return promise', async () => {
      var promise = referrerpolicy.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = referrerpolicy.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = referrerpolicy.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(referrerpolicy, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(referrerpolicy.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(referrerpolicy.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(referrerpolicy.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(referrerpolicy, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(referrerpolicy.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(referrerpolicy.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(referrerpolicy.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(referrerpolicy, 'name');
    });

    it('should be a string', async () => {
      assert.isString(referrerpolicy.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(referrerpolicy, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(referrerpolicy.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['referrer-policy'];
      var promise = referrerpolicy.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exists', async () => {
      templateResponse.responseHeaders['referrer-policy'] = '';
      var promise = referrerpolicy.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('no-referrer', async () => {
      templateResponse.responseHeaders['referrer-policy'] = 'no-referrer';
      var promise = referrerpolicy.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('unsafe-url', async () => {
      templateResponse.responseHeaders['referrer-policy'] = 'unsafe-url';
      var promise = referrerpolicy.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 2);
      assert.isString(res['message']);
    });

    it('origin', async () => {
      templateResponse.responseHeaders['referrer-policy'] = 'origin';
      var promise = referrerpolicy.run(templateResponse);
      var res = await promise;
      assert.property(res, 'message');
      assert.isString(res['message']);
    });
  });

  describe('failures', async () => {

  });
});

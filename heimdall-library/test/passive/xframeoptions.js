var assert = require('chai').assert;

var xframeoptions = require('../../modules/passive/xframeoptions.js');

var templateResponse = {
 "responseHeaders": {
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('xframeoptions', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(xframeoptions, 'run');
    });

    it('should return promise', async () => {
      var promise = xframeoptions.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = xframeoptions.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = xframeoptions.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(xframeoptions, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(xframeoptions.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(xframeoptions.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xframeoptions.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(xframeoptions, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(xframeoptions.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(xframeoptions.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xframeoptions.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(xframeoptions, 'name');
    });

    it('should be a string', async () => {
      assert.isString(xframeoptions.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(xframeoptions, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(xframeoptions.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['x-frame-options'];
      var promise = xframeoptions.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exists', async () => {
      templateResponse.responseHeaders['x-frame-options'] = '';
      var promise = xframeoptions.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });
  });

  describe('failures', async () => {

  });
});

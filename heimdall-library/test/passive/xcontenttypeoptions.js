var assert = require('chai').assert;

var xcontenttypeoptions = require('../../modules/passive/xcontenttypeoptions.js');

var templateResponse = {
 "responseHeaders": {
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('xcontenttypeoptions', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(xcontenttypeoptions, 'run');
    });

    it('should return promise', async () => {
      var promise = xcontenttypeoptions.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = xcontenttypeoptions.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = xcontenttypeoptions.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(xcontenttypeoptions, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(xcontenttypeoptions.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(xcontenttypeoptions.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xcontenttypeoptions.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(xcontenttypeoptions, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(xcontenttypeoptions.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(xcontenttypeoptions.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xcontenttypeoptions.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(xcontenttypeoptions, 'name');
    });

    it('should be a string', async () => {
      assert.isString(xcontenttypeoptions.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(xcontenttypeoptions, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(xcontenttypeoptions.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['x-content-type-options'];
      var promise = xcontenttypeoptions.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('exists', async () => {
      templateResponse.responseHeaders['x-content-type-options'] = '';
      var promise = xcontenttypeoptions.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });

    it('nosniff', async () => {
      templateResponse.responseHeaders['x-content-type-options'] = 'nosniff';
      var promise = xcontenttypeoptions.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });
  });

  describe('failures', async () => {

  });
});

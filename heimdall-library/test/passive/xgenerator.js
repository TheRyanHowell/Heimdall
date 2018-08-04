var assert = require('chai').assert;

var xgenerator = require('../../modules/passive/xgenerator.js');

var templateResponse = {
 "responseHeaders": {
   "x-generator": "Heimdall 1.0"
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('xgenerator', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(xgenerator, 'run');
    });

    it('should return promise', async () => {
      var promise = xgenerator.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = xgenerator.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = xgenerator.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(xgenerator, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(xgenerator.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(xgenerator.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xgenerator.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(xgenerator, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(xgenerator.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(xgenerator.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(xgenerator.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(xgenerator, 'name');
    });

    it('should be a string', async () => {
      assert.isString(xgenerator.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(xgenerator, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(xgenerator.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['x-generator'];
      var promise = xgenerator.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('exists', async () => {
      templateResponse.responseHeaders['x-generator'] = 'Heimdall';
      var promise = xgenerator.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('contains number', async () => {
      templateResponse.responseHeaders['x-generator'] = 'Heimdall 1.0';
      var promise = xgenerator.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });
  });

  describe('failures', async () => {

  });
});

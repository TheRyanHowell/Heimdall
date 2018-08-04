var assert = require('chai').assert;

var https = require('../../modules/passive/https.js');

var templateResponse = {
 "url": "http://rhowell.io/",
 "state": "U",
};

describe('https', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(https, 'run');
    });

    it('should return promise', async () => {
      var promise = https.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = https.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = https.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(https, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(https.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(https.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(https.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(https, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(https.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(https.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(https.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(https, 'name');
    });

    it('should be a string', async () => {
      assert.isString(https.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(https, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(https.depends);
    });
  });

  describe('states', async () => {
    it('http', async () => {
      templateResponse.url = 'http://rhowell.io';
      var promise = https.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 1);
      assert.property(res, 'message');
    });

    it('https', async () => {
      templateResponse.url = 'https://rhowell.io';
      var promise = https.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });
  });

  describe('failures', async () => {
    it('invalid url', async () => {
      templateResponse.url = 'abc';
      var promise = https.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 1);
      assert.property(res, 'message');
    });

    it('invalid protocol', async () => {
      templateResponse.url = 'wss://rhowell.io';
      var promise = https.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 1);
      assert.property(res, 'message');
    });
  });
});

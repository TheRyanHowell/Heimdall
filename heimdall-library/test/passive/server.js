var assert = require('chai').assert;

var server = require('../../modules/passive/server.js');

var templateResponse = {
 "responseHeaders": {
   "server": "Heimdall 1.0"
 },
 "url": "https://rhowell.io/",
 "state": "U",
};

describe('server', async () => {
  describe('run', async () => {
    it('should exist', async () => {
      assert.property(server, 'run');
    });

    it('should return promise', async () => {
      var promise = server.run(templateResponse);
      assert.instanceOf(promise, Promise);
    });

    describe('promise', async () => {
      it('should return truthy value', async () => {
        var promise = server.run(templateResponse);
        var res = await promise;
        assert.isOk(res);
      });

      describe('code', async () => {
        it('should exist', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.property(res, 'code');
        });

        it('should be a number', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.isNumber(res['code']);
        });

        it('should be at least 0', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.isAtLeast(res['code'], 0);
        });

        it('should be at most 6', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.isAtMost(res['code'], 6);
        });
      });

      describe('name', async () => {
        it('should exist', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.property(res, 'name');
        });

        it('should be string', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.isString(res['name']);
        });
      });

      describe('message', async () => {
        it('should exist', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.property(res, 'message');
        });

        it('should be string', async () => {
          var promise = server.run(templateResponse);
          var res = await promise;
          assert.isString(res['message']);
        });
      });
    });
  });

  describe('lowestState', async () => {
    it('should exist', async () => {
      assert.property(server, 'lowestState');
    });

    it('should be a number', async () => {
      assert.isNumber(server.lowestState);
    });

    it('hould be at least 0', async () => {
      assert.isAtLeast(server.lowestState, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(server.lowestState, 6);
    });
  });

  describe('type', async () => {
    it('should exist', async () => {
      assert.property(server, 'type');
    });

    it('should be a number', async () => {
      assert.isNumber(server.type);
    });

    it('should be at least 0', async () => {
      assert.isAtLeast(server.type, 0);
    });

    it('should be at most 6', async () => {
      assert.isAtMost(server.type, 6);
    });
  });

  describe('name', async () => {
    it('should exist', async () => {
      assert.property(server, 'name');
    });

    it('should be a string', async () => {
      assert.isString(server.name);
    });
  });

  describe('depends', async () => {
    it('should exist', async () => {
      assert.property(server, 'depends');
    });

    it('should be an array', async () => {
      assert.isArray(server.depends);
    });
  });

  describe('states', async () => {
    it('no header', async () => {
      delete templateResponse.responseHeaders['server'];
      var promise = server.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('exists', async () => {
      templateResponse.responseHeaders['server'] = 'Heimdall';
      var promise = server.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 6);
      assert.notProperty(res, 'message');
    });

    it('contains number', async () => {
      templateResponse.responseHeaders['server'] = 'Heimdall 1.0';
      var promise = server.run(templateResponse);
      var res = await promise;
      assert.equal(res['code'], 5);
      assert.property(res, 'message');
      assert.isString(res['message']);
    });
  });

  describe('failures', async () => {

  });
});

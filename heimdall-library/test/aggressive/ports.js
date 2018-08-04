var assert = require('chai').assert;
var ports = require('../../modules/aggressive/ports.js');
var net = require('net');

var templateResponse = {
 "state": "U",
};


var servers = [];
function bindPort(portNum, callback) {
  servers[portNum] = net.createServer((socket) => {
  }).on('error', (err) => {
    callback(null);
  });

  if(servers[portNum]) {
    servers[portNum].close(function(){
      servers[portNum].listen(portNum, '127.0.0.1', function() {
        callback(servers[portNum]);
      });
    });
  } else {
    servers[portNum].listen(portNum, '127.0.0.1', function() {
      callback(servers[portNum]);
    });
  }
}

describe('ports', function() {
  describe('run', function() {
    it('none', function(done) {
      this.timeout(99999);
      templateResponse.url = 'https://heimdall.local';
      var promise = ports.run(templateResponse);
      promise.then(function(res) {
        assert.equal(res['code'], 6);
        assert.notProperty(res, 'message');
        done();
      }).catch(function(err){
        assert.isNotOk(err);
        done();
      });
    });

    it('3306', function(done) {
      this.timeout(99999);
      bindPort(3306, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('5432', function(done) {
      this.timeout(99999);
      bindPort(5432, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('1433', function(done) {
      this.timeout(99999);
      bindPort(1433, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('1434', function(done) {
      this.timeout(99999);
      bindPort(1434, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('3050', function(done) {
      this.timeout(99999);
      bindPort(3050, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('2375', function(done) {
      this.timeout(99999);
      bindPort(2375, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('2376', function(done) {
      this.timeout(99999);
      bindPort(2376, function(server){
        templateResponse.url = 'https://heimdall.local';
        var promise = ports.run(templateResponse);
        promise.then(function(res) {
          assert.equal(res['code'], 3);
          assert.property(res, 'message');
          if(server) {
            server.close(function(){
              done();
            });
          } else {
            done();
          }
        }).catch(function(err){
          assert.isNotOk(err);
          done();
        });
      });
    });

    it('3306 5432', function(done) {
      this.timeout(99999);
      bindPort(3306, function(server1){
        bindPort(5432, function(server2){
          templateResponse.url = 'https://heimdall.local';
          var promise = ports.run(templateResponse);
          promise.then(function(res) {
            assert.equal(res['code'], 3);
            assert.property(res, 'message');
            if(server1) {
              server1.close(function(){
                if(server2) {
                  server2.close(function(){
                    done();
                  });
                } else {
                  done();
                }
              });
            } else {
              if(server2) {
                server2.close(function(){
                  done();
                });
              } else {
                done();
              }
            }
          }).catch(function(err){
            assert.isNotOk(err);
            done();
          });
        });
      });
    });
  });

  describe('failures', function() {

  });
});

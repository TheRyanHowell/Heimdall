#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

const EventEmitter = require('events');
const NetSocket = require('net').Socket;
const packet = require('dns-packet');

// Create dns event emitter for test suite
class DnsEventEmitter extends EventEmitter {
    constructor() {
      super();
      this.timeoutFunc = null;
    }

    connect(dnsPort, dnsServer, callback) {
      callback();
    };

    write(request) {
      var dData = packet.streamDecode(request);

      let _this = this;
      var res = {};

      // Give correct response based on test case
      if(dData.questions[0].type === 'CAA' && (dData.questions[0].name === 'caa.heimdall.local' || dData.questions[0].name === 'caads.heimdall.local')) {
        res = {
          answers: [{
            type: 'CAA',
            data: 'abc'
          }]
        };
      } else if(dData.questions[0].type === 'DS' && (dData.questions[0].name === 'ds.heimdall.local' || dData.questions[0].name === 'caads.heimdall.local')) {
        res = {
          answers: [{
            type: 'DS',
            data: 'abc'
          }]
        };

      } else if(dData.questions[0].name === 'timeout.heimdall.local') {
        return;
      }

      _this.emit('data', res);
    }

    setTimeout(timeout) {
      let _this = this;

      if(this.timeoutFunc) {
        clearTimeout(this.timeoutFunc);
      }

      this.timeoutFunc = setTimeout(function(){
        _this.emit('timeout');
        _this.emit('end');
      }, timeout);
    }

    destroy() {
      if(this.timeoutFunc) {
        clearTimeout(this.timeoutFunc);
      }
    }

    end() {
      this.emit('end');
    }
}

// Define how we handle dns if in test mode
exports.Socket = function(local){
  if(local) {
    return new DnsEventEmitter();
  } else {
    return new NetSocket();
  }
};

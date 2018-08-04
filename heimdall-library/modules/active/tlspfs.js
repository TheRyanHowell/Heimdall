'use strict';

var exports = module.exports = {};
const tls = require('tls');
const url = require('url');

/*
var states = {
  0: 'U',
  1: 'F',
  2: 'D',
  3: 'C',
  4: 'B',
  5: 'A',
  6: 'A+'
};
*/

/*
var types = {
  0: 'passive',
  1: 'active',
  2: 'aggressive'
};
*/

// Define module information
exports.lowestState = 4;
exports.name = 'TLS Perfect Forward Secrecy';
exports.type = 1;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Forward_secrecy';
exports.description = 'Tests whether server supports perfect forward secrecy.';

// Diffie hellman keys
/*
  { type: 'DH', size: 1024 }
  { type: 'ECDH', name: 'prime256v1', size: 256 }
*/

// Define global diffie hellman keys
var gDHparams = null;

// Test if the server supports perfect forward secrecy
function testPFS(url, ca, callback) {
  // Open the tls socket
  const tlsSocket = tls.connect({
    host: url,
    servername: url,
    port: 443,
    handshakeTimeout: 5,
    dhparam: gDHparams,
    ca: ca
  });

  tlsSocket.setTimeout(5000);
  tlsSocket.on('timeout', () => {
    tlsSocket.destroy();
    callback(false, new Error('Timeout'));
  });

  tlsSocket.on('secureConnect', function() {
    // Get the ephemeral key, check if valid connection
    if(tlsSocket.authorized) {
      var keyInfo = tlsSocket.getEphemeralKeyInfo();
      tlsSocket.destroy();
      callback(true, keyInfo);
    } else {
      callback(false, tlsSocket.authorizationError);
    }

  });

  tlsSocket.on('error', function(err) {
    tlsSocket.destroy();
    callback(false, err);
  });
}

function runModule(object, resolve, reject) {
  const oURL = url.parse(object.url);
  var result = {code: 5, message: 'Missing', name: exports.name};
  // Handle info mode
  if(object.info) {
      result.link = exports.link;
      result.description = exports.description;
  }

  // Parse URL
  if(!oURL.hostname) {
    reject('Invalid URL');
    return;
  }

  // Test the hostname for perfect forward secrecy
  testPFS(oURL.hostname, object.ca, function(tlsResult, keyInfo) {
    if(tlsResult) {
      if(keyInfo) {
        // based on key type, and size, give module score
        if(keyInfo.type === 'DH') {
          if(keyInfo.size >= 2048) {
            result.code = 6;
            delete result.message;
          } else {
            result.code = 4;
            result.message = 'Small DH key size (' + keyInfo.size + ')';
          }
        } else if(keyInfo.type === 'ECDH') {
          if(keyInfo.size >= 256) {
            result.code = 6;
            delete result.message;
          } else {
            result.code = 4;
            result.message = 'Small ECDH key size (' + keyInfo.size + ')';
          }
        }
      }
    }
    resolve(result);
  });
}

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    if(object.hasOwnProperty('openssl')) {
      // Generate a diffie hellman key using openssl
      object.openssl(['dhparam', '-dsaparam', '2048'], function(result, dhKey){
        if(result) {
          gDHparams = dhKey;
          // Run the module
          runModule(object, resolve, reject);
        } else {
          reject('Could not generate dh key.');
        }
      });
    } else {
      reject('Could not generate dh key, no generator given.');
    }
  });
}

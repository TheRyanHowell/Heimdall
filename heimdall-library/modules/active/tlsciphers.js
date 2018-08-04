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

// Define desired ciphers based on mozilla reccomendations
var ciphers = {
  discard: 'aNULL:eNULL:EXPORT:RC4:DES:SSLv2:MD5',
  oldBroken: 'PSK:RSAPSK:aDH:aECDH:EDH-DSS-DES-CBC3-SHA:KRB5-DES-CBC3-SHA:SRP',
  old: 'DHE-DSS-AES128-GCM-SHA256:DHE-DSS-AES256-GCM-SHA384:DHE-DSS-AES128-SHA256:DHE-DSS-AES256-SHA:ECDHE-ECDSA-AES256-CCM8:ECDHE-ECDSA-AES256-CCM:DHE-RSA-AES256-CCM8:DHE-RSA-AES256-CCM:ECDHE-ECDSA-AES128-CCM8:ECDHE-ECDSA-AES128-CCM:DHE-RSA-AES128-CCM8:DHE-RSA-AES128-CCM:DHE-DSS-AES256-SHA256:DHE-DSS-AES128-SHA:AES256-CCM8:AES256-CCM:AES128-CCM8:AES128-CCM:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-CAMELLIA256-SHA384:ECDHE-RSA-CAMELLIA256-SHA384:DHE-RSA-CAMELLIA256-SHA256:DHE-DSS-CAMELLIA256-SHA256:ECDHE-ECDSA-CAMELLIA128-SHA256:ECDHE-RSA-CAMELLIA128-SHA256:DHE-RSA-CAMELLIA128-SHA256:DHE-DSS-CAMELLIA128-SHA256:DHE-RSA-CAMELLIA256-SHA:DHE-DSS-CAMELLIA256-SHA:DHE-RSA-CAMELLIA128-SHA:DHE-DSS-CAMELLIA128-SHA:CAMELLIA256-SHA256:CAMELLIA128-SHA256:CAMELLIA256-SHA:CAMELLIA128-SHA:DHE-RSA-SEED-SHA:DHE-DSS-SEED-SHA:SEED-SHA',
  intermediateBroken: 'DSS',
  intermediate: 'DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:ECDHE-ECDSA-DES-CBC3-SHA:ECDHE-RSA-DES-CBC3-SHA:DHE-RSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA',
  modern: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256'
};

// Define module info
exports.lowestState = 1;
exports.name = 'TLS Ciphers';
exports.type = 1;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Cipher';
exports.description = 'Tests the TLS configuration of the server to determine supported ciphers.';

// Define global diffie hellman parameters
var gDHparams = null;

// Test what ciphers the server supports
function testCiphers(url, ciphers, ca, callback) {
  // Create the tls socket
  const tlsSocket = tls.connect({
    host: url,
    servername: url,
    port: 443,
    ciphers: ciphers,
    handshakeTimeout: 5,
    dhparam: gDHparams,
    ca: ca
  });

  tlsSocket.setTimeout(1000);
  tlsSocket.on('timeout', () => {
    tlsSocket.destroy();
    callback(false, new Error('Timeout'));
  });

  tlsSocket.on('secureConnect', function() {
    // Got a connection, check if valid
    if(tlsSocket.authorized) {
      // Get the cipher that was ued
      var cipher = tlsSocket.getCipher();
      tlsSocket.destroy();
      callback(true, cipher.name);
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
  var result = {code: 1, message: 'Missing', name: exports.name};
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

  // Test each cipher category to determine lowest supported category, which determines module score
  testCiphers(oURL.hostname, ciphers.discard, object.ca, function(tlsResult, cipher) {
    if(tlsResult) {
      result.code = 1;
      result.message = 'Discard cipher supported; used: ' + cipher;
      resolve(result);
    } else {
      testCiphers(oURL.hostname, ciphers.oldBroken, object.ca, function(tlsResult, cipher) {
        if(tlsResult) {
          result.code = 2;
          result.message = 'Old broken cipher supported; used: ' + cipher;
          resolve(result);
        } else {
          testCiphers(oURL.hostname, ciphers.old, object.ca, function(tlsResult, cipher) {
            if(tlsResult) {
              result.code = 3;
              result.message = 'Old cipher supported; used: ' + cipher;
              resolve(result);
            } else {
              testCiphers(oURL.hostname, ciphers.intermediateBroken, object.ca, function(tlsResult, cipher) {
                if(tlsResult) {
                  result.code = 4;
                  result.message = 'Intermediate broken cipher supported; used: ' + cipher;
                  resolve(result);
                } else {
                  testCiphers(oURL.hostname, ciphers.intermediate, object.ca, function(tlsResult, cipher) {
                    if(tlsResult) {
                      result.code = 5;
                      result.message = 'Intermediate cipher supported; used: ' + cipher;
                      resolve(result);
                    } else {
                      testCiphers(oURL.hostname, ciphers.modern, object.ca, function(tlsResult, cipher) {
                        if(tlsResult) {
                          result.code = 6;
                          delete result.message;
                          resolve(result);
                        } else {
                          switch(cipher.code) {
                            case 'DEPTH_ZERO_SELF_SIGNED_CERT':
                            result.message = 'Self-signed certificate';
                            break;
                            case 'CERT_HAS_EXPIRED':
                            result.message = 'Certificate has expired';
                            break;
                            case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
                            result.message = 'Certificate signed using an untrusted root';
                            break;
                            default:
                          }
                          resolve(result);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
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

#!/usr/bin/env node
'use strict';
var exports = module.exports = {};
const tls = require('tls');
const ocsp = require('ocsp');

// Create OCSP handler for test suite
// Define responses based on test case
// tlsResult, hasOCSP, isValid, ocspErr
function localTestOCSP(url, callback) {
  switch(url) {
    case 'ocsp-good.heimdall.local':
      callback(true, true, true);
    break;

    case 'ocsp-bad.heimdall.local':
      callback(true, true, false, 'Err');
    break;

    case 'ocsp-bad2.heimdall.local':
      callback(true, true, false, false);
    break;

    default:
      callback(false, false, false);
    break;
  }
}

// Define real OCSP for runtime
function remoteTestOCSP(url, callback) {
  var hasOCSP = false;

  // Open a tls socket, requesting OCSP
  const tlsSocket = tls.connect({
    host: url,
    servername: url,
    port: 443,
    handshakeTimeout: 5,
    requestOCSP: true
  });

  tlsSocket.setTimeout(5000);
  tlsSocket.on('timeout', () => {
    tlsSocket.destroy();
    callback(false, new Error('Timeout'));
  });

  tlsSocket.on('OCSPResponse', function(response) {
    // Record if we got a OCSP response
    if(response) {
      hasOCSP = true;
    }
  });

  tlsSocket.on('secureConnect', function() {
    // If valid connection
    if(tlsSocket.authorized) {
      // And has OCSP
      if(hasOCSP) {
        // Check for valid OCSP
        var certs = tlsSocket.getPeerCertificate(true);
        tlsSocket.destroy();
        ocsp.check({
          cert: certs.raw,
          issuer: certs.issuerCertificate.raw
        }, function(err, res) {
          // Handle invalid OCSP
          if (err) {
            callback(true, hasOCSP, false, err.message);
          } else if(res && res.type && res.type === 'good') {
            callback(true, hasOCSP, true);
          } else {
            callback(true, hasOCSP, false);
          }
        });
      } else {
        // No OCSP
        callback(true, hasOCSP, false);
      }
    } else {
      // Not valid TLS
      callback(false, tlsSocket.authorizationError, false);
    }

  });

  tlsSocket.on('error', function(err) {
    tlsSocket.destroy();
    callback(false, err, false);
  });
}

// Define how we handle OCSP runtime vs test mode
exports.test = function(url, local, callback) {
  if(local) {
    localTestOCSP(url, callback);
  } else {
    remoteTestOCSP(url, callback);
  }
};

'use strict';

var exports = module.exports = {};
const url = require('url');

const ocsp = require('../../lib/local-ocsp.js');

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
exports.lowestState = 1;
exports.name = 'TLS Online Certificate Status Protocol';
exports.type = 1;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol';
exports.description = 'Tests whether OCSP is used/valid.';


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

  // Test wether server supports OCSP and returns a valid response
  ocsp.test(oURL.hostname, object.localOCSP, function(tlsResult, hasOCSP, isValid, ocspErr) {
    if(tlsResult) {
      if(hasOCSP) {
        if(isValid) {
          result.code = 6;
          delete result.message;
        } else {
          result.code = 1;
          if(ocspErr && ocspErr.length) {
            result.message = ocspErr;
          } else {
            result.message = 'Unable to verify certificate authenticity';
          }
        }
      }
    }
    resolve(result);
  });
}

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    runModule(object, resolve, reject);
  });
}

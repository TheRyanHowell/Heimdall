'use strict';

var exports = module.exports = {};
var parseHttpHeader = require('parse-http-header');

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

// Module information
exports.lowestState = 4;
exports.name = 'XSS Protection';
exports.type = 0;
exports.depends = [];
exports.link = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection';
exports.description = 'Tests whether the X-XSS-Protection header exists/is properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 4, message: 'Missing', name: exports.name};

    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Check if header exists
    if(object.responseHeaders.hasOwnProperty('x-xss-protection')) {
      // Parse header
      var xss = parseHttpHeader(object.responseHeaders['x-xss-protection']);

      // Header value determines module result
      if(xss.hasOwnProperty('0') && xss['0'] === '1') {
        if(xss.hasOwnProperty('mode') && xss['mode'].toLowerCase() === 'block') {
          result.code = 6;
          delete result.message;
        } else {
          result.code = 5;
          result.message = 'X-XSS-Protection header does not have mode=block';
        }
      }
    }
    resolve(result);
  });
}

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
exports.lowestState = 2;
exports.name = 'Referrer Policy';
exports.type = 0;
exports.depends = [];
exports.link = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy';
exports.description = 'Tests whether the Referrer Policy header exists/is properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 5, message: 'Missing', name: exports.name};

    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Check if header exists
    if(object.responseHeaders.hasOwnProperty('referrer-policy')) {
      // Parse header
      var ref = parseHttpHeader(object.responseHeaders['referrer-policy'].toLowerCase());
      // Property determines module result
      switch(ref['0']) {
        case 'no-referrer':
          result.code = 6;
          delete result.message;
        break;
        case 'unsafe-url':
          result.code = 2;
          result.message = 'Is unsafe-url';
        break;
        default:
        result.message = 'Not no-referrer';
      }
    }
    resolve(result);
  });
}

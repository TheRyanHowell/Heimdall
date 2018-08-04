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

exports.lowestState = 5;
exports.name = 'Content Type Options';
exports.type = 0;
exports.depends = [];
exports.link = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options';
exports.description = 'Tests whether the X-Content-Type-Options header exists/is properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 5, message: 'Missing', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Check if header exists
    if(object.responseHeaders.hasOwnProperty('x-content-type-options')) {
      // Parse header
      var opt = parseHttpHeader(object.responseHeaders['x-content-type-options']);

      // Header value determines module result
      if(opt['0'].toLowerCase() === 'nosniff') {
        result.code = 6;
        delete result.message;
      } else {
        result.message = 'Not nosniff';
      }
    }
    resolve(result);
  });
}

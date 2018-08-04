'use strict';

var exports = module.exports = {};

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
exports.lowestState = 5;
exports.name = 'Frame Options';
exports.type = 0;
exports.depends = [];
exports.link = 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options';
exports.description = 'Tests whether the X-Frame-Options header exists/is properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 5, message: 'Missing', name: exports.name};

    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Check if header exists
    if(object.responseHeaders.hasOwnProperty('x-frame-options')) {
      result.code = 6;
      delete result.message;
    }
    resolve(result);
  });
}

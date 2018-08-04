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
exports.name = 'Server';
exports.type = 0;
exports.depends = [];
exports.link = 'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields';
exports.description = 'Tests whether the Server exists/contains a number.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 6, name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }
    // Chcek if header exists
    if(object.responseHeaders.hasOwnProperty('server')) {
      // Check if header value contains a number
      var matches = object.responseHeaders['server'].match(/\d+/g);
      if (matches != null) {
        result.code = 5;
        result.message = 'Server header contains a number';
      }
    }
    resolve(result);
  });
}

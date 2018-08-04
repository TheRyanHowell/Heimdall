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
exports.lowestState = 3;
exports.name = 'HTTP Strict Transport Security';
exports.type = 0;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security';
exports.description = 'Tests HTTP Strict Transport Security header is used and properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 3, message: 'Missing', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }
    // If header exxists
    if(object.responseHeaders.hasOwnProperty('strict-transport-security')) {
      // Parse it
      const splitValues = object.responseHeaders['strict-transport-security'].toLowerCase().replace(/ /g,'').split(';');
      var parsedValues = {};
      splitValues.forEach(function(value) {
        const splitValue = value.split('=');
        parsedValues[splitValue[0]] = splitValue[1];
      });

      // Check for max-age, it determines score
      if(parsedValues.hasOwnProperty('max-age')) {
        if(parseInt(parsedValues['max-age']) >= 7776000) {
          if(parsedValues.hasOwnProperty('preload')) {
            result.code = 6;
            delete result.message;
          } else {
            result.code = 5;
            result.message = 'No preload';
          }
        } else {
          result.code = 4;
          result.message = 'Max-age not at least 7776000';
        }
      }
    } else if(object.responseHeaders.hasOwnProperty('x-heimdall-hsts')) {
      // Chrome hsts workaround
      result.code = 6;
      result.message = 'Used, unable to determine max-age or preload, reload page using TLS';
    }

    resolve(result);
  });
}

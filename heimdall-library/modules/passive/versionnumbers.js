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
exports.name = 'Version Numbers';
exports.type = 0;
exports.depends = [];
exports.link = 'https://www.owasp.org/index.php/Fingerprint_Web_Application_Framework_(OTG-INFO-008)#HTTP_headers';
exports.description = 'Tests whether the X-Generator or X-Powered-By header exists/contains a number.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 6, name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Parse headers, check for numbers
    var matches1 = null;
    var matches2 = null;
    if(object.responseHeaders.hasOwnProperty('x-generator')) {
        matches1 = object.responseHeaders['x-generator'].match(/\d+/g);
    }

    if(object.responseHeaders.hasOwnProperty('x-powered-by')) {
       matches2 = object.responseHeaders['x-powered-by'].match(/\d+/g);
    }

    // Result determines modeule result
    if (matches1 != null && matches2 != null) {
      result.code = 5;
      result.message = 'X-Powered-By and X-Generator contain a number';
    } else if (matches1 != null) {
      result.code = 5;
      result.message = 'X-Generator contains a number';
    } else if (matches2 != null) {
      result.code = 5;
      result.message = 'X-Powered-By contains a number';
    }

    resolve(result);
  });
}

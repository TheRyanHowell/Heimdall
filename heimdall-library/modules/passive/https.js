'use strict';

const url = require('url');


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
exports.lowestState = 1;
exports.name = 'HTTPS';
exports.type = 0;
exports.depends = [];
exports.link = 'https://en.wikipedia.org/wiki/HTTPS';
exports.description = 'Tests if request was made over HTTPS.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    const oURL = url.parse(object.url);
    var result = {code: 1, message: 'Missing', name: exports.name};
    // Handle  info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Parse URL
    if(oURL.protocol === 'https:') {
      result.code = 6;
      delete result.message;
    }

    resolve(result);
  });
}

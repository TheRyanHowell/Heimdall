'use strict';

var exports = module.exports = {};
const url = require('url');
const heartbleed = require('heartbleed-check');


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
exports.name = 'Heartbleed';
exports.type = 2;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Heartbleed';
exports.description = 'Tests whether server is vulnerable to Heartbleed.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 1, message: 'Vulnerable', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Parse the URL
    const oURL = url.parse(object.url);

    // Check if the server is vulnerable to heartbleed
    heartbleed.doCheck(oURL.hostname, 443, function(err, hResult) {
        if(!err && hResult.code) {
          result.code = 6;
          delete result.message;
          resolve(result);
        } else {
          resolve(result);
        }
    });
  });
}

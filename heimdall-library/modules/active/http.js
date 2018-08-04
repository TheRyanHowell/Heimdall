'use strict';

var exports = module.exports = {};
const url = require('url');
const http = require('http');

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

exports.lowestState = 3;
exports.name = 'HTTP';
exports.type = 1;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol';
exports.description = 'Tests for a redirect from HTTP to HTTPS.';


exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 1, message: 'No 301 redirect from http to https', name: exports.name};
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Check for valid url
    const oURL = url.parse(object.url);
    if(!oURL.hostname) {
      result.code = 1;
      result.message = 'Invalid hostname';
      resolve(result);
      return;
    }

    if(oURL.protocol && (oURL.protocol !== 'http:' && oURL.protocol !== 'https:')) {
      result.code = 1;
      result.message = 'Invalid protocol';
      resolve(result);
      return;
    }

    // Build a http request
    const options = {
      hostname: oURL.hostname,
      port: 80,
      timeout: 3000,
      path: '/',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
      }
    };

    // Send the http request
    const req = http.request(options, (res) => {
      req.abort();
      // if success, and is permanent redirect, best case
      if(res.statusCode === 301) {
        if(url.parse(res.headers.location).protocol === 'https:') {
          result.code = 6;
          delete result.message;
        }
      }

      // if success, but temporary redirect, case 3
      if(res.statusCode === 302) {
        if(url.parse(res.headers.location).protocol === 'https:') {
          result.code = 3;
          result.message = 'No 301 redirect from http to https, only 302';
        }
      }

      resolve(result);
    });

    req.on('error', (e) => {
      // Fail safe, might be HTTPS only
      result.code = 6;
      result.message = 'HTTP request failed (' + e.code + ')';
      resolve(result);
    });

    req.end();
  });
}

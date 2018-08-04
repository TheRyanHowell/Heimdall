'use strict';

var exports = module.exports = {};
var Policy = require('csp-parse');

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
exports.name = 'Content Security Policy';
exports.type = 0;
exports.depends = [];
exports.link = 'https://en.wikipedia.org/wiki/Content_Security_Policy';
exports.description = 'Tests Content Security Policy header is used and properly configured.';

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 4, message: 'Missing', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // If the header exists
    if(object.responseHeaders.hasOwnProperty('content-security-policy')) {
      var lowerCaseHeader = object.responseHeaders['content-security-policy'].toLowerCase();
      var policy = new Policy(lowerCaseHeader);
      // Check each directive for sane values
      if(policy && policy.directives) {
        if(policy.get('default-src').includes('*') ||  policy.get('default-src').includes('unsafe') ||  policy.get('default-src').includes('data:')){
          result.code = 4;
          result.message = 'Unsafe default-src';
        } else if(policy.get('script-src').includes('*') ||  policy.get('script-src').includes('unsafe')  ||  policy.get('script-src').includes('data:')){
          result.code = 4;
          result.message = 'Unsafe script-src';
        } else if(policy.get('style-src').includes('*') ||  policy.get('style-src').includes('data:')){
          result.code = 4;
          result.message = 'Unsafe style-src';
        } else if(policy.get('font-src').includes('*') ||  policy.get('font-src').includes('data:')){
          result.code = 4;
          result.message = 'Unsafe font-src';
        } else if(policy.get('connect-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe connect-src';
        } else if(policy.get('media-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe media-src';
        } else if(policy.get('object-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe object-src';
        } else if(policy.get('child-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe child-src';
        } else if(policy.get('frame-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe frame-src';
        } else if(policy.get('worker-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe worker-src';
        } else if(policy.get('frame-ancestors').includes('*')){
          result.code = 4;
          result.message = 'Unsafe frame-ancestors';
        } else if(policy.get('form-action').includes('*')){
          result.code = 4;
          result.message = 'Unsafe form-action';
        } else if(policy.get('manifest-src').includes('*')){
          result.code = 4;
          result.message = 'Unsafe manifest-src';
        } else if(!lowerCaseHeader.includes('upgrade-insecure-requests')){
          result.code = 4;
          result.message = 'No upgrade-insecure-requests';
        } else if(!lowerCaseHeader.includes('block-all-mixed-content')){
          result.code = 4;
          result.message = 'No block-all-mixed-content';
        } else if(!lowerCaseHeader.includes('disown-opener')){
          result.code = 4;
          result.message = 'No disown-opener';
        } else if(!policy.get('require-sri-for') || !policy.get('require-sri-for').includes('script') || !policy.get('require-sri-for').includes('style')){
          result.code = 4;
          result.message = 'No require-sri-for for script and style';
        } else if(!policy.get('reflected-xss') || policy.get('reflected-xss').includes('allow')){
          result.code = 4;
          result.message = 'No reflected-xss or contains allow';
        } else if(!policy.get('referrer') || policy.get('referrer').includes('unsafe-url')){
          result.code = 4;
          result.message = 'No referrer or contains unsafe-url';
        } else {
          result.code = 6;
          delete result.message;
        }
      }
    }
    resolve(result);
  });
}

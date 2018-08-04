#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

const fs = require('fs');
const { spawn } = require('child_process');

// Places openssl might be
const searchOpenSSLs = {
  darwin: ['/usr/local/opt/openssl/bin/openssl'],
  linux: ['/usr/bin/openssl', '/usr/local/bin/openssl', '/bin/openssl'],
  win32: ['C:\\OpenSSL-Win64\\bin\\openssl.exe', 'C:\\OpenSSL-Win32\\bin\\openssl.exe']
};

// Search for where openssl might be, default to path
function findOpenSSL() {
    var searchOpenSSL = searchOpenSSLs[process.platform];
    for(var attempt of searchOpenSSL) {
      if(fs.existsSync(attempt)) {
        return attempt;
      }
    }

    // Try path
    return 'openssl';
}

// Function for controlling openssl cli, to be passed to heimdall
exports.openssl = function(parameters, callback, input) {
  // By default generate a weak dhkey to test
  if(!parameters) {
    parameters = ['dhparam', '-dsaparam', '256'];
  }

  var openssl = spawn(findOpenSSL(), parameters);
  var rData = '';

  openssl.stdout.on('data', data => {
      rData += data.toString('utf8');
  });

  openssl.on('error', function(err) {});

  openssl.on('close', function(code) {
    if(code === 0 && rData) {
      callback(true, rData);
    } else {
      callback(false, null);
    }
  });

  if(input) {
    openssl.stdin.write(input);
    openssl.stdin.end();
  }
}

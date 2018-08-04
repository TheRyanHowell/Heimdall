'use strict';

const { spawn } = require('child_process');
const fs = require('fs');

// Possible openssl locations
const searchOpenSSLs = {
  darwin: ['/usr/local/opt/openssl/bin/openssl'],
  linux: ['/usr/bin/openssl', '/usr/local/bin/openssl', '/bin/openssl'],
  win32: ['C:\\OpenSSL-Win64\\bin\\openssl.exe', 'C:\\OpenSSL-Win32\\bin\\openssl.exe']
};

// Find where openssl is, fallback to path
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

// Function to be passed to heimdall for use of openssl cli
module.exports = function(parameters, callback, input) {
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

'use strict';

var exports = module.exports = {};
const tls = require('tls');
const url = require('url');

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

exports.lowestState = 1;
exports.name = 'TLS Certificate';
exports.type = 1;
exports.depends = ['HTTPS'];
exports.link = 'https://en.wikipedia.org/wiki/Transport_Layer_Security';
exports.description = 'Tests the certificate algorithms and key sizes given by the server for TLS.';

// Test for valid tls certificate
function testCert(url, ca, callback) {
  // Open tls socket
  const tlsSocket = tls.connect({
    host: url,
    servername: url,
    port: 443,
    handshakeTimeout: 5,
    ca: ca
  });

  tlsSocket.setTimeout(5000);
  tlsSocket.on('timeout', () => {
    tlsSocket.destroy();
    callback(false, new Error('Timeout'));
  });

  tlsSocket.on('secureConnect', function() {
    // Got a connection, check if valid
    var peerCertificate = tlsSocket.getPeerCertificate();
    if(tlsSocket.authorized) {
      tlsSocket.destroy();
      callback(true, peerCertificate);
    } else {
      callback(false, tlsSocket.authorizationError);
    }

  });

  tlsSocket.on('error', function(err) {
    tlsSocket.destroy();
    callback(false, err);
  });
}

var sigAlgoResults = {
  'sha512WithRSAEncryption': 6,
  'sha384WithRSAEncryption': 6,
  'sha256WithRSAEncryption': 6,
  'ecdsa-with-SHA512': 6,
  'ecdsa-with-SHA384': 6,
  'ecdsa-with-SHA256': 6,
  'sha224WithRSAEncryption': 5,
  'sha1WithRSAEncryption': 2,
};

var keyAlgoResults = {
  'rsaEncryption': [6, [2048, 1024]],
  'id-ecPublicKey': [6, [256, 128]]
};

// Parse signature algorithm against desired configuration
function getSigAlgoResult(sigAlgo) {
  var result = [1, 'Missing'];
  if(sigAlgo) {
    if(sigAlgo in sigAlgoResults) {
      result[0] = sigAlgoResults[sigAlgo];
      if(result[0] === 6) {
        result[1] = '';
      } else if(result[0] === 5) {
        result[1] = 'Weak signature algorithm (' + sigAlgo + ')';
      } else {
        result[1] = 'Bad signature algorithm (' + sigAlgo + ')';
      }
    } else {
      result[1] = 'Unknown signature algorithm (' + sigAlgo + ')';
    }
  }

  return result;
}

// Parse key algorithm against desired configuration
function getKeyAlgoResult(keyAlgo) {
  var result = [1, 'Missing'];
  if(keyAlgo) {
    if(keyAlgo in keyAlgoResults) {
      result[0] = keyAlgoResults[keyAlgo][0];
      if(result[0] === 6) {
        result[1] = '';
      } else if(result[0] === 5) {
        result[1] = 'Weak key algorithm (' + keyAlgo + ')';
      } else {
        result[1] = 'Bad key algorithm (' + keyAlgo + ')';
      }
    } else {
      result[1] = 'Unknown key algorithm (' + keyAlgo + ')';
    }
  }

  return result;
}

// Parse key size with algorithm against desired configuration
function getKeySizeResult(keyAlgo, keySize) {
  var result = [1, 'Missing'];
  if(keyAlgo) {
    if(keyAlgo in keyAlgoResults) {
      var rec = keyAlgoResults[keyAlgo][1][0];
      var min = keyAlgoResults[keyAlgo][1][1];
      if(keySize >= rec) {
        result[1] = '';
        result[0] = 6;
      } else if(keySize <= min) {
        result[1] = 'Bad key size (' + keySize + ')';
        result[0] = 2;
      } else {
        result[1] = 'Weak key size (' + keySize + ')';
        result[0] = 4;
      }
    } else {
      result[1] = 'Unknown key algorithm (' + keyAlgo + ')';
    }
  }

  return result;
}

// Runner
function runModule(object, resolve, reject) {
  const oURL = url.parse(object.url);
  var result = {code: 1, message: 'Missing', name: exports.name};
  // Handle info mode
  if(object.info) {
      result.link = exports.link;
      result.description = exports.description;
  }

  // Parse URl
  if(!oURL.hostname) {
    reject('Invalid URL');
    return;
  }

  // Test hostnames certificate
  testCert(oURL.hostname, object.ca, function(tlsResult, peerCertificate) {
    if(tlsResult) {
      if(peerCertificate) {
        // Parse certificate binary using openssl
        getCert(object.openssl, peerCertificate, function(certResult, info) {
          if(certResult && info) {
            // Pull out relevent information
            info = info.split(/\r?\n/);
            var keySize = getNumber('Public-Key:', info);
            var keyAlgo = getString('Public Key Algorithm:', info);
            var sigAlgo = getString('Signature Algorithm:', info);

            // Parse it against desired configuration
            var sigAlgoResult = getSigAlgoResult(sigAlgo);
            var keyAlgoResult = getKeyAlgoResult(keyAlgo);
            var keySizeResult = getKeySizeResult(keyAlgo, keySize);

            // Determine module score
            var smallest = sigAlgoResult;
            if(smallest[0] > keyAlgoResult[0]) {
              smallest = keyAlgoResult;
            }
            if(smallest[0] > keySizeResult[0]) {
              smallest = keySizeResult;
            }
            if(smallest[1].length) {
              result.message = smallest[1];
            } else {
              delete result.message;
            }
            result.code = smallest[0];
          }

          resolve(result);
        });
      } else {
        resolve(result);
      }
    } else {
      // Handle invalid certificates
      switch(peerCertificate.code) {
        case 'DEPTH_ZERO_SELF_SIGNED_CERT':
        result.message = 'Self-signed certificate';
        break;
        case 'CERT_HAS_EXPIRED':
        result.message = 'Certificate has expired';
        break;
        case 'UNABLE_TO_VERIFY_LEAF_SIGNATURE':
        result.message = 'Certificate signed using an untrusted root';
        break;
        default:
        if(peerCertificate && peerCertificate.code && peerCertificate.code.length) {
          result.message = peerCertificate.code;
        }
      }
      resolve(result);
    }
  });
}
// Get a number from openssl
function getNumber(index, cert) {
  var key = cert.filter(s => s.includes(index))
  if(key && key.length) {
    var keyNum = key[0].match(/\d+/);
    if(keyNum) {
      return keyNum[0];
    }
  }

  return false;
}

// Get a string from openssl
function getString(index, cert) {
  var key = cert.filter(s => s.includes(index))
  if(key && key.length) {
    var splitKey = key[0].split(': ');
    if(splitKey && splitKey.length) {
      return splitKey[1];
    }
  }

  return false;
}

// Get the tls certificate results from openssl
function getCert(openssl, cert, callback) {
  openssl(['x509', '-text', '-inform', 'der'], function(result, certInfo){
    if(result) {
      callback(true, certInfo);
    } else {
      callback(false);
    }
  }, cert.raw);
}

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    // Bind promise to function
    runModule(object, resolve, reject);
  });
}

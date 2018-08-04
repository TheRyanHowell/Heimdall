'use strict';

var exports = module.exports = {};
const url = require('url');
const portscanner = require('portscanner');

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
exports.lowestState = 3;
exports.name = 'Ports';
exports.type = 2;
exports.depends = [];
exports.link = 'https://en.wikipedia.org/wiki/Port_(computer_networking)';
exports.description = 'Tests whether ports are accessible that should not be.';

// Defie what ports to scan for
var disallowedPorts = [
  3306, /* MySQL */
  5432, /* PostgreSQL */
  1433, /* Microsoft SQL Server Database Engine */
  1434, /* Microsoft SQL Server Browser Service */
  3050, /* Firebird & Interbase */
  2375, /* Docker unencrypted */
  2376, /* Docker encrypted */
];

// Check whether a port is open on the server
function checkPort(port, disallowedPortsLocal, openPorts, hostname, callback) {
  // Check port
  portscanner.checkPortStatus(disallowedPortsLocal[port], hostname, function(error, status) {
    // if open, record it
    if(!error && status === 'open') {
      openPorts.push(disallowedPortsLocal[port]);
    }

    // Mark port as checked
    disallowedPortsLocal.splice(port, 1);

    // If any ports left
    if(disallowedPortsLocal.length) {
      // Recurse
      checkPort(0, disallowedPortsLocal, openPorts, hostname, callback);
    } else {
      // Send result
      callback(openPorts);
    }
  });
}

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    var result = {code: 3, message: 'Unable to check if ports open.', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }

    // Parse URl
    const oURL = url.parse(object.url);
    var disallowedPortsLocal = disallowedPorts.slice();

    // Check for first port being open, recurse
    checkPort(0, disallowedPortsLocal, [], oURL.hostname, function(openPorts){
      // If there are open ports
      if(openPorts && openPorts.length) {
        // Set the message and code
        if(openPorts.length > 1) {
          result.message = 'Ports ' + openPorts.join() + ' open and publicly accessible';
        } else {
          result.message = 'Port ' + openPorts[0] + ' open and publicly accessible';
        }

        result.code = 3;
      } else {
        // No open ports
        delete result.message;
        result.code = 6;
      }
      resolve(result);
    });
  });
}

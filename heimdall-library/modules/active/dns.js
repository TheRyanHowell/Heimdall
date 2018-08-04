'use strict';

var exports = module.exports = {};
const url = require('url');
const packet = require('dns-packet');
const dns = require('dns');
const hDNS = require('../../lib/local-dns.js');

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

exports.lowestState = 5;
exports.name = 'Domain Name System';
exports.type = 1;
exports.depends = [];
exports.link = 'https://en.wikipedia.org/wiki/Domain_Name_System';
exports.description = 'Tests for the presence of DS and CAA DNS records.';

// Send the dns request
function sendDNS(dnsServer, dnsType, request, localServer, callback) {
  var hasRecord = false;
  var closed = false;
  var client = hDNS.Socket(localServer);

  var sentCallback = false;

  var errTim = function(err) {
    if(!closed) {
      client.end();
      client.destroy();
      closed = true;
      client = null;
    }
  };

  var endFunc = function() {
    if(!sentCallback) {
      sentCallback = true;
      callback(hasRecord);
    }
  };

  client.on('data', function (data) {
    if(data) {
      var dData = null;
      if(data instanceof Buffer) {
        dData = packet.streamDecode(data);
      } else {
        dData = data;
      }

      // Parse answers for matching type
      if(dData && dData.hasOwnProperty('answers') && dData.answers && dData.answers.length) {
        for(var answer of dData.answers) {
          if(answer && answer.hasOwnProperty('type') && answer.hasOwnProperty('data') && answer.type === dnsType) {
            hasRecord = true;
            break;
          }
        }
      }
    }
    errTim();
  });

  client.setTimeout(1000);
  client.on('close', endFunc);
  client.on('end', endFunc);
  client.on('error', errTim);
  client.on('timeout', errTim);

  client.connect(53, dnsServer, function () {
    client.write(request);
  });
}

function hasRecord(dnsType, hostname, dnsServers, localServer, callback) {
  // Build request packet
  const request = packet.streamEncode({
    type: 'query',
    flags: packet.RECURSION_DESIRED,
    questions: [{
      type: dnsType,
      name: hostname
    }]
  });

  // Get system dns servers if not defined
  if(!dnsServers) {
    dnsServers = dns.getServers();
  }

  // Send DNS
  sendDNS(dnsServers[0], dnsType, request, localServer, function(gotResponse){
    // Iterate DNS servers
    dnsServers.shift();
    // If we got a response, use it, else use next dns server
    if(!gotResponse && dnsServers.length) {
      hasRecord(dnsType, hostname, dnsServers, localServer, callback);
    } else {
      callback(gotResponse);
    }
  });
}

exports.run = function(object) {
  return new Promise(function(resolve, reject) {
    const oURL = url.parse(object.url);
    var result = {code: 5, message: 'No CAA', name: exports.name};
    // Handle info mode
    if(object.info) {
        result.link = exports.link;
        result.description = exports.description;
    }
    // Check for CAA and DS record types
    hasRecord('CAA', oURL.hostname, null, object.dnsServer, function(hasCAA) {
      hasRecord('DS', oURL.hostname, null, object.dnsServer, function(hasDS) {
        if(hasCAA && hasDS) {
          result.code = 6;
          delete result.message;
        } else if(hasCAA) {
          result.code = 5;
          result.message = 'No DNSSEC';
        }
        resolve(result);
      });
    });
  });
}

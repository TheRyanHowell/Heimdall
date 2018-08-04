#!/usr/bin/env node
'use strict';

const program = require('commander');
const url = require('url');
const http = require('http');
const https = require('https');
const heimdall = require('heimdall-library');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

var types = {
  'passive': 0,
  'active': 1,
  'aggressive': 2
};
var modes = {
  'quick': true,
  'full': false
};

var urlsToScan = [];
var responses = [];
var numberOfResponses = 0;

// Possible openssl locations
const searchOpenSSLs = {
  darwin: ['/usr/local/opt/openssl/bin/openssl'],
  linux: ['/usr/bin/openssl', '/usr/local/bin/openssl', '/bin/openssl'],
  win32: ['C:\\OpenSSL-Win64\\bin\\openssl.exe', 'C:\\OpenSSL-Win32\\bin\\openssl.exe']
};

// Attempts to find an openssl binary, fallsback to binary in path
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

// Openssl handler to be passed to Heimdall
function openssl(parameters, callback, input) {
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

// Define CLI program
program.version('1.0.0')
       .usage('scan example1.com http://example2.com https://example3.com')
       .option('-m  --mode <mode>', 'Mode of scan (quick, full), defaults to quick.')
       .option('-t  --type <type>', 'Type of scan (passive, active, aggressive), defaults to passive.')
       .command('scan <url> [otherUrls...]')
       .action(function (url, otherUrls) {
          urlsToScan.push(url);
          if (otherUrls) {
            otherUrls.forEach(function (oUrl) {
              urlsToScan.push(oUrl);
            });
          }
        });

// Parse parameters
program.parse(process.argv);

// Send a request to the address, fallback to http on failure
function sendRequest(oURL, callback) {
  const options = {
    hostname: oURL.hostname,
    protocol: oURL.protocol,
    timeout: 3000,
    path: '/',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    },
    rejectUnauthorized: false
  };

  var req = null;
  if(oURL.protocol === 'https:') {
    req = https.request(options, (res) => {
      req.abort();
      callback(true, res, oURL);
    });
  } else {
    req = http.request(options, (res) => {
      req.abort();
      callback(true, res, oURL);
    });
  }


  req.on('error', (e) => {
    if(oURL.assumed) {
      sendRequest(oURL.httpURL, callback);
    } else {
      callback(false, e, oURL);
    }
  });

  req.end();
}

// Collect heimdall responses, on final response echo json output
function handleHeimdallResponse(response) {
  responses.push(response);
  numberOfResponses++;
  if(numberOfResponses === urlsToScan.length) {
    console.log(JSON.stringify(responses, null, 1));
    process.exit(0);
  }
}

// Handle response from web server, by running heimdall
function handleResponse(result, response, pURL) {
  if(result) {
    var request = {};
    request.responseHeaders = [];
    Object.keys(response.headers).forEach(function(key) {
      request.responseHeaders.push({name: key, value: response.headers[key]});
    });

    request.url = pURL.href;
    request.state = 'U';
    request.quick = program.mode;
    request.type = program.type;

    heimdall.runModules(request, function(msg, response) {
      handleHeimdallResponse(response);
    }, openssl);

  } else {
    console.log('Error making request.');
    console.log(response);
    process.exit(1);
  }
}

if(urlsToScan.length) {
  // Create url objects from parameters
  for(var sUrl of urlsToScan) {
    var key = urlsToScan.indexOf(sUrl);
    var newURL = url.parse(sUrl);
    if(!newURL.protocol) {
      let oldURL = newURL;
      // Assume https
      newURL = url.parse('https://' + oldURL.href);

      // Fallback to http
      newURL.assumed = true;
      newURL.httpURL = url.parse('http://' + oldURL.href);
    }

    urlsToScan[key] = newURL;
  }

  if(!program.mode) {
    program.mode = true;
  } else if(!modes.hasOwnProperty(program.mode)) {
    console.error('Invalid mode: ' + program.type);
    process.exit(2);
  } else {
    program.mode = modes[program.mode];
  }

  if(!program.type) {
    program.type = 'passive';
  } else {
    if(!types.hasOwnProperty(program.type)) {
      console.error('Invalid type: ' + program.type);
      process.exit(3);
    }
  }

  // Test openssl works
  openssl(false, function(result){
    if(result) {
      // Send requests to each url
      for(var sUrl of urlsToScan) {
        sendRequest(sUrl, handleResponse);
      }
    } else {
      console.error('Unable to generate diffie hellman key, please install openssl.');
      process.exit(4);
    }
  });

} else {
  program.help();
}

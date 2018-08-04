'use strict';

const heimdall = require('heimdall-library');
const urlParse = require('url');

// Setup cache and valid icon states
var tabs = {};
const validStates = [
  'U',
  'F',
  'D',
  'C',
  'B',
  'A',
  'A+'
];

var types = {
  0: 'passive',
  1: 'active',
  2: 'aggressive'
};
// Define options and their defaults
const options = ['type', 'serviceAddress', 'servicePort', 'whitelist', 'blacklist'];
const defaults = [0, '127.0.0.1', '3000', [''], ['']];

// Init
var socket = null;
var onCompletedListener = null;
var onBeforeRequestListener = null;
var onMessageListener = null;
var onConnectListener = null;
var refreshInterval = null;

var callbacks = {};
var callbackIndex = 0;
var ports = [];
var usedHSTS = {};

// Get a single extension setting
function getSetting(key, onGot) {
  browser.storage.local.get(key).then(function(result){
    console.log(result);
    if(result.hasOwnProperty(key)) {
      onGot(result[key]);
    } else {
      onGot(defaults[options.indexOf(key)]);
    }

  }, function(e){
    console.log(e);
    onGot(defaults[options.indexOf(key)]);
  });
}

// Get all the extension settings
function getAllSettings(callback) {
  var settings = {};
  getSetting('type', function(type){
    settings.type = type;
    getSetting('serviceAddress', function(serviceAddress){
      settings.serviceAddress = serviceAddress;
      getSetting('servicePort', function(servicePort){
        settings.servicePort = servicePort;
        getSetting('whitelist', function(whitelist){
          settings.whitelist = whitelist;
          getSetting('blacklist', function(blacklist){
            settings.blacklist = blacklist;
            callback(settings);
          });
        });
      });
    });
  });
}

// Updates the state for the tab relevant to the request
function processStateChange(tabId) {
  var icon = validStates[0];
  // If relevant tab exists
  if(tabId in tabs) {
    if(validStates.includes(tabs[tabId].response.state)) {
      // Set it's icon to the response state
      icon = tabs[tabId].response.state;
    }
  }

  // Attempt to change icon
  console.log('Changing ' + tabId + ' to ' + icon);
  browser.browserAction.setIcon({
    path: {
      "16": "./icons/" + icon + "_16.png",
      "32": "./icons/" + icon + "_32.png",
      "64": "./icons/" + icon + "_64.png",
      "128": "./icons/" + icon + "_128.png"
    },
    tabId: parseInt(tabId)
  }).catch(error => {
    console.error(error);
    console.log('DELETE 2');
    // Clear from cache
    delete tabs[tabId];
  });
}

// Handle response from heimdall, triggering icon change when appropriate
function handleHeimdallResponse(msg) {
  console.log('Response: ');
  console.log(msg);

  if(msg.hasOwnProperty('response') && msg.response.hasOwnProperty('callbackIndex') && msg.response.callbackIndex in callbacks) {
    console.log('CALLBACK');
    var callback = callbacks[msg.response.callbackIndex];
    delete callbacks[msg.response.callbackIndex];
    delete msg.response.callbackIndex;
    callback(msg);
    return;
  }

  if(msg.tabID <= 0) {
    return;
  }

  // If update
  if(msg.tabId in tabs) {
    // If older
    if(msg.timeStamp < tabs[msg.tabId].timeStamp) {
      console.log('Old Data');
      return;
    }
  }

  tabs[msg.tabId] = msg;
  processStateChange(msg.tabId);
}

// Disconnect from tray applet
function disconnect() {
  if(socket) {
    console.log('Disconnect')
    socket.close();
    setTimeout(function(){
      console.log('Reconnect')
      socket.open();
    }, 5000);
  } else {
    console.log('Could not disconnect');
  }
}

// Send request to heimdall, local or tray applet, after parsing for valid request
function startHeimdall(response, quick, callback) {
  var response = processHSTSUsed(response);
  getAllSettings(function(settings) {
    console.log(settings);

    const pURL = urlParse.parse(response.url);

    // Must match whitelist
    var inWhiteList = false;
    var hasWhiteList = false;
    for(var white of settings.whitelist) {
      console.log(white);
      if(white && white.length) {
        hasWhiteList = true;
        try {
          var regex = new RegExp(white, 'g');
          if(regex.test(pURL.hostname)){
            inWhiteList = true;
            break;
          }
        } catch(e) {}
      }
    }

    if(hasWhiteList && !inWhiteList) {
      console.log('Hit whitelist');
      return;
    }

    // Must not match blacklist
    for(var black of settings.blacklist) {
      console.log(black);
      if(black && black.length) {
        try {
          var regex = new RegExp(black, 'g');
          if(regex.test(pURL.hostname)){
            console.log('Hit blacklist');
            return;
          }
        } catch(e) {}
      }
    }

    // Define how heimdall should scan
    response.state = 'U';
    response.quick = quick;
    response.type = types[settings.type];
    response.info = true;

    // Send request to service if non passive, else run it ourselves
    if(response.type !== types[0]) {
      if(socket.connected) {
        console.log('Sent Request');
        console.log(response);
        callbackIndex++;
        response.callbackIndex = callbackIndex;
        callbacks[callbackIndex] = callback;
        socket.emit('request', heimdall.sanitizeRequest(response));
      }
    } else {
      console.log('Locally Processed Request');
      console.log(response);
      heimdall.runModules(heimdall.sanitizeRequest(response), function(msg, response) {
        callback({tabId: msg.tabId, response: response});
      });
    }
  });
}

function validateResponse(response, cache) {
  // Skip system tabs
  if(response.tabID <= 0) {
    console.log('Skipped 1');
    return false;
  }

  console.log('VALIDATE');
  console.log(cache);
  console.log(response.tabId in tabs);
  console.log(response.tabId);
  console.log(tabs);

  // If cache enabled we already have a result for that tab, and the url hasn't changed
  if(cache && response.tabId in tabs) {
    console.log('COMPARE');
    console.log(response.url);
    console.log(tabs[response.tabId].response.url);
    if(response.url === tabs[response.tabId].response.url) {
      console.log('Skipped 2');
      return false;
    } else {
      // Invalidate cache
      tabs[response.tabId].cacheinvalid = true;
      tabs[response.tabId].response.state = 'U';
      tabs[response.tabId].response.moduleResults = [];
    }
  }

  const pURL = urlParse.parse(response.url);
  console.log(pURL);

  // Must be http or https
  if(!['http:', 'https:'].includes(pURL.protocol)) {
    console.log('Skipped 3');
    return false;
  }

  // Must be port 80 or 443
  if(pURL.port !== null && !['80', '443'].includes(pURL.port)) {
    console.log('Skipped 4');
    return false;
  }

  // Must not be localhost
  if(['localhost', '127.0.0.1'].includes(pURL.hostname)) {
    console.log('Skipped 5');
    return false;
  }

  return true;
}

// When a request has completed on a main frame
function onCompleted(response) {
  response = stripURL(response);
  if(validateResponse(response, true)) {
    startHeimdall(response, true, handleHeimdallResponse);
  }
}

// Strip sensitive information from url, we only scan base path
function stripURL(object) {
  if(object && object.hasOwnProperty('url')) {
    const pURL = urlParse.parse(object.url);
    object.url = pURL.protocol + '//' + pURL.hostname + '/';
  }

  return object;
}

// Handler used for onBeforeRequest event sent to web extension
function onBeforeRequest(request) {
  request = stripURL(request);
  if(request.tabId !== -1) {
    console.log(request.url);
    console.log(tabs);
    console.log(tabs[request.tabId]);
    if(request.tabId in tabs && request.url !== tabs[request.tabId].response.url) {
      console.log('DELETE 1');
      delete tabs[request.tabId];
      processStateChange(request.tabId);
    }
  }
}

// Clear the cache of each tabs responses
function invalidateCache() {
  for (var tab in tabs) {
    if (tabs.hasOwnProperty(tab)) {
      tabs[tab].cacheinvalid = true;
      tabs[tab].response.state = 'U';
      tabs[tab].response.moduleResults = [];
      processStateChange(tab);
    }
  }
}

// Update all icons based on their cache data
function updateAll() {
  for (var tab in tabs) {
    if (tabs.hasOwnProperty(tab)) {
      if(validateResponse(tabs[tab].response, false)) {
        startHeimdall(tabs[tab].response, true, handleHeimdallResponse);
      }
    }
  }
}

// Handled incoming messages
function handleMessage(request, sender, sendResponse) {
  console.log(request);
  console.log(sender);
  console.log(sendResponse);

  // Get quick from cache
  if(request.hasOwnProperty('tabId') && request.tabId in tabs) {
    console.log('Sending Quick Report');
    return Promise.resolve({response: tabs[request.tabId]});
  } else if(request.hasOwnProperty('restart') && request.restart) {
    restart();
    return Promise.resolve({restarted: true});
  } else {
    console.log('Sending Error State');
    return Promise.resolve({error: true});
  }
}

// Handle requests from report page
function reportRequest(m) {
  if(m.hasOwnProperty('request') && m.request && m.request.hasOwnProperty('bPortIndex') && validateResponse(m.request, false)) {
    startHeimdall(m.request, false, function(response) {
      ports[response.response.bPortIndex].postMessage({response: response});
    });
  }
}

// Handle page connection
function pageConnected(p) {
  var portIndex = ports.push(p) - 1;
  // Bind to report requests
  p.onMessage.addListener(reportRequest);
  p.postMessage({index: portIndex});
}

// Handler for timer to refresh icons
function refreshTimer() {
  for (var tab in tabs) {
    if (tabs.hasOwnProperty(tab) && !tabs[tab].hasOwnProperty('cacheinvalid')) {
      processStateChange(tab);
    }
  }
}

// Shutdown handler, clean up objects/handlers
function shutdown() {
  if(socket) {
    socket.destroy();
    socket = null;
  }

  if(onCompletedListener) {
    browser.webRequest.onCompleted.removeListener(onCompletedListener);
  }

  if(onBeforeRequestListener) {
    browser.webRequest.onBeforeRequest.removeListener(onBeforeRequestListener);
  }

  if(onMessageListener) {
    browser.webRequest.onMessage.removeListener(onMessageListener);
  }

  if(onConnectListener) {
    browser.webRequest.onConnect.removeListener(onConnectListener);
  }

  if(refreshInterval) {
    clearInterval(refreshInterval);
  }

  invalidateCache();
}

function restart() {
  shutdown();
  init();
}

// Workaround for chrome HSTS stripping
function processHSTSUsed(response) {
  if(response.hasOwnProperty('requestId') && usedHSTS.hasOwnProperty(response.requestId)) {
    if(response.hasOwnProperty('responseHeaders') && response.responseHeaders) {
      response.responseHeaders.push({name: 'X-Heimdall-HSTS', value: '1'});
      delete usedHSTS[response.requestId];
    }
  }

  return response;
}

// Handler for onBeforeRedirect chrome HSTS workaround
function onBeforeRedirect(details) {
  if(details.statusCode === 307 && details.responseHeaders && details.responseHeaders.length) {
    for(var hIndex in details.responseHeaders) {
      if(details.responseHeaders[hIndex].name === "Non-Authoritative-Reason" && details.responseHeaders[hIndex].value === "HSTS") {
        usedHSTS[details.requestId] = true;
        break;
      }
    }
  }
}

// Entrypoint
function init() {
  // Get relevant settings
  getSetting('serviceAddress', function(serviceAddress){
    getSetting('servicePort', function(servicePort){
      getSetting('type', function(type){
        // Only connect in active mode
        if(type === '1') {
          // Connect to the server
          socket = io('http://' + serviceAddress + ':' + servicePort);

          socket.on('connect', function(){
            console.log('Connected');
          });

          socket.on('connect_error', (error) => {
            console.log(error);
          });

          socket.on('connect_timeout', (timeout) => {
            console.log(timeout);
          });

          // When we get a response, update our cache and icon
          socket.on('response', handleHeimdallResponse);
          socket.on('heimdallDisconnect', disconnect);
        }

        // Bind to requests when completed on a main frame
        onCompletedListener = browser.webRequest.onCompleted.addListener(
          onCompleted,
          {urls: ['<all_urls>'], types:['main_frame']},
          ["responseHeaders"]
        );

        // Bind to onBeforeRequest for HSTS workaround
        onBeforeRequestListener = browser.webRequest.onBeforeRequest.addListener(
          onBeforeRequest,
          {urls: ['<all_urls>'], types:['main_frame']}
        );

        // Bind to incoming messages
        onMessageListener = browser.runtime.onMessage.addListener(handleMessage);

        // Bind to report page
        onConnectListener = browser.runtime.onConnect.addListener(pageConnected);

        // Bind to incoming requests
        browser.webRequest.onBeforeRedirect.addListener(onBeforeRedirect,
          {urls: ['<all_urls>'], types:['main_frame']},
          ["responseHeaders"]
        );

        // Set icon refresh timer
        refreshInterval = setInterval(refreshTimer, 1000);

        updateAll();
      });
    });
  });
}

init();

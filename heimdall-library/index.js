var exports = module.exports = {};

var modules = require('./modules');
const parseURL = require('url');

var states = {
  0: 'U',
  1: 'F',
  2: 'D',
  3: 'C',
  4: 'B',
  5: 'A',
  6: 'A+'
};

var types = {
  'passive': 0,
  'active': 1,
  'aggressive': 2
};

// Process the final result, being the lowest of module results
function processResult(values) {
  var lowest = 6;
  values.forEach(function(result) {
    if(result.code < lowest) {
      lowest = result.code;
    }
  });

  return states[lowest];
}

// Order the result highest to lowest.
function orderResult(values) {
  values.sort(function(a, b) {
      return a.code - b.code;
  });

  return values;
}

// Set headers to sanitize
const disallowedHeaders = ['set-cookie', 'authorization'];

// Delete openssl object from response
function cleanResponse(object) {
  if(object.hasOwnProperty('openssl')) {
    delete object['openssl'];
  }
}

// Sanitize request of sensitive information, determine if aggressive is allowed
exports.sanitizeRequest = function(object) {
  object = mapHeaders(object);

  const oURL = parseURL.parse(object.url);
  object.url = oURL.protocol + '//' + oURL.hostname + oURL.pathname;
  object.allowagressive = false;

  if(object.responseHeaders) {
    // Remove disallowed headers
    for(var disallowedHeader of disallowedHeaders) {
      if(object.responseHeaders.hasOwnProperty(disallowedHeader)) {
        delete object.responseHeaders[disallowedHeader];
      }
    }

    if(object.responseHeaders.hasOwnProperty('x-heimdall-allow')) {
      object.allowagressive = true;
    }
  }

  return object;
}

// Map headers array to object
function mapHeaders(object) {
  if(object.hasOwnProperty('responseHeaders') && Array.isArray(object.responseHeaders)) {
    var responseHeaders = {};
    for(var header of object.responseHeaders) {
      responseHeaders[header.name.toLowerCase()] = header.value;
    }
    object.responseHeaders = responseHeaders;
  }

  return object;
}

// Determine if the request contains a valid url and headers
function isValidRequest(object) {
  if(object && object.hasOwnProperty('url') && object.hasOwnProperty('responseHeaders')) {
    const oURL = parseURL.parse(object.url);
    if(oURL.protocol && oURL.hostname){
      return true;
    }
  }

  return false;
}

// Entry point for library use
exports.runModules = async function(object, callback, openssl) {
  var defaultResponse = object;
  var response = defaultResponse;
  if(!isValidRequest(object)) {
    response.state = 'U';
    cleanResponse(object);
    callback(object, defaultResponse);
    return;
  }

  if(openssl) {
    object.openssl = openssl;
  }

  object = exports.sanitizeRequest(object);

  object.state = 'U';

  if(!object.hasOwnProperty('type')) {
    object.type = 'passive';
  }

  // Determine if quick or full mode
  if(object.hasOwnProperty('quick') && object.quick) {
    // Process modules by severity (lowest state first)
    var promises = [];
    try {
      Object.keys(modules).forEach(function(key) {
        if(types[object.type] >= modules[key].type) {
          if(object.allowagressive || modules[key].type !== 2) {
            promises.push({lowestState: modules[key].lowestState, run: modules[key].run, name: modules[key].name, type: modules[key].type, depends: modules[key].depends, started: false, completed: false});
          }
        }
      });

      // Sort by state, then type
      promises.sort(function(a, b) {
        var lowestState = a.lowestState - b.lowestState;
        if(lowestState === 0) {
          return a.type - b.type
        } else {
          return lowestState;
        }
      });

      var blockedPromises = {};
      var completedPromises = {};
      var completed = false;
      var moduleResults = [];
      var currentState = {code: 6};
      var moduleNames = {};

      for(promise of promises) {
        moduleNames[promise.name] = true;
      }

      // Process modules in batches
      do {
        // Determine which modules to run this loop
        for(promise of promises) {
          if(!promise.started) {
            var dependenciesCompleted = true;
            if(promise.depends.length) {
              for(depend of promise.depends) {
                if(moduleNames.hasOwnProperty(depend)) {
                  if(!completedPromises.hasOwnProperty(depend)) {
                    dependenciesCompleted = false;
                    break;
                  }
                }
              }
            }

            if(dependenciesCompleted) {
              if(blockedPromises.hasOwnProperty(promise.name)) {
                delete blockedPromises[promise.name];
              }

              promise.promise = promise.run(object);
              promise.started = true;
            } else {

              blockedPromises[promise.name] = true;
            }
          }
        }

        // Get the modules state
        // Return when we know the lowest state possible has been reached
        for(promise of promises) {
          if(promise.lowestState < currentState.code) {
            if(promise.started && !promise.completed) {
              var newState = null;
              try {
                newState = await promise.promise;
              } catch(e) {
                newState = {code: 0, message: 'Unknown error occurred.'};
              }

              if(newState.code < currentState.code) {
                currentState = newState;
              }
              moduleResults.push(newState);
              promise.completed = true;
              completedPromises[promise.name] = true;
            }
          } else {
            // Unblock module if blocked, no longer relevant
            if(blockedPromises.hasOwnProperty(promise.name)) {
              delete blockedPromises[promise.name];
            }
            promise.started = true;
            promise.completed = true;
          }
        }

      } while(Object.keys(blockedPromises).length);

      response.moduleResults = orderResult(moduleResults);
      response.state = states[currentState.code];
      cleanResponse(object);
      callback(object, response);
    } catch(e) {
      cleanResponse(object);
      callback(object, defaultResponse);
    }
  } else {
    // Process all modules, full mode
    var promises = [];

    // Determine what modules to run, if aggressive is allowed etc.
    try {
      Object.keys(modules).forEach(function(key) {
        if(types[object.type] >= modules[key].type) {
          if(object.allowagressive || modules[key].type !== 2) {
            promises.push(modules[key].run(object));
          }
        }
      });

      // Run all modules
      Promise.all(promises).then(moduleResults => {
        response.moduleResults = orderResult(moduleResults);
        response.state = processResult(moduleResults);
        cleanResponse(object);
        callback(object, response);
      }, reason => {
        response.state = 'U';
        cleanResponse(object);
        callback(object, defaultResponse);
      });

    } catch(e) {
      cleanResponse(object);
      callback(object, defaultResponse);
    }
  }
}

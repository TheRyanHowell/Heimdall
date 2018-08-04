'use strict';

var exports = module.exports = {};


// Passive
exports['csp'] = require('./modules/passive/csp.js');
exports['hsts'] = require('./modules/passive/hsts.js');
exports['https'] = require('./modules/passive/https.js');
exports['server'] = require('./modules/passive/server.js');
exports['versionnumbers'] = require('./modules/passive/versionnumbers.js');
exports['xxssprotection'] = require('./modules/passive/xxssprotection.js');
exports['referrerpolicy'] = require('./modules/passive/referrerpolicy.js');
exports['xcontenttypeoptions'] = require('./modules/passive/xcontenttypeoptions.js');
exports['xframeoptions'] = require('./modules/passive/xframeoptions.js');

if(!process.browser) {
  // Active
  exports['http'] = require('./modules/active/http.js');
  exports['dns'] = require('./modules/active/dns.js');
  exports['tlsciphers'] = require('./modules/active/tlsciphers.js');
  exports['tlspfs'] = require('./modules/active/tlspfs.js');
  exports['tlsocsp'] = require('./modules/active/tlsocsp.js');
  exports['tlscert'] = require('./modules/active/tlscert.js');

  // Aggressive
  exports['heartbleed'] = require('./modules/aggressive/heartbleed.js');
  exports['ports'] = require('./modules/aggressive/ports.js');
}

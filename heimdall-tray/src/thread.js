'use strict';
console.log('Loaded');

// Heimdall thread

const ipc = require('electron').ipcRenderer;
const heimdallLib = require('heimdall-library');
const openssl = require('./getopenssl.js');

// Listen for a message
ipc.on('message', (event, omsg) => {
    // Got a request, process it
    heimdallLib.runModules(omsg.msg, function(msg, response) {
      // Send the response back to main thread
      ipc.send('reply',  {id: omsg.id, msg: msg, response: response});
    }, openssl);
})

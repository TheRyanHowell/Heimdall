'use strict';

import { remote } from "electron";
const settings = remote.require('electron-settings');
const os = require('os');

// Save the options
function saveOptions(e) {
  e.preventDefault();
  settings.set('address', document.querySelector("#address").value);
  settings.set('port', document.querySelector("#port").value);
  settings.set('threads', document.querySelector("#threads").value);
  remote.getCurrentWindow().close();
}

// Render the current options
function restoreOptions() {
  document.querySelector("#address").value = settings.get('address', '127.0.0.1');
  document.querySelector("#port").value = settings.get('port', 3000);
  var threads = document.querySelector("#threads");
  threads.value = settings.get('threads', Math.round(os.cpus().length/2));
  threads.setAttribute('max', os.cpus().length);
}

// Bind events
document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

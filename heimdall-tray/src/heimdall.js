'use strict';
const BrowserWindow = require('electron').BrowserWindow;
const ipc = require('electron').ipcMain;


var windows = [];
var loadedWindows = 0;
var roundRobin = 0;
var requests = {};
var bindResponseFunction = null;
var gCpuCount = 0;
var loaded = false;

function load(cpuCount) {
  // Open as many threads as configured
  gCpuCount = cpuCount;
  for(var i = 1; i <= cpuCount; i++) {
    var index = windows.length;
    windows[index] = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        nodeIntegration: true
      }
    });

    windows[index].on('closed', () => {
      windows[index] = null;
    });

    windows[index].webContents.openDevTools();
    windows[index].loadURL(`file://${__dirname}/thread.html`)
  }

  // On reply, bind response
  ipc.on('reply', function(event, msg){
    bindResponseFunction(msg);
  });

  loaded = true;
}

function bindResponse(lBindResponseFunction) {
  bindResponseFunction = lBindResponseFunction;
}

function run(msg, id) {
  // On run, send messages to threads in round robin
  windows[roundRobin].webContents.send('message', {msg: msg, id: id});
  if(roundRobin === (windows.length-1)) {
    roundRobin = 0;
  } else {
    roundRobin++;
  }
}

// Close all threads
function close() {
  for(var index in windows) {
    if(windows[index] && windows[index].hasOwnProperty('close')) {
      windows[index].close();
    }
  }
}

module.exports = {
  load: load,
  run: run,
  close: close,
  bindResponse: bindResponse,
  loaded: loaded
};

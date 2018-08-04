'use strict';
// Heimdall background thread
const resourcesDir = path.join(__dirname, 'resources');
const iconsDir = path.join(__dirname, 'resources/icons');

var port = null;
var address = null;

import path from "path";
import url from "url";

const electron = require('electron');
const proc = require('child_process');
import { app, dialog, Menu, Tray, BrowserWindow } from "electron";

const openssl = require('./getopenssl.js');
const heimdall = require('./heimdall.js');

const notifier = require('node-notifier');
const AutoLaunch = require('auto-launch');
const fs = require('fs');
const os = require('os');
var http = require('http').Server();
var io = require('socket.io')(http);

import createWindow from "./helpers/window";
import env from "env";

// Get user data
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

// Handle logging
function trayLog(msg) {
  if (env.name !== "production") {
    console.log(msg);
    fs.appendFile('tray.log', msg + "\n", function(){});
  }
}

// Get settings
var settings = require('electron-settings');
trayLog(settings.file());

var win = null;
var tray = null;

// Create autoLauncher
var autoLauncher = new AutoLaunch({
    name: 'Heimdall Tray'
});

// Check if autosart is enabled
function autoStartIsEnabled(callback) {
  autoLauncher.isEnabled()
  .then(function(isEnabled){
      callback(isEnabled);
  })
  .catch(function(err){
      // handle error
      trayLog(err);
      callback(false);
  });
}

// Handle shutdown, close sockets, windows
var shuttingDown = false;
function shutdown() {
  shuttingDown = true;
  if(settingsWindow) {
    trayLog('settingsWindow');
    settingsWindow.close();
  }
  if(io && io.sockets) {
    io.sockets.emit('heimdallDisconnect', 'heimdallDisconnect');
  }
  if(tray) {
    trayLog('tray');
    tray.destroy();
  }
  if(heimdall && heimdall.loaded) {
    trayLog('Closed Heimdall');
    heimdall.close();
  }

  if(app) {
    trayLog('app exit');
    app.exit();
  } else {
    trayLog('process exit');
    process.exit(0);
  }
}

// Handle restart
function restart() {
  if(app) {
    trayLog('App relaunch');
    app.relaunch();
  }
  shutdown();
}

// Handle remote shutdown signal
function remoteShutdown(address, port, callback) {
  var socket = require('socket.io-client')('http://' + address + ':' + port);
  var sentCallback = false;
  socket.on('connect', function(){
    socket.emit('request', {shutdown: true});
    if(!sentCallback) {
      sentCallback = true;
      socket.close();
      callback(true);
    }
  });

  setTimeout(function(){
    sentCallback = true;
    socket.close();
    callback(false);
  }, 3000);
}

// Handle creating settings window, open if already created
var settingsWindow = null;
function openSettings() {
  if(!settingsWindow) {
    settingsWindow = createWindow("Heimdall Tray Settings", {
     width: 533,
     height: 300,
     webPreferences: {
      nodeIntegration: true
     }
    });

    settingsWindow.on('close', function(e) {
      if(!shuttingDown) {
        e.preventDefault();
        settingsWindow.hide();
        restart();
      }
    });

    settingsWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "settings.html"),
        protocol: "file:",
        slashes: true
      })
    );
  } else {
    settingsWindow.show();
  }

}

var connections = 0;

// Handle what icon to draw based on operating system
function getAppIcon() {
  var appIcon = '';

  if(connections) {
    switch(process.platform) {
      case 'darwin':
      appIcon = path.join(iconsDir, 'trayTemplate.png');
      break;
      case 'win32':
      appIcon = path.join(resourcesDir, 'icon.ico');
      break;
      default:
      case 'linux':
      appIcon = path.join(iconsDir, '1024x1024.png');
      break;
    }
  } else {
    switch(process.platform) {
      case 'darwin':
      appIcon = path.join(iconsDir, 'U/uTrayTemplate.png');
      break;
      case 'win32':
      appIcon = path.join(iconsDir, 'U/U_grey.ico');
      break;
      default:
      case 'linux':
      appIcon = path.join(iconsDir, 'U/U_1024_grey.png');
      break;
    }
  }

  return appIcon;
}

// Set the tooltip to display active connection count
function setToolTip() {
  if(tray) {
    trayLog(connections + ' active connections.');
    tray.setToolTip(connections + ' active connections.');
  }
}

// Update the tray icon and tooltip
function updateTray() {
  if(tray) {
    tray.setImage(getAppIcon());
    setToolTip();
  }
}

// Entry point
function init() {
  // Check openssl works
  openssl(null, function(oResult) {
    if(oResult) {
      // Load heimdall threads, bind thread handler
      heimdall.load(settings.get('threads', Math.round(os.cpus().length/2)));
      heimdall.bindResponse(function(msg){
        io.sockets.sockets[msg.id].emit('response', {tabId: msg.msg.tabId, response: msg.msg});
      });

      // Handle web socket connection
      io.on('connection', function(socket){
        // New connection
        trayLog('Connection: ' + socket.id);
        connections++;
        updateTray();

        // Handle requests
        socket.on('request', function(msg){
          if(msg.hasOwnProperty('shutdown') && msg.shutdown) {
            shutdown();
            return;
          }

          if(msg.hasOwnProperty('restart') && msg.restart) {

            return;
          }

          if(msg.hasOwnProperty('tabId') && msg.tabId <= 0) {
            return;
          }

          heimdall.run(msg, socket.id);
        });

        // Handle client disconnect
        socket.on('disconnect', function() {
         connections--;
         updateTray();
         trayLog('Disconnection');
        });
      });

      // Handle port already bound
      http.on('error', function(err) {
        if(err.code === 'EADDRINUSE') {
          // Try shutdown the old one, send a signal
          remoteShutdown(address, port, function(status){
            if(status) {
              // Worked, restart
              restart();
            } else {
              // Failed, display a message
              dialog.showMessageBox(null, { type: 'error', message: 'The tray applet is already running and could not be closed, or another program has bound to port ' + port + '.', title: 'Heimdall Tray - Error',
                buttons: ["Exit"]
              }, function(){
                shutdown();
              });
            }
          });

        } else {
          throw err;
        }
      });

      // listen on the desired port
      http.listen({host: address, port: port}, function(){
        trayLog('listening on ' + address + ':' + port);
      });
    } else {
      // No openssl, display message
      dialog.showMessageBox(null, { type: 'error', message: 'Unable to find openssl, please make sure you have installed it.', title: 'Heimdall Tray - Error',
        buttons: ["Exit"]
      }, function(){
        shutdown();
      });
    }
  });
}

// Handle process signals
process.on('SIGINT', function() {
  shutdown();
});

process.on('unhandledRejection', function(reason, p){
  trayLog(error);
  return;
});

process.on('uncaughtException', function(error) {
  trayLog(error);
  return;
});

// When the electron ready event fires
app.on("ready", () => {
  // Get settings
  port = settings.get('port', 3000);
  address = settings.get('address', '127.0.0.1');

  // Set icon and tooltip, build tray
  tray = new Tray(getAppIcon());
  setToolTip();

  // Handle autostart
  autoStartIsEnabled(function(autoStartEnabled) {
    trayLog('autoStartEnabled: ' + autoStartEnabled);

    // Create tray
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Autostart', type: 'checkbox', checked: autoStartEnabled, click: function(item){
          if(item.checked) {
            autoLauncher.enable();
          } else {
            autoLauncher.disable();
          }
        },
      },
      {
        label: 'Settings', type: 'normal', click: function(){
          openSettings();
        }
      },
      {
        label: 'Quit', type: 'normal', click: function(){
          shutdown();
        }
      }
    ])
    tray.setToolTip('Heimdall')
    tray.setContextMenu(contextMenu);

    // Start
    init();
  });
});

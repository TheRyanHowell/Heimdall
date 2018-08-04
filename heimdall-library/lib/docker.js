#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

const fs = require('fs');
const { spawn, exec } = require('child_process');

// Function for calling docker command line
exports.command = function(parameters, callback, input) {
  var docker = spawn('docker', parameters);
  var rData = '';

  docker.stdout.on('data', data => {
      rData += data.toString('utf8');
  });

  docker.on('error', function(err) {});

  docker.on('close', function(code) {
    setTimeout(function(){
      if(code === 0 && rData) {
        callback(true, rData);
      } else {
        callback(false, null);
      }
    }, 500);
  });
}

// Check if a container is running
function isRunning(callback) {
  exec('docker ps | grep heimdall',
    function(error, stdout, stderr) {
      if (error === null) {
        if(stdout && stdout.length) {
          callback(true);
        } else {
          callback(false);
        }

      } else {
        callback(false);
      }
  });
}

// Stops all running containers with heimdall in the name
function stopHeimdallContainers(callback) {
  exec('docker stop $(docker ps | grep heimdall | awk \'{print $1}\')',
    function(error, stdout, stderr) {
      if (error === null) {
        callback(true);
      } else {
        callback(false);
      }
  });
}

// Stops all containers 
function stopAll(callback) {
  isRunning(function(running){
    if(running) {
      stopHeimdallContainers(function(stopped) {
        if(stopped) {
          isRunning(function(running){
            if(running) {
              setTimeout(function(){
                stopAll(callback);
              }, 500);
            } else {
              callback(true);
            }
          });
        } else {
          callback(false);
        }
      });
    } else {
      callback(true);
    }
  });
};

exports.stopAll = stopAll;

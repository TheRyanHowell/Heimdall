'use strict';

// Define options and their defaults
const options = ['type', 'serviceAddress', 'servicePort'];
const defaults = [0, '127.0.0.1', '3000'];

// Save the options when valid
function saveOptions(e) {
  e.preventDefault();

  var data = {};
  options.forEach(function(value) {
    data[value] = document.querySelector("#" + value).value;
  });

  console.log(data);

  // Validate port as integer
  if(data.servicePort != parseInt(data.servicePort, 10)) {
    alert('Failed to update settings, port is not an integer.');
    return;
  }

  // Validate whitelist, blacklist
  data['whitelist'] = getNewList('whitelist');
  if(data['whitelist']) {
    data['blacklist'] = getNewList('blacklist');
    if(data['blacklist']) {
      // Store new settings
      browser.storage.local.set(data);

      // Restart background thread
      var sending = browser.runtime.sendMessage({restart: true});
      sending.then(function(m) {
        if(m && m.hasOwnProperty('restarted') && m.restarted) {
          alert('Updated settings.');
        } else {
          alert('Failed to update settings.');
        }
      }, function(e) {
        console.log(e);
        alert('Failed to update settings.');
      });
    }
  }
}

// Get the new list from html
function getNewList(type) {
  var list = document.getElementsByClassName(type + '-elem');
  var returnItems = [];
  for (var i = 0; i < list.length; i++) {
    if(list[i].value && list[i].value.length) {
      try {
          new RegExp(list[i].value);
          returnItems.push(list[i].value);
      } catch(e) {
        alert('"' + list[i].value + '" is not a valid regular expression.' + "\n\n" + e);
        return false;
      }
    }
  }

  if(!returnItems.length) {
    returnItems.push('');
  }

  return returnItems;
}

// Get the stored settings
function getStoredList(type, callback) {
  var getOption = browser.storage.local.get(type);
  getOption.then(function (result) {
    if(result.hasOwnProperty(type) && result[type]) {
      callback(result[type]);
    } else {
      callback(['']);
    }
  }, function (error) {
    callback(['']);
  });
}

// Load stored settings into html
function restoreOptions() {
  options.forEach(function(value, index) {
    var getOption = browser.storage.local.get(value);
    getOption.then(function (result) {
      document.querySelector("#" + value).value = result[value] || defaults[index];
    }, function (error) {
      console.log(error);
    });
  });

  // Render stored whitelist
  getStoredList('whitelist', function(result) {
    console.log(result);
    var whitelist = document.getElementById("whitelist");
    var before = document.getElementById("addWhitelist");
    result.forEach(function(value){
      console.log(value);
      var input = document.createElement('input');
      input.setAttribute('class', 'whitelist-elem browser-style');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', '(\.gov)(\.[a-z]{2})?$');
      input.setAttribute('value', value);
      whitelist.insertBefore(document.createElement('br'), before);
      whitelist.insertBefore(input, before);
    });
  });

  // Render stored blacklist
  getStoredList('blacklist', function(result) {
    console.log(result);
    var blacklist = document.getElementById("blacklist");
    var before = document.getElementById("addBlacklist");
    result.forEach(function(value){
      console.log(value);
      var input = document.createElement('input');
      input.setAttribute('class', 'blacklist-elem browser-style');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', '(\.gov)(\.[a-z]{2})?$');
      input.setAttribute('value', value);
      blacklist.insertBefore(document.createElement('br'), before);
      blacklist.insertBefore(input, before);
    });
  });
}

// Add a new item, bound to click of Add button
function addListItem(type, before) {
  var list = document.getElementById(type);
  var input = document.createElement('input');
  var before = document.getElementById(before);
  input.setAttribute('class', type + '-elem browser-style');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', '(\.gov)(\.[a-z]{2})?$');
  input.setAttribute('value', '');
  list.insertBefore(document.createElement('br'),before);
  list.insertBefore(input,before);
}

// Bind to page loaded
document.addEventListener('DOMContentLoaded', function() {
  // Bind add button events
  var addW = document.getElementById('addWhitelist');
  addW.addEventListener('click', function() {
      addListItem('whitelist', 'addWhitelist');
  });

  var addB = document.getElementById('addBlacklist');
  addB.addEventListener('click', function() {
      addListItem('blacklist', 'addBlacklist');
  });

  // Load current options
  restoreOptions();

  // Bind submit button event
  document.querySelector("form").addEventListener("submit", saveOptions);
});

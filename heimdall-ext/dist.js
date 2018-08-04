#!/usr/bin/env node
'use strict';
var fs = require('fs');

// Load the app manifest
var manifest = JSON.parse(fs.readFileSync('chromedist/manifest.json'));

// Strip firefox specific values
if(manifest.applications) {
  delete manifest.applications;
}

if(manifest.options_ui && manifest.options_ui.browser_style) {
  delete manifest.options_ui.browser_style;
}

// Write new manifest into chromedist folder
fs.writeFileSync('chromedist/manifest.json', JSON.stringify(manifest));

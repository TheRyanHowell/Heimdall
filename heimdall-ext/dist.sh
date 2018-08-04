#!/bin/bash
mkdir -p chromedist
cp manifest.json chromedist
cp *.html chromedist
cp *.css chromedist
cp -R dist chromedist
cp -R libs chromedist
cp -R bootstrap chromedist
cp -R icons chromedist

mkdir -p firefoxdist
cp manifest.json firefoxdist
cp *.html firefoxdist
cp *.css firefoxdist
cp -R dist firefoxdist
cp -R libs firefoxdist
cp -R bootstrap firefoxdist
cp -R icons firefoxdist

node dist.js

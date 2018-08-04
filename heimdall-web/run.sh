#!/bin/bash
docker run -d -p 3010:3010 -e "NODE_ENV=production" --init --rm --name heimdall-web heimdall-web


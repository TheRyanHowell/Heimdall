#!/bin/bash

docker pull andrewmichaelsmith/docker-heartbleed
docker rm heimdall-heartbleed -f
docker run -d -p 80:80 -p 443:443 --name heimdall-heartbleed andrewmichaelsmith/docker-heartbleed
docker stop heimdall-heartbleed

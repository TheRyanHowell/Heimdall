#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-http-noredirect -f
docker build -t heimdall-nginx-http-noredirect "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-http-noredirect heimdall-nginx-http-noredirect
docker stop heimdall-nginx-http-noredirect

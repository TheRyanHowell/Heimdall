#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlsciphers-intermediate -f
docker build -t heimdall-nginx-tlsciphers-intermediate "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlsciphers-intermediate heimdall-nginx-tlsciphers-intermediate
docker stop heimdall-nginx-tlsciphers-intermediate

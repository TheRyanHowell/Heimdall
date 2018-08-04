#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlsciphers-old -f
docker build -t heimdall-nginx-tlsciphers-old "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlsciphers-old heimdall-nginx-tlsciphers-old
docker stop heimdall-nginx-tlsciphers-old

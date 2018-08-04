#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlscert-untrusted -f
docker build -t heimdall-nginx-tlscert-untrusted "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlscert-untrusted heimdall-nginx-tlscert-untrusted
docker stop heimdall-nginx-tlscert-untrusted

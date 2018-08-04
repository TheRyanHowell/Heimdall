#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlscert-rsa3072 -f
docker build -t heimdall-nginx-tlscert-rsa3072 "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlscert-rsa3072 heimdall-nginx-tlscert-rsa3072
docker stop heimdall-nginx-tlscert-rsa3072

#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlscert-expired -f
docker build -t heimdall-nginx-tlscert-expired "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlscert-expired heimdall-nginx-tlscert-expired
docker stop heimdall-nginx-tlscert-expired

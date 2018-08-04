#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

mkdir -p "$DIR/certs"
CERTSDIR=$(readlink -e "$DIR/../../../test-certs")
cp -R $CERTSDIR/* "$DIR/certs"

docker rm heimdall-nginx-tlspfs-dh768 -f
docker build -t heimdall-nginx-tlspfs-dh768 "$DIR"

docker run -d -p 80:80 -p 443:443 --name heimdall-nginx-tlspfs-dh768 heimdall-nginx-tlspfs-dh768
docker stop heimdall-nginx-tlspfs-dh768

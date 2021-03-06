#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$DIR/heimdall-nginx-http/noredirect/build.sh
$DIR/heimdall-nginx-http/301/build.sh
$DIR/heimdall-nginx-http/302/build.sh
$DIR/heimdall-nginx-tlscert/expired/build.sh
$DIR/heimdall-nginx-tlscert/prime256v1/build.sh
$DIR/heimdall-nginx-tlscert/rsa512/build.sh
$DIR/heimdall-nginx-tlscert/rsa768/build.sh
$DIR/heimdall-nginx-tlscert/rsa1024/build.sh
$DIR/heimdall-nginx-tlscert/rsa2048/build.sh
$DIR/heimdall-nginx-tlscert/rsa3072/build.sh
$DIR/heimdall-nginx-tlscert/rsa4096/build.sh
$DIR/heimdall-nginx-tlscert/selfsigned/build.sh
$DIR/heimdall-nginx-tlscert/untrusted/build.sh
$DIR/heimdall-nginx-tlsciphers/modern/build.sh
$DIR/heimdall-nginx-tlsciphers/intermediate/build.sh
$DIR/heimdall-nginx-tlsciphers/old/build.sh
$DIR/heimdall-nginx-tlsciphers/discard/build.sh
$DIR/heimdall-nginx-tlspfs/prime256v1/build.sh
$DIR/heimdall-nginx-tlspfs/dh2048/build.sh
$DIR/heimdall-nginx-tlspfs/dh1024/build.sh
$DIR/heimdall-nginx-tlspfs/dh768/build.sh
$DIR/heimdall-nginx-tlspfs/dh512/build.sh
$DIR/heimdall-nginx-tlspfs/none/build.sh
$DIR/heimdall-heartbleed/build.sh

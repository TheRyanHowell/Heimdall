#!/bin/bash
set -e

SUBJ="/C=GB/ST=Heimdall/O=Heimdall"
BADSUBJ="/C=GB/ST=BadHeimdall/O=BadHeimdall"
if [ ! -f ca.key ]; then
    openssl genrsa -out ca.key 4096
fi

if [ ! -f ca.crt ]; then
    openssl req -new -x509 -key ca.key -out ca.crt -subj "$SUBJ"
fi

if [ ! -f badca.key ]; then
    openssl genrsa -out badca.key 4096
fi

if [ ! -f badca.crt ]; then
    openssl req -new -x509 -key badca.key -out badca.crt -subj "$BADSUBJ"
fi

if [ ! -f rsa4096.heimdall.local.crt ]; then
  openssl req -new -out rsa4096.heimdall.local.csr -config cert.conf -newkey 4096 -keyout rsa4096.heimdall.local.key
  openssl x509 -req -in rsa4096.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa4096.heimdall.local.crt
  cat ca.crt >> rsa4096.heimdall.local.crt
fi


if [ ! -f rsa3072.heimdall.local.crt ]; then
  openssl req -new -out rsa3072.heimdall.local.csr -config cert.conf -newkey 3072 -keyout rsa3072.heimdall.local.key
  openssl x509 -req -in rsa3072.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa3072.heimdall.local.crt
  cat ca.crt >> rsa3072.heimdall.local.crt
fi

if [ ! -f rsa2048.heimdall.local.crt ]; then
  openssl req -new -out rsa2048.heimdall.local.csr -config cert.conf -newkey 2048 -keyout rsa2048.heimdall.local.key
  openssl x509 -req -in rsa2048.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa2048.heimdall.local.crt
  cat ca.crt >> rsa2048.heimdall.local.crt
fi

if [ ! -f rsa1024.heimdall.local.crt ]; then
  openssl req -new -out rsa1024.heimdall.local.csr -config cert.conf -newkey 1024 -keyout rsa1024.heimdall.local.key
  openssl x509 -req -in rsa1024.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa1024.heimdall.local.crt
  cat ca.crt >> rsa1024.heimdall.local.crt
fi

if [ ! -f rsa768.heimdall.local.crt ]; then
  openssl req -new -out rsa768.heimdall.local.csr -config cert.conf -newkey 768 -keyout rsa768.heimdall.local.key
  openssl x509 -req -in rsa768.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa768.heimdall.local.crt
  cat ca.crt >> rsa768.heimdall.local.crt
fi

if [ ! -f rsa512.heimdall.local.crt ]; then
  openssl req -new -out rsa512.heimdall.local.csr -config cert.conf -newkey 512 -keyout rsa512.heimdall.local.key
  openssl x509 -req -in rsa512.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out rsa512.heimdall.local.crt
  cat ca.crt >> rsa512.heimdall.local.crt
fi


if [ ! -f selfsigned.heimdall.local.crt ]; then
  openssl req -x509 -newkey 4096 -config cert.conf -nodes -keyout selfsigned.heimdall.local.key -out selfsigned.heimdall.local.crt
fi

if [ ! -f untrusted.heimdall.local.crt ]; then
  openssl req -new -out untrusted.heimdall.local.csr -config cert.conf -newkey 4096 -keyout untrusted.heimdall.local.key
  openssl x509 -req -in untrusted.heimdall.local.csr -CA badca.crt -CAkey badca.key -CAcreateserial -out untrusted.heimdall.local.crt
  cat badca.crt >> untrusted.heimdall.local.crt
fi

if [ ! -f expired.heimdall.local.crt ]; then
  openssl req -new -out expired.heimdall.local.csr -config cert.conf -newkey 4096 -keyout expired.heimdall.local.key
  touch index.txt
  openssl ca -config ca.conf -policy signing_policy -extensions signing_req -startdate 20000101120000Z -enddate 20010101120000Z -out expired.heimdall.local.crt -infiles expired.heimdall.local.csr
  cat ca.crt >> expired.heimdall.local.crt
fi

if [ ! -f prime256v1.heimdall.local.crt ]; then
  openssl ecparam -genkey -name prime256v1 -out prime256v1.heimdall.local.key
  openssl req -new -out prime256v1.heimdall.local.csr -config cert.conf -key prime256v1.heimdall.local.key
  openssl x509 -req -in prime256v1.heimdall.local.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out prime256v1.heimdall.local.crt
  cat ca.crt >> prime256v1.heimdall.local.crt
fi

if [ ! -f dh2048.pem ]; then
  openssl dhparam -out dh2048.pem -outform PEM -2 2048
fi

if [ ! -f dh1024.pem ]; then
  openssl dhparam -out dh1024.pem -outform PEM -2 1024
fi

if [ ! -f dh768.pem ]; then
  openssl dhparam -out dh768.pem -outform PEM -2 768
fi

if [ ! -f dh512.pem ]; then
  openssl dhparam -out dh512.pem -outform PEM -2 512
fi

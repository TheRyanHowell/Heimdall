# heimdall-library
A library for Heimdall.

This component is a library used by other components that exposes a set of modules and a runner that can be used to scan a domain response.

## Quick start

Make sure you have [Node.js](https://nodejs.org) and OpenSSL installed, then type the following commands:
```bash
npm install
npm start
```

## Testing
Before you run the test suite you must build it at least once:
Generate certificates by running test-certs/gencerts.sh
Build the docker containers by running test-docker/build.sh

To run the test suite, type the following commands as root:
```bash
npm test
```

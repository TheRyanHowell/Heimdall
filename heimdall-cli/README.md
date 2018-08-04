# heimdall-cli

A CLI application for Heimdall.

This component is a CLI application that runs the Heimdall library based on the input given.

## Screenshot
![Command Line Interface](https://box.rhowell.io/gogs/ryan/heimdall/raw/master/screenshots/cli.png)

## Quick start

Make sure you have [Node.js](https://nodejs.org) and OpenSSL installed, then type the following commands:
```bash
npm install
npm run-script build
```

The dist folder will then contain binaries you can run.

You can also run the file directly with node:
```bash
$ ./heimdall.js -h

  Usage: heimdall scan example1.com http://example2.com https://example3.com


  Options:

    -V, --version            output the version number
    -m  --mode <mode>        Mode of scan (quick, full), defaults to quick.
    -t  --type <type>        Type of scan (passive, active, aggressive), defaults to passive.
    -h, --help               output usage information


  Commands:

    scan <url> [otherUrls...]
```

## Benchmarking
Modify benchmark.sh with a relevant domain, then run the script, this will generate a CSV for 10 minutes with the time to complete in seconds.

#!/bin/bash
end=$(date -ud "10 minutes" +%s)
while [[ $(date -u +%s) -le $end ]]
do
    ts=$(date +%s%N) ; node heimdall.js scan -m full -t aggressive example.com ; tt=$((($(date +%s%N) - $ts)/1000000)) ; echo "$tt" >> benchmark.csv
done

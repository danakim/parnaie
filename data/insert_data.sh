#!/bin/bash

#KEY=0
#while read -r line; do
#    ((KEY++))
#    redis-cli SET ${KEY} "${line}"
#done < dictionar.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'adj' {'print $1'})
    DEF=$(echo ${line} | awk -F 'adj' {'print $2'})
    redis-cli SET "${TEXT}" "adj ${DEF}"
done < dictionar_adj.txt

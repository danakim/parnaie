#!/bin/bash

file="./data.txt"
while IFS= read -r line
do
    echo $line | awk '{print substr($0,0,4)}'
    redis-cli HMSET $line
done <"$file"
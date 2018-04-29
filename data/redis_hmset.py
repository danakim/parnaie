#!/usr/bin/env python

import redis
import ast

r = redis.Redis(host='localhost')

with open('./data.txt') as f:
    for line in f:
        line = line.replace(' id:', '')
        line = line.split(' ', 1)
        key = line[0]
        data = line[1].replace(' "', '": "').replace('" ', '", "').replace('full', '"full').rstrip()
        data = "{" + data + "}"
        value = ast.literal_eval(data)
        r.hmset(key, value)

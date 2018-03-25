#!/bin/bash

#KEY=0
#while read -r line; do
#    ((KEY++))
#    redis-cli SET ${KEY} "${line}"
#done < dictionar.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 's.n.' {'print $1'})
    DEF=$(echo ${line} | awk -F 's.n.' {'print $2'})
    redis-cli SET "${TEXT}" "s.n. ${DEF}"
done < dictionar_sn.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 's.m.' {'print $1'})
    DEF=$(echo ${line} | awk -F 's.m.' {'print $2'})
    redis-cli SET "${TEXT}" "s.m. ${DEF}"
done < dictionar_sm.txt

while read -r line; do
    text=$(echo ${line} | awk -F 's.f.' {'print $1'})
    def=$(echo ${line} | awk -F 's.f.' {'print $2'})
    redis-cli set "${text}" "s.f. ${def}"
done < dictionar_sf.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'vb.' {'print $1'})
    DEF=$(echo ${line} | awk -F 'vb.' {'print $2'})
    redis-cli SET "${TEXT}" "vb. ${DEF}"
done < dictionar_vb.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'adj' {'print $1'})
    DEF=$(echo ${line} | awk -F 'adj' {'print $2'})
    redis-cli SET "${TEXT}" "adj ${DEF}"
done < dictionar_adj.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'interj.' {'print $1'})
    DEF=$(echo ${line} | awk -F 'interj.' {'print $2'})
    redis-cli SET "${TEXT}" "interj. ${DEF}"
done < dictionar_interj.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 's.f.sg' {'print $1'})
    DEF=$(echo ${line} | awk -F 's.f.sg' {'print $2'})
    redis-cli SET "${TEXT}" "s.f.sg. ${DEF}"
done < dictionar_sfsg.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'expr.' {'print $1'})
    DEF=$(echo ${line} | awk -F 'expr.' {'print $2'})
    redis-cli SET "${TEXT}" "expr. ${DEF}"
done < dictionar_expr.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 'adv.' {'print $1'})
    DEF=$(echo ${line} | awk -F 'adv.' {'print $2'})
    redis-cli SET "${TEXT}" "adv. ${DEF}"
done < dictionar_adv.txt

while read -r line; do
    TEXT=$(echo ${line} | awk -F 's.m.pl' {'print $1'})
    DEF=$(echo ${line} | awk -F 's.m.pl' {'print $2'})
    redis-cli SET "${TEXT}" "s.m.pl. ${DEF}"
done < dictionar_smpl.txt

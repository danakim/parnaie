#!/bin/bash

cat dictionar.txt | grep 's.n.' > dictionar_sn.txt
cat dictionar.txt | grep 's.m.' > dictionar_sm.txt
cat dictionar.txt | grep 's.f.' > dictionar_sf.txt
cat dictionar.txt | grep 'vb.' > dictionar_vb.txt
cat dictionar.txt | grep 'adj.' > dictionar_adj.txt
cat dictionar.txt | grep 'interj.' > dictionar_interj.txt
cat dictionar.txt | grep 's.f.sg' > dictionar_sfsg.txt
cat dictionar.txt | grep 'expr.' > dictionar_expr.txt
cat dictionar.txt | grep 'adv.' > dictionar_adv.txt
cat dictionar.txt | grep 's.m.pl' > dictionar_smpl.txt

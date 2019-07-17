#! /bin/bash

rm -f mockup.sqlite
csvs-to-sqlite ../csv/*.csv mockup.sqlite

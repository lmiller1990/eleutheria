#!/usr/bin/zsh
for i in {1..10}; do 
echo "Run #$i";
yarn cypress run --config video=false --e2e;
done

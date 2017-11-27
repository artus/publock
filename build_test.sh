#!/usr/bin/env sh

#
# You can use this file to automatically compile the TypeScript files and run all tests afterwards.
#

# Compile TypeScript files.
tsc

# Bundle all with browserify for use in webpages.
browserify target/Publock.js -o target/bundle.js

# run tests after compilation.
node target/MessageChainTests
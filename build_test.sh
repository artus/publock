#!/usr/bin/env sh

#
# You can use this file to automatically compile the TypeScript files and run all tests afterwards.
#

# Compile TypeScript files.
tsc

# run tests after compilation.
node target/MessageChainTests
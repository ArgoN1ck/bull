#!/bin/bash
set -e

cd ..
npm run jest -- --config jest.config.ts --detectOpenHandles --forceExit --passWithNoTests --reporters=default --reporters=jest-junit --includeConsoleOutput=true

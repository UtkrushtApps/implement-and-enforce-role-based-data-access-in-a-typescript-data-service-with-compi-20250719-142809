#!/bin/bash
set -e

./install.sh

echo "[run.sh] Running tests..."
npm run test

echo "[run.sh] Done."

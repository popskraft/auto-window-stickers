#!/usr/bin/env bash
set -euo pipefail

# create venv if missing
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

# install deps
./.venv/bin/python -m pip install -r requirements.txt

# run generator
./.venv/bin/python generate-pages.py --config config.yaml "$@"

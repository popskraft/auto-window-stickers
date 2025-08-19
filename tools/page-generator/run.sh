#!/usr/bin/env bash
set -euo pipefail

# Resolve repo root (two levels up from this script)
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." &>/dev/null && pwd)"

VENV_DIR="${REPO_ROOT}/.venv"
REQ_FILE="${SCRIPT_DIR}/requirements.txt"
CONFIG_FILE="${SCRIPT_DIR}/config.yaml"
GENERATOR="${SCRIPT_DIR}/generate-pages.py"

# Use repo venv's python if present, else system python3
if [ -x "${VENV_DIR}/bin/python" ]; then
  PY="${VENV_DIR}/bin/python"
else
  PY="python3"
fi

# Create venv at repo root if missing
if [ ! -d "${VENV_DIR}" ]; then
  python3 -m venv "${VENV_DIR}"
fi

# Install deps (requirements file lives next to this script)
"${PY}" -m pip install -r "${REQ_FILE}"

# Run generator with explicit base path to repo root
"${PY}" "${GENERATOR}" --config "${CONFIG_FILE}" --base-path "${REPO_ROOT}" "$@"

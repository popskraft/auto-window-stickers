#!/usr/bin/env python3
"""
Hugo Page Generation Script for Auto Window Stickers - Root Wrapper

This is a convenience wrapper that delegates to the actual generator
located in tools/page-generator/generate-pages.py.

Usage: python generate-pages.py [--type product|article] [--seed SEED] [--limit LIMIT] [--dry-run]
"""

import sys
import subprocess
from pathlib import Path


def main():
    """Wrapper delegating to consolidated generator in tools/page-generator."""
    base = Path(__file__).parent
    wrapper_script = base / "tools" / "page-generator" / "generate-pages.py"
    wrapper_cfg = base / "config.yaml"
    
    if not wrapper_script.exists():
        print(f"Error: consolidated generator not found at {wrapper_script}")
        print(f"Expected location: {wrapper_script.absolute()}")
        sys.exit(1)
    
    # Force base-path to the repo root (this file's directory) so relative
    # paths in the shared config resolve correctly when called via wrapper.
    args = [
        sys.executable,
        str(wrapper_script),
        "--config", str(wrapper_cfg),
        "--base-path", str(base),
    ] + sys.argv[1:]
    
    sys.exit(subprocess.call(args))


if __name__ == "__main__":
    main()

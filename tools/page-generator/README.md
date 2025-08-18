# Page Generator (Portable)

Self-contained Hugo page generator for the Auto Window Stickers site. This folder can be copied as-is to another project and configured via YAML.

## Contents
- `generate-pages.py` — generator script
- `config.yaml` — portable configuration
- `requirements.txt` — Python dependencies (PyYAML)
- `run.sh` — helper to create a local venv and run the generator

## Requirements
- Python 3.10+ recommended
- If you use the helper: bash and venv available on your system

## Quick Start (recommended)
From `tools/page-generator/`:
```bash
chmod +x run.sh
./run.sh --dry-run --limit 5
# then full run
./run.sh
```

The helper will:
1) Create `.venv/` in this folder (if missing)
2) Install `requirements.txt`
3) Run `generate-pages.py --config config.yaml` with your CLI args

## Alternative: use project-level venv
If you already have a venv at the repo root (e.g., `.venv/`), run directly:
```bash
../../.venv/bin/python generate-pages.py --config config.yaml --dry-run --limit 5
../../.venv/bin/python generate-pages.py --config config.yaml
```

## Alternative: run from repo root (wrapper)
In the repo root there is a convenience wrapper `generate-pages.py` that delegates to this portable copy and forces the correct base path:
```bash
.venv/bin/python generate-pages.py --dry-run --limit 5
.venv/bin/python generate-pages.py
```

## Configuration Reference (`config.yaml`)

All paths below (except `execution.base_path`) are interpreted relative to `execution.base_path`.

```yaml
execution:
  seed: 42                  # random seed (optional)
  limit: 2                  # limit pages to generate (optional)
  dry_run: false            # only print actions (optional)
  base_path: "../.."          # path to Hugo site root (from this folder)
  output_dir: "content"      # path to write generated pages (relative to base_path)

content:
  savings_count: 1
  benefits_count: 6
  faq_count: 10
  testimonials_count: 3
  default_saving_number: "3500"

seo:
  seo_keywords_file: "data/content-generator/keywords-seotitle.yaml"  # used ONLY for seoTitle
  content_keywords_file: "data/content-generator/keywords.yaml"       # used for [[keyword]] substitutions
  title_template: "{product_title} — {keyword} {state}"

pages:
  layout: "product"
  filename_pattern: "{state_slug}/{product_key}/index.md"

data_sources:
  products_dir: "data/products"
  states_file: "data/content-generator/states.yaml"
```

Notes:
- `state_slug` is derived by lowercasing and replacing spaces with dashes.
- Generated files will be placed in `execution.base_path` + `execution.output_dir` + `pages.filename_pattern`.
- Follows the rule: `keywords-seotitle.yaml` is used only for SEO title; `keywords.yaml` for all `[[keyword]]` placeholders.

## CLI Arguments
The script accepts these arguments (they override the config values):
- `--config <path>` — path to a YAML config (default: `config.yaml` in this folder)
- `--seed <int>`
- `--limit <int>`
- `--dry-run`
- `--base-path <path>` — root of the Hugo site; affects all relative paths in config

Examples:
```bash
# Preview 3 pages without writing files
./run.sh --dry-run --limit 3

# Full run (writes pages)
./run.sh

# Custom seed for reproducible selection
./run.sh --seed 123

# Run directly with project venv
../../.venv/bin/python generate-pages.py --config config.yaml --dry-run --limit 5

# Run from repo root (wrapper)
.venv/bin/python generate-pages.py --dry-run --limit 5
```

## Troubleshooting
- "Not a Hugo site directory":
  - Ensure `execution.base_path` points to a folder that contains `hugo.yaml` or `config.yaml` of your Hugo site.
- Paths not found (states/products/keywords):
  - Check that `data_sources.*` and `seo.*` paths exist under `execution.base_path`.
- No products loaded:
  - Verify YAML files exist in `data/products/` and have `.yaml` extension.
- Empty content pools:
  - Check `data/content-generator/content/product/*.yaml` presence.

## Development Notes
- PyYAML is required and pinned in `requirements.txt`.
- This folder is designed to be portable; keep relative paths in `config.yaml` to maintain portability.

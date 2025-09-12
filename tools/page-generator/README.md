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

## Quick Start (recommended): use the repo root venv
From the repo root (`/path/to/auto-window-stickers`), install deps into the root venv and run via the root wrapper:
```bash
./.venv/bin/python -m pip install -r tools/page-generator/requirements.txt
./.venv/bin/python generate-pages.py --dry-run --limit 5
./.venv/bin/python generate-pages.py
```

This uses a single virtual environment at the repo root and delegates to this portable generator internally.

## Alternative: portable helper (creates a nested venv)
From `tools/page-generator/` you can use the helper that sets up a local venv only for this tool:
```bash
chmod +x run.sh
./run.sh --dry-run --limit 5
./run.sh
```

What it does:
1) Creates `tools/page-generator/.venv/` if missing
2) Installs `requirements.txt`
3) Runs `generate-pages.py --config config.yaml` with your CLI args

Note: This uses a nested venv distinct from the repo root venv. Avoid mixing both approaches in the same session to prevent confusion.

## Alternative: run from repo root (wrapper)
In the repo root there is a convenience wrapper `generate-pages.py` that delegates to this portable copy and forces the correct base path:
```bash
.venv/bin/python generate-pages.py --dry-run --limit 5
.venv/bin/python generate-pages.py
```

## Generating products vs articles

The generator supports two modes via `--type`:

- `product` (default): generates state-by-product pages.
- `article`: generates per-product articles using article blocks and titles.

Commands (using the root venv and wrapper):

```bash
# Products only
./.venv/bin/python generate-pages.py --type product --dry-run --limit 5
./.venv/bin/python generate-pages.py --type product

# Articles only
./.venv/bin/python generate-pages.py --type article --dry-run --limit 5
./.venv/bin/python generate-pages.py --type article
```

Outputs:

- Products: `content/states/{state-slug}/{product-key}/index.md` (controlled by `pages.filename_pattern` in `tools/page-generator/config.yaml`).
- Articles: `content/articles/<product-slug>/<article-slug>/index.md`.

Article inputs:

- Titles list: `data/content-generator/articles.yaml` (YAML key: `articles: ["Title 1", ...]`).
- Block files: `data/content-generator/content/article/*.yaml` (numbered files; one item is chosen from each file).

Article rendering details:

- Generated article front matter includes `image_cover`, `image_body`, and `image_body_alt` (defaults to the article title).
- The article body injects the `figureproc` shortcode after block 2 and passes `alt` from `image_body_alt`:
  `{{< figureproc src="/{{< param image_body >}}" alt="{{< param image_body_alt >}}" >}}`

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
# Root venv (recommended)
./.venv/bin/python -m pip install -r tools/page-generator/requirements.txt
./.venv/bin/python generate-pages.py --dry-run --limit 5
./.venv/bin/python generate-pages.py

# Portable helper (nested venv)
cd tools/page-generator && ./run.sh --dry-run --limit 3 && ./run.sh
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

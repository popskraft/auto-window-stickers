# Content Generator: Data Schema and Usage Instructions

This document defines the page variables (front matter) and data conventions for the upcoming content generation script. The script itself will be added later; this file prepares the project structure and rules so content/data can be finalized now.


## Page front matter schema (product-state pages)

Target path per generated page:
- `content/states/<state-slug>/<product-file>/index.md`

Layout used by templates:
- Default: `layout: "product-state"` (configurable)

Front matter variables used by the theme/templates:

```yaml
---
layout: "product-state"
# seoTitle is optional and may be omitted; can be enabled by config later
# seoTitle: ""

# Savings block (single)
savings:
  headline: ""
  subtitle: ""
  summary: ""
  # Filename only; image must exist in assets/images/products/
  # Example: assets/images/products/<image-file>
  image_file: ""

# Benefits block (collection)
benefits:
  headline: ""           # Section title
  items:                  # Exactly 6 items selected by the generator
    - title: ""
      summary: ""
    # (total 6 items)

# FAQ block (collection)
faq:
  items:                  # Exactly 10 Q/A items selected by the generator
    - question: ""
      answer: ""
    # (total 10 items)

# Optional metadata for traceability; the generator may add these later
# generated:
#   state: "Texas"
#   product: "exterior-addendum-blank"
#   seed: 12345
#   created_at: "2025-08-17"
#   updated_at: "2025-08-17"
---
```

Notes:
- Only new content variables live in the page front matter. Product properties (e.g., product title) come from `data/products/*.yaml` and should not be duplicated in the page front matter.
- Images referenced by `savings.image_file` must be placed under `assets/images/products/`.


## Data sources (pools) for random selection

The generator will draw content from YAML pools under:
- `data/content-generator/content/product/`
- `data/content-generator/content/article/`

Recommended files:
- Benefits pool: `data/content-generator/content/product/benefits.yaml`
  - Schema (array of entries):
    ```yaml
    - title: "Why Choose [[product]]?"
      summary: "... includes optional [[keyword]] and [[state]] placeholders ..."
    - title: "..."
      summary: "..."
    ```
- FAQ pool: `data/content-generator/content/product/faq.yaml`
  - Schema (array of entries):
    ```yaml
    - question: "..."
      answer: "..."
    - question: "..."
      answer: "..."
    ```
- Savings templates (optional): `data/content-generator/content/product/savings.yaml`
  - If provided, may include multiple variants; otherwise the generator can compose `savings` from product data or simple templates.
  - Schema options:
    ```yaml
    - headline: "..."
      subtitle: "..."
      summary: "..."
      image_file: "example.png"
    ```

Other inputs:
- Products: `data/products/*.yaml` (must include `title` for [[product]] substituion)
- States: configurable path, default example `data/content-generator/states.yaml` (must include `label` for [[state]])
- Keywords: `data/content-generator/keywords.yaml` (YAML list of strings)


## Placeholder substitutions

- `[[product]]` → product `title` from `data/products/*.yaml`
- `[[state]]` → state `label` from `states.yaml`
- `[[keyword]]` → random picks from `data/content-generator/keywords.yaml`

All substitutions happen inside the selected pool items before writing the page.


## Selection rules and quotas (for the generator)

- Benefits: exactly 6 items chosen randomly from the benefits pool (without editing text). If pool has fewer than 6 items, generation fails with a clear error.
- FAQ: exactly 10 items chosen randomly from the FAQ pool.
- Keywords distribution:
  - By default a limited unique set per page (configurable). If placeholders exceed the limit, the extra placeholders are left blank or removed based on config.
- Determinism: a `--seed` option will fix random choices for reproducibility.


## File locations summary

- Pools:
  - `data/content-generator/content/product/benefits.yaml`
  - `data/content-generator/content/product/faq.yaml`
  - `data/content-generator/content/product/savings.yaml` (optional)
- Keywords: `data/content-generator/keywords.yaml`
- States: e.g., `data/content-generator/states.yaml` (path is configurable)
- Products: `data/products/*.yaml`
- Images for savings: `assets/images/products/`
- Archetype used by templates: `archetypes/product.md`


## Configuration (to be added with the script)

Two layers:
- Global config: `_content-generator/config.yaml`
- Run config (override): use `--config run-config.yaml`

Example fields (subject to refinement when the script is added):
```yaml
paths:
  products_dir: data/products
  states_file: data/content-generator/states.yaml
  keywords_file: data/content-generator/keywords.yaml
  content_root: data/content-generator/content
  output_root: content/states
  archetype_file: archetypes/product.md

render:
  layout: product-state
  include_seo_title: false
  seo_title_template: "[[product]] car window stickers"
  keywords_per_page: 2
  keywords:
    unique_per_page: true
    fill_all_placeholders: false
    allow_repeats_if_insufficient: true

rules:
  benefits:
    count: 6
  faq:
    count: 10

overwrite:
  default: skip  # skip, overwrite
logging:
  to_file: true
  level: info
```


## Future CLI (reference only; the script will be added later)

- Generate all states for selected products (dry-run first):
  ```bash
  python _content-generator/generate_pages.py \
    --products "exterior-addendum-blank,exterior-addendum-custom" \
    --all-states \
    --dry-run
  ```
- Deterministic run:
  ```bash
  python _content-generator/generate_pages.py --seed 12345 --all-states --products "exterior-addendum-blank"
  ```
- With run config override:
  ```bash
  python _content-generator/generate_pages.py --config run-config.yaml --all-states --products exterior-addendum-blank
  ```


## Validation checklist (before the script exists)

- [ ] Ensure benefits pool has at least 6 items
- [ ] Ensure FAQ pool has at least 10 items
- [ ] Place images in `assets/images/products/` and reference only filenames in `savings.image_file`
- [ ] Verify products exist in `data/products/` and have `title`
- [ ] Confirm states file has `label` values
- [ ] Fill keywords list in `data/content-generator/keywords.yaml`

When you finish adjusting data files, let me know and I will scan changes and proceed to implement the script.

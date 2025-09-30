# Auto Window Stickers Handbook

## Overview
- Static site powered by Hugo Extended v0.140.2, styled with Tailwind CSS v3.3.0, deployed on Netlify.
- Goal: market exterior and interior window stickers sold via AK Dealer Services.
- Codebase lives in this repo; Netlify builds use `hugo --gc --minify` with base URL `https://autowindowstickers.com/`.

## Repository Map
```
archetypes/              # Markdown front-matter templates for Hugo
assets/                  # Tailwind source, JS, and image assets processed by Hugo
content/                 # Markdown pages (homepage, interior/exterior, states, articles)
data/products/           # Product YAML (pricing, features, images)
data/content-generator/  # Content pools, keywords, states list for generators
layouts/                 # Hugo templates and partials
static/                  # Passthrough static files (images, video)
tools/page-generator/    # Portable Python generator + config
README/                  # Documentation (this handbook)
```

## Development Workflow
- **Prerequisites:** Node.js ≥16, npm ≥8, Hugo Extended v0.140.2, Git.
- **Install:** `npm install`
- **Local preview:**
  - `npm run dev:all` → Hugo server + Tailwind watcher (http://localhost:1313)
  - `npm run dev` → Hugo only (useful if CSS already built)
- **Tailwind builds:** `npm run tailwind:watch` (dev) / `npm run tailwind:build` (prod bundle in `assets/tailwindstyle.css`)
- **Production build:** `npm run build` (outputs to `public/`)

## Python Environment
- Create a dedicated virtualenv once: `python3 -m venv .venv`
- Activate it (`source .venv/bin/activate`) or call executables directly via `./.venv/bin/...`.
- Install generator dependencies: `./.venv/bin/pip install -r tools/page-generator/requirements.txt`.
- Update requirements after pulling changes: rerun the install command if `requirements.txt` changes.
- Portable workflow: from `tools/page-generator/`, run `./run.sh` (it bootstraps its own `.venv/`).

## Content Model
- **Product data (`data/products/*.yaml`):** authoritative attributes such as `title`, `size`, `price`, `features`, gallery `images`, and `purchase_links`. Reused across every placement of that SKU.
- **Product pages (`content/exterior|interior/*.md`):** Markdown front matter plus any page-specific copy. Default template is `layouts/_default/product.html`, which pairs page params with data files.
- **State landing pages (`content/states/**/index.md`):** Generated or manual blends targeted to individual US states.
- **Shared pools (`data/content-generator/content/product/*.yaml`):** 50-item lists for savings, benefits, FAQ, testimonials; placeholders `[[product]]`, `[[state]]`, `[[keyword]]` get substituted during generation.
- **Keywords and states:** `data/content-generator/keywords.yaml` and `states.yaml` feed the generators.

## Editing Workflow
1. **Branching:** create a feature branch off `main` (`git checkout -b feature/short-name`).
2. **Product edits:**
   - Adjust global facts in `data/products/<product>.yaml` (prices, imagery, links).
   - Update visible copy in `content/<area>/<product>.md`; keep front matter consistent with archetype `archetypes/product.md`.
3. **Other pages:** edit relevant Markdown in `content/` or partials in `layouts/`.
4. **Quality checks:** run `npm run build` before committing to catch Hugo or template errors.
5. **Commit & push:** concise commit message, push branch, open PR. Netlify previews will build automatically.

## Automation & Scripts
- **Root generator (`generate-pages.py`):** Python 3 script that expands product-state pages using the config in `config.yaml`. Common commands (after virtualenv setup):
  - `npm run generate:pages:dry` (shortcut for `python3 generate-pages.py --dry-run --limit 5`)
  - `npm run generate:pages` (full run; add flags as needed)
- **Portable copy (`tools/page-generator/`):** contains standalone config, requirements, and `run.sh` helper for isolated environments.
- **Bootstrap scripts:**
  - `create-product.sh "Product Name" [exterior|interior]` → creates Markdown + YAML from archetypes.
  - `product-data-generator.sh "Product Name" [exterior|interior]` → YAML only.
- **Config highlights (`config.yaml`):** control random seed, limits, output paths, and counts for savings/benefits/faq/testimonials blocks.

## YAML Standards & Validation
- Always use two-space indentation; avoid tabs.
- Multi-line text (`summary`, `answer`, `description`) uses literal block style `|`.
- Simple scalar strings without special characters stay plain.
- Placeholder tokens must remain `[[product]]`, `[[state]]`, `[[keyword]]`, `[[saving_number]]`.
- Latest audit (`data/content-generator/content/product/*.yaml`) confirmed 50 well-formed entries per pool with UTF-8 encoding and no syntax issues.

## Deployment Notes
- Netlify build command: `hugo --gc --minify`; publish directory `public/`.
- Environment variables pin Hugo version (`HUGO_VERSION=0.140.2`) and base URL (production context).
- Security headers and cache policies defined in `netlify.toml`.
- For manual deploys, run `npm run tailwind:build` then `npm run build`, and upload `public/` to the target host.

## Support Checklist
- Keep Hugo/Node versions in sync with `package.json` and Netlify config.
- Add optimized images to `assets/images/...` so Hugo Pipes can fingerprint and resize.
- Document major changes in pull requests; coordinate with the distributor on pricing updates.

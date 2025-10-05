# Project Setup

## Requirements
- Hugo Extended 0.140.2 or newer
- Node.js 16 or newer with npm
- Python 3.10+ for the content generator
- Git and a terminal with Bash available

## First-Time Installation
1. Clone the repository and move into the project folder.
2. Install Node dependencies with `npm install`.
3. Create a Python virtual environment: `python3 -m venv .venv`.
4. Activate it (`source .venv/bin/activate`) and install generator packages with `pip install -r tools/page-generator/requirements.txt`.
5. Run `npm run dev:all` once to confirm Hugo and Tailwind build correctly.

## Daily Workflow
- Start from an updated `main` branch and create a feature branch for your work.
- Use `npm run dev:all` for live reload or `npm run dev` if CSS is already built.
- Regenerate Tailwind assets with `npm run tailwind:build` before production builds.
- Verify changes with `npm run build`; Hugo will write the site to `public/`.
- Commit, push, and open a pull request. Netlify will create a preview build automatically.

## Directory Reference
- `archetypes/` — front matter templates used by `hugo new` and helper scripts.
- `assets/` — Tailwind input files, JavaScript, and processed images.
- `content/` — page bundles (`index.md` plus bundle assets) for the live site.
- `data/products/` — YAML records of each product that templates and generators share.
- `data/content-generator/` — content pools, keywords, and state lists for automated pages.
- `layouts/` — base templates, partials, and shortcodes.
- `static/` — passthrough files copied without processing.
- `tools/page-generator/` — Python code for automatic page generation.

## Build and Deploy Notes
- Production builds use `npm run build`, which runs Hugo with garbage collection and minification.
- Netlify settings in `netlify.toml` define headers, redirects, and environment specific overrides.
- Scheduled deployments rely on GitHub Actions calling a Netlify build hook; update secrets in GitHub if the hook changes.
- For local QA of scheduled content run `hugo server --buildFuture` so future publish dates are visible.

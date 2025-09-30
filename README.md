# Auto Window Stickers

Hugo-based marketing site for exterior and interior car window stickers. All extended documentation now lives in `README/`.

## Run the site locally
1. Install dependencies once: `npm install`
2. Option A — everything with live CSS: `npm run dev:all`
3. Option B — Hugo only: `npm run dev`
4. Production build: `npm run build`

The commands require Hugo extended v0.140.2 and Node.js ≥16.

## Editing through GitHub
1. Fork or branch from `main`, then clone locally.
2. Product pages pull data from two sources:
   - YAML in `data/products/<product>.yaml` (shared specs, pricing, gallery).
   - Markdown in `content/<area>/<product>.md` (page text/front matter).
   Update both sides when changing SKUs.
3. Commit with clear messages, push your branch, open a pull request, and let Netlify run the preview build.

## Content generators
- Create a Python virtualenv (`python3 -m venv .venv`) and install deps: `./.venv/bin/pip install -r tools/page-generator/requirements.txt`.
- Run deterministic dry runs with `npm run generate:pages:dry`; switch to `npm run generate:pages` for full output.

Use the handbook in `README/handbook.md` for detailed structure, automation, and YAML rules.

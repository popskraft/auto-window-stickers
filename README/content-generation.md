# Content Generation Guide

This guide covers both manual edits and the automated script that creates hundreds of state level product pages.

## Create or Update a Product Page Manually
1. Decide whether the product is interior or exterior.
2. Run `./create-product.sh "Product Name" interior` (or `exterior`) to scaffold the bundle and data file.
   - Creates `content/<category>/<category>-<slug>/index.md` with starter front matter.
   - Creates `data/products/<category>-<slug>.yaml` with editable product facts.
3. Open the new files and fill in copy, pricing, and purchase links. Keep indentation at two spaces in YAML.
4. Add images to the `assets/images/<category>/` folder as needed.
5. Preview locally with `npm run dev:all` and visit `/interior/<category>-<slug>/` or `/exterior/<category>-<slug>/`.

## Generate State Specific Pages Automatically
1. Adjust `config.yaml` if needed:
   - `execution.limit` controls how many combinations to build (`null` = unlimited).
   - `content` section chooses how many savings, benefits, FAQ, and testimonials snippets each page receives.
   - `scheduling` sets the start timestamp, delay between pages, and whether scheduling applies to products or articles.
2. Ensure the Python environment is active (`source .venv/bin/activate`).
3. Run the wrapper script from the repo root:
   - Full run: `python generate-pages.py --type product`
   - Test run: `python generate-pages.py --type product --limit 5 --dry-run`
4. Generated files land under `content/states/<state>/<product>/index.md`. The script skips files that already exist.
5. Inspect a few outputs to confirm front matter, canonical paths, and substituted text look correct.

## Scheduling and Publishing
- Generated pages include `publishDate` and `date` so Hugo can release them gradually.
- Production builds run with `buildFuture: false`, meaning only entries with `publishDate` in the past are exposed.
- To preview future entries locally run `hugo server --buildFuture`.
- A GitHub Actions workflow (`.github/workflows/scheduled-build.yml`) calls the Netlify build hook each morning. Update the cron schedule or Netlify hook URL there when plans change.
- Store the Netlify hook in the `NETLIFY_BUILD_HOOK_URL` repository secret. Regenerate the secret if the Netlify hook is recreated.

## Validation Checklist
- After generating content, run `npm run build` to ensure Hugo parses every new file.
- Spot check `publishDate` ordering with `find content/states -name index.md | head -5 | xargs grep publishDate`.
- Confirm Netlify deploys include the expected number of pages once their scheduled time passes.
- When updating generator logic, commit changes to `config.yaml` and `tools/page-generator/` together so future runs stay in sync.

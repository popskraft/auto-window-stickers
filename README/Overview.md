# Overview

## Project Snapshot
- Static marketing site for Auto Window Stickers built with Hugo Extended 0.140.2 and Tailwind CSS.
- Deploys on Netlify; production builds run `hugo --gc --minify` and publish the generated `public/` directory.
- Content lives in Hugo page bundles and YAML data files so product details can be reused across hundreds of pages.

## How the Site Is Structured
- `content/` holds bundled Markdown pages (`index.md` plus optional bundle assets).
- `data/products/` stores canonical product facts that templates and generators read.
- `tools/page-generator/` contains the Python generator that assembles state specific product pages.
- `assets/` and `layouts/` define styling and Hugo templates; `static/` contains passthrough files.

## Documentation Map
- [project-setup.md](project-setup.md) — install requirements, run local builds, and understand the repository layout.
- [content-generation.md](content-generation.md) — add pages manually and run the automated generator with scheduling.
- [internal-linking.md](internal-linking.md) — link structure expectations for navigation, products, states, and articles.
- [hreflang-guide.md](hreflang-guide.md) — maintain alternate language and region tags for state pages.
- [content-strategy-notes.md](content-strategy-notes.md) — working notes for future copy improvements.

## Quick FAQ
- **Where do I change copy for an existing product page?** Edit the bundle under `content/exterior/` or `content/interior/` and update matching YAML in `data/products/` if shared details change.
- **How do I generate new state pages?** Follow the checklist in `content-generation.md`; it covers configuration, running the Python script, and scheduling deployments.
- **How do scheduled publishes appear in development?** Run `hugo server --buildFuture` so Hugo shows future dated pages locally.
- **Where are automation settings defined?** Netlify build settings live in `netlify.toml`, GitHub Actions workflows are under `.github/workflows/`, and generator options are centralised in `config.yaml`.

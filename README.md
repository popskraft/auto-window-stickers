# Auto Window Stickers

Static marketing site for exterior and interior window sticker products built with Hugo.

## Documentation
- [README/Overview.md](README/Overview.md) gives a high level tour of the project and where to find things.
- [README/project-setup.md](README/project-setup.md) covers prerequisites, installation, and deployment notes.
- [README/content-generation.md](README/content-generation.md) explains how to add pages manually and with the generator.
- [README/internal-linking.md](README/internal-linking.md) outlines linking patterns for navigation and content.
- [README/hreflang-guide.md](README/hreflang-guide.md) summarises alternate language tag requirements.

## Quick Start

### Local development
```bash
npm install
npm run dev:all
# Open http://localhost:1313
```

### Generate sample content
```bash
python generate-pages.py --type product --limit 2 --dry-run
```

### Production build
```bash
npm run build
# Output appears in public/
```

## Requirements
- Hugo Extended v0.140.2 or newer
- Node.js 16+
- Python 3 for the generator scripts

## Repository layout
```
content/
  exterior/
  interior/
data/
assets/
layouts/
static/
README/
```

## Workflow
1. Create a feature branch from `main`.
2. Make changes and preview locally.
3. Run `npm run build` before committing to ensure Hugo completes successfully.
4. Push the branch and open a pull request. Netlify will build a preview automatically.

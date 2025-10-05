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

### 1. Create a Feature Branch
Start from an updated `main` branch:
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Development
- Use `npm run dev:all` for live reload or `npm run dev` if CSS is already built.
- Regenerate Tailwind assets with `npm run tailwind:build` before production builds.
- Verify changes with `npm run build`; Hugo will write the site to `public/`.

### 3. Commit Your Changes
When satisfied with your work:
```bash
# Check what files changed
git status

# Stage specific files or all changes
git add path/to/file
# or
git add .

# Commit with a descriptive message
git commit -m "Add feature: brief description of changes"
```

### 4. Push and Create Pull Request
```bash
# Push your branch to GitHub
git push origin feature/your-feature-name

# Then open a pull request on GitHub
# Netlify will create a preview build automatically
```

### 5. After PR Approval
Once merged, update your local main:
```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # Delete local branch
```

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

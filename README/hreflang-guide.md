# Hreflang Guide

State pages share the same copy but target different regions. Use hreflang tags so search engines serve the correct state variant.

## Data Source
- State metadata lives in `data/states.yaml`. Each entry includes the full name, two letter code, and slug used in URLs.
- Update this file if a slug changes or if new regions are introduced. Keep keys lowercase and unique.

## Template Partial
- The partial at `layouts/partials/hreflang.html` loops over every state and prints alternate links.
- It only runs for pages of type `states` that define both `.Params.slug` (product key) and `.Params.state` (current state slug).
- The partial outputs `en-us-xx` codes for each state plus an `x-default` entry pointing to the current page.

## Activation
- `layouts/_default/baseof.html` calls the partial immediately after the canonical link:
  ```html
  <link rel="canonical" href="{{ .Permalink | safeURL }}">
  {{ partial "hreflang.html" . }}
  ```
- No additional configuration is required for generated pages because the generator writes the needed front matter.

## Verification
1. Run `npm run dev` and open any state page.
2. View source and confirm 51 `hreflang` tags appear (50 states plus `x-default`).
3. For production, use `curl https://autowindowstickers.com/states/<state>/<product>/ | grep hreflang`.
4. Monitor the International Targeting report in Google Search Console for errors or missing entries.

## Common Adjustments
- If you add a new product by hand, ensure its front matter includes `state` and `slug` fields so the partial has context.
- When changing URL structure, update the partial to keep generated links accurate before deploying.

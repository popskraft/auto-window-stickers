# Internal Linking Blueprint

## 1. Objectives
- Surface high-value product pages from every entry point and help users jump between related SKUs.
- Funnel state landing pages, category hubs, and articles toward purchase CTAs.
- Maintain a consistent linking schema that supports SEO crawl depth and keeps anchor text varied but descriptive.

## 2. Primary Hubs & Navigation
- **Main navigation** (header) should keep links to `/exterior/`, `/interior/`, and Home.
- Add a persistent link to `/states/` once the directory is public.
- Ensure the footer repeats key destinations (Exterior, Interior, States, Terms) plus wholesale form.
- Use breadcrumb trails (`Home → Category → Product`) on all product, article, and state pages.

## 3. Category Sections (`/exterior/`, `/interior/`)
- Each category hub lists two-column product cards (already in place). Add textual intro with inline links to top performers.
- Insert a “Looking for state-specific info?” block linking to the relevant `/states/<slug>/` sub-index (see section 5).
- Within any rich text modules, link to high-priority articles (FAQ, compliance) and wholesale CTA.

## 4. Product Detail Pages (`/exterior/<product>/`, `/interior/<product>/`)
- Above the fold: retain category breadcrumb and add a link back to the hub.
- **Related Product rail**: recommend at least two sibling SKUs (e.g., blank vs custom). Add a partial that pulls from `data/products` based on shared category.
- Within Benefits/Faq blocks, link key phrases to supporting articles or glossary pages to reinforce topical depth.
- CTA zone: maintain purchase buttons plus wholesale form; add text link to applicable state landing page (`Looking for compliance details in Alabama?`).

## 5. State Landing Pages (`/states/<state>/<product>/`)
- Hero paragraph should link to the base product page and to the parent state index once it exists (e.g., `/states/alabama/`).
- FAQ answers with compliance themes should link to state DMV or FTC pages for authority; keep at least one internal anchor per answer.
- Add a “Popular in <State>” section linking to 2–3 other state-product combos (randomized among generated pages to spread crawl equity).
- Include inline links to the wholesale form and to the category hub (Exterior/Interior) for users that want to compare variants.

## 6. Articles (`/articles/...`)
- At top: link back to the associated product hub and state guide if applicable (use `related_product` front matter).
- In-body paragraphs should reference relevant FAQs and product detail anchors (e.g., “See installation steps on the Exterior Addendum Custom page”).
- End-of-article CTA: link to wholesale form and one key state landing page.

## 7. Global Callouts & Shortcuts
- Home page hero cards should link to category hubs; gallery thumbnails can deep-link to top product detail pages.
- About/Features sections should add anchor links to articles (tutorials, compliance) and contact CTA.
- Footer: include direct links to wholesale form, contact info, States index (once live), Terms, and Privacy.

## 8. Anchor Text Standards
- Use descriptive anchors (“Exterior Buyers Guide - As Is template”) rather than raw URLs or generic “click here”.
- Vary phrasing across blocks (e.g., mix “buyers guide template”, “FTC-compliant buyers guide”) to avoid over-optimization.
- Reserve exact SKU names for links pointing to their canonical product pages.

## 9. Implementation Notes
- Create shared partials (`related-products.html`, `state-cross-links.html`) to keep logic DRY.
- Extend page front matter with `related_products` arrays when manual overrides are necessary.
- Store state metadata (top industries, climate) to generate dynamic anchors in future iterations.

## 10. Maintenance Schedule
- Quarterly: crawl site using a tool (Screaming Frog) to check for orphan pages and anchor diversity.
- After each major content batch (new states/products), re-run the generator and manual QA on 5 random pages per category to confirm links render.
- Document updates in `README/QUICK-FIXES.md` when link structures change, so editors know the active pattern.

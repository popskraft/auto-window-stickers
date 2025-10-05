# Site Architecture Blueprint

## Purpose
- Translate current Auto Window Stickers assets into a scalable, full-guide website structure.
- Ensure every dealership role can locate compliance, product, and purchasing answers quickly.
- Align with existing automation, content pools, and linking standards documented in this repository.

## Audience Personas
- **Compliance & Inventory Leads** — need adhesive specs, FTC/Monroney alignment, and environmental performance for each SKU.
- **Procurement Managers** — expect transparent pricing tiers, minimums, shipping lead times, and savings messaging before contacting sales.
- **Creative & Marketing Teams** — require customization guidance, artwork specs, and printable templates for branded outputs.
- **Regional/State Managers** — rely on localized regulatory checklists, cross-state comparisons, and scheduling visibility for rollouts.
- **Dealership Support Staff** — look for direct contact paths, distributor context, and quick-reference FAQs.

## Core Sections
1. **Home & Highlights**
   - Keep existing dual Exterior/Interior hero. Surface quick links to pricing, compliance resources, and services.
   - Reinforce distributor relationship, testimonials, and FAQ anchors for immediate trust.
2. **Products Hub**
   - Create a unified catalog landing page with tabs/filters for Exterior, Interior, Buyers Guides, and Addendums.
   - Use YAML product data to power comparison tables, spec downloads, bulk pricing callouts, and CTAs.
   - Add related-product carousels and breadcrumbs per internal-linking standards.
3. **State Compliance Center**
   - Provide searchable state index/map backed by `data/states.yaml` and generator outputs.
   - Each state overview links to its product variants, highlights localized benefits, and suggests adjacent states.
   - Maintain hreflang parity across all generated combinations.
4. **Ordering & Pricing**
   - Centralize volume pricing matrices, minimum order logic, shipping timelines, and wholesale processes.
   - Integrate existing purchase endpoints (AK Dealer Services, wholesale form) with contextual guidance.
5. **Knowledge Hub**
   - Reorganize articles, FAQs, printer guides, template downloads, and video tutorials into tagged collections (compliance, workflow, marketing, maintenance).
   - Address duplicate copy by segmenting content pools and enriching placeholders before large-scale publication.
6. **Company & Support**
   - Combine About, distributor profile, services list, testimonials, contact methods, and legal policies into a cohesive support portal.
   - Highlight service offerings (photography, videography, custom comments) for upsell opportunities.

## Navigation & Discoverability
- Header: Home, Products, Compliance by State, Knowledge Hub, Services, Contact.
- Footer: Mirror critical links plus direct phone/email, wholesale form, distributor site, and legal pages.
- Breadcrumb pattern: `Home → Section → Page` for products, state pages, and articles.
- Implement filters/search using existing product attributes (size, adhesive style, use case).
- Follow `README/internal-linking.md` guidance for cross-link density and anchor variety.

## Content Systems
- Segment content pools (durability, compliance, workflow, branding) and expand placeholders with dimensions, SKU, price notes.
- Enrich state metadata (`data/states/<state>.yaml`) to feed localized messaging and structured data.
- Add repeat-detection tooling in the generator to reduce phrasing collisions across 700 scheduled pages.
- Maintain schema.org partials with product imagery and offer details; ensure new sections feed structured data.

## Implementation Notes
- Leverage Hugo sections for Products (`/products/`) and Compliance (`/compliance/`) while keeping existing `/exterior/` and `/interior/` bundles.
- Extend layout partials for comparison tables, related SKUs, and knowledge cards without breaking current templates.
- Use taxonomy or data-driven filters instead of manual category duplication to ease upkeep.
- Preserve scheduling logic (30-minute intervals) and run `hugo server --buildFuture` during validation.

## Recommended Next Steps
1. Validate navigation labels and priority with sales and support stakeholders.
2. Draft wireframes for Products Hub and State Compliance Center; confirm data requirements.
3. Audit existing generated content for repetition; curate seed knowledge-base articles before scaling publication.
4. Update generator configuration to support segmented pools and enriched placeholders; test on limited state/product set.
5. Plan ongoing QA (crawl checks, link audits, schema validation) as new sections roll out.

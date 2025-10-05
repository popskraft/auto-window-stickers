# Content Variation Playbook

## Goals
- Reduce repeated phrasing across auto-generated product pages so copy reads natural and passes quality filters.
- Inject product-, category-, and state-specific facts to strengthen topical authority.
- Keep content pools maintainable for editors while supporting large-scale generation.

## Recommended Tactics
1. **Segment Content Pools**
   - Split current universal YAML pools into multiple themes (readability, durability, compliance, workflow, etc.).
   - Update `config.yaml` to assign pull counts per theme so every page blends different talking points.

2. **Product & Section Overrides**
   - Create specialized pools per category/SKU (e.g., `exterior-benefits.yaml`, `interior-benefits.yaml`).
   - After resolving `section` in `generate-pages.py`, prefer section-specific pools, fallback to global when missing.

3. **Richer Placeholder Data**
   - Extend `advanced.placeholders` (`config.yaml`) to include dimensions, materials, SKU, price note, etc.
   - Replace generic `[[keyword]]` text with actual product metadata pulled from `data/products/*.yaml`.

4. **State-Aware Messaging**
   - Add `data/states/<state>.yaml` with climate, regulatory, or logistical notes.
   - When building content (see `_generate_page_content`), pass state facts into `_process_content_item` for localized phrasing.

5. **Repeat Detection**
   - Implement an `_ensure_variation` helper that checks summaries/answers for high n-gram overlap.
   - If collision detected, redraw from the pool or regenerate with a different seed.

6. **Pool Curation Workflow**
   - Maintain at least ~20 unique entries per pool; retire items that appear in analytics as low-performing.
   - Keep AI-generated drafts separate from “editorial” YAML so human-reviewed copy is easy to surface first.
   - Schedule periodic audits: sample new pages quarterly and refresh pools based on findings.

## Next Steps
- Prototype segmented pools for benefits & FAQ, adjust generator logic, and test output on a limited state/product set.
- Backfill state metadata for top 10 states by traffic before scaling to all 50.

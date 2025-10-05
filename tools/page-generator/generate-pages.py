#!/usr/bin/env python3
"""
Hugo Page Generation Script for Auto Window Stickers
Generates:
- product-state pages based on product content pools (type=product)
- per-product articles assembled from article content blocks (type=article)

Usage: python generate-pages.py [--type product|article] [--seed SEED] [--limit LIMIT] [--dry-run]
"""

import os
import sys
import yaml
import random
import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path
import re

class LiteralDumper(yaml.SafeDumper):
    """Custom YAML dumper that uses literal block style for multi-line strings."""


def _str_representer(dumper, data):
    style = '|' if '\n' in data else None
    return dumper.represent_scalar('tag:yaml.org,2002:str', data, style=style)


# Register the representer for all strings
LiteralDumper.add_representer(str, _str_representer)

class PageGenerator:
    def __init__(self, base_path, config=None, seed=None):
        self.base_path = Path(base_path)
        self.config = config or {}
        self.seed = seed or self.config.get('execution', {}).get('seed')
        if self.seed:
            random.seed(self.seed)
        # Logging verbosity
        self.verbose = self.config.get('logging', {}).get('verbose', True)
        # Validate critical config
        self._validate_config()
        
        # Load data files
        self.products = self._load_products()
        self.states = self._load_states()
        self.keywords_seo = self._load_keywords_seo()
        self.keywords_content = self._load_keywords_content()
        self.content_pools = self._load_content_pools()
        # Article inputs (lazy-used by article mode)
        self.article_titles = self._load_article_titles()
        self.article_blocks_dir = self._get_article_blocks_dir()
        # Scheduling controls
        scheduling_cfg = self.config.get('scheduling', {})
        self.publish_delay_minutes = max(0, int(scheduling_cfg.get('publish_delay_minutes', 0) or 0))
        self.content_date_offset_minutes = int(scheduling_cfg.get('content_date_offset_minutes', 0) or 0)
        self.schedule_articles = bool(scheduling_cfg.get('apply_to_articles', self.publish_delay_minutes > 0))
        self.schedule_products = bool(scheduling_cfg.get('apply_to_products', False))
        self._publish_base = None
        self._publish_counter = 0

    def _validate_config(self):
        """Validate critical configuration settings and warn about potential issues."""
        limit = self.config.get('execution', {}).get('limit')
        if limit and limit < 100:
            self._log(f"⚠️  WARNING: Generation limit set to {limit}. This is likely for testing.")
            self._log(f"    For production, set limit to null in config.yaml")
        
        scheduling = self.config.get('scheduling', {})
        delay = scheduling.get('publish_delay_minutes', 0)
        apply_products = scheduling.get('apply_to_products', False)
        
        if apply_products and delay > 0:
            self._log(f"⚠️  WARNING: Deferred publishing enabled for products ({delay} min intervals)")
            self._log(f"    Ensure hugo.yaml has 'buildFuture: true' in development")
            self._log(f"    Production builds with 'buildFuture: false' will hide future-dated pages")

    def _reset_publish_schedule(self):
        """Reset rolling publish timestamp counter."""
        self._publish_base = None
        self._publish_counter = 0

    def _resolve_schedule_start(self):
        """Return the base datetime to start scheduling from."""
        start_ts = self.config.get('scheduling', {}).get('start_timestamp')
        if start_ts:
            try:
                return datetime.fromisoformat(start_ts)
            except Exception:
                pass
        if start_ts:
            self._log(f"Warning: invalid scheduling.start_timestamp '{start_ts}'; falling back to current UTC time.")
        return datetime.now(timezone.utc)

    def _allocate_publish_and_date(self, use_schedule=True):
        """Allocate the next publishDate/date pair respecting configured delay."""
        delay = self.publish_delay_minutes if use_schedule else 0
        offset = self.content_date_offset_minutes
        if delay > 0:
            if self._publish_base is None:
                self._publish_base = self._resolve_schedule_start()
                self._publish_counter = 0
            publish_dt = self._publish_base + timedelta(minutes=delay * self._publish_counter)
            self._publish_counter += 1
        else:
            publish_dt = datetime.now(timezone.utc)
        date_dt = publish_dt + timedelta(minutes=offset)
        return publish_dt, date_dt
    
    def _log(self, message: str):
        """Conditional logger honoring logging.verbose"""
        if self.verbose:
            print(message)
        
    def _load_products(self):
        """Load all product YAML files"""
        products = {}
        products_path = self.config.get('data_sources', {}).get('products_dir', 'data/products')
        products_dir = self.base_path / products_path
        
        for yaml_file in products_dir.glob("*.yaml"):
            with open(yaml_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                # Use filename without extension as key
                key = yaml_file.stem
                products[key] = data
                
        self._log(f"Loaded {len(products)} products")
        return products
    
    def _load_states(self):
        """Load states from YAML"""
        states_path = self.config.get('data_sources', {}).get('states_file', 'data/content-generator/states.yaml')
        states_file = self.base_path / states_path
        with open(states_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data['states']
    
    def _load_keywords_seo(self):
        """Load SEO keywords for seoTitle generation"""
        seo_file = self.config.get('seo', {}).get('seo_keywords_file', 'data/content-generator/keywords-seotitle.yaml')
        keywords_file = self.base_path / seo_file
        with open(keywords_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data['keywords']
    
    def _load_keywords_content(self):
        """Load content keywords for [[keyword]] substitutions"""
        content_file = self.config.get('seo', {}).get('content_keywords_file', 'data/content-generator/keywords.yaml')
        keywords_file = self.base_path / content_file
        with open(keywords_file, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data['keywords']
    
    def _load_content_pools(self):
        """Load all content pool YAML files"""
        pools = {}
        pools_path = self.config.get('data_sources', {}).get('content_pools_dir', 'data/content-generator/content/product')
        content_dir = self.base_path / pools_path
        
        for yaml_file in content_dir.glob("*.yaml"):
            with open(yaml_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                pool_name = yaml_file.stem
                pools[pool_name] = data
                
        self._log(f"Loaded content pools: {list(pools.keys())}")
        return pools

    def _load_article_titles(self):
        """Load article titles list from YAML if available."""
        titles_file = self.config.get('articles', {}).get('titles_file', 'data/content-generator/articles.yaml')
        path = self.base_path / titles_file
        if not path.exists():
            return []
        with open(path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or {}
            titles = data.get('articles', [])
            return [t for t in titles if isinstance(t, str) and t.strip()]

    def _get_article_blocks_dir(self):
        """Return Path for article blocks directory."""
        rel = self.config.get('articles', {}).get('blocks_dir', 'data/content-generator/content/article')
        return self.base_path / rel
    
    def _substitute_placeholders(self, text, product_data, state, keyword):
        """Replace placeholders in text with actual values"""
        if not isinstance(text, str):
            return text
            
        # Get product title without markdown formatting
        product_title = product_data.get('title', '').replace('**', '')
        
        substitutions = {
            '[[product]]': product_title,
            '[[state]]': state,
            '[[keyword]]': keyword,
            '[[saving_number]]': product_data.get('saving_number', self.config.get('content', {}).get('default_saving_number', '3500'))
        }
        
        result = text
        for placeholder, value in substitutions.items():
            result = result.replace(placeholder, value)
            
        return result

    def _substitute_placeholders_article(self, text, product_title):
        """Per-occurrence substitution for article mode.
        - [[product]] -> product_title
        - [[state]]   -> fixed 'United States'
        - [[keyword]] -> random choice PER occurrence
        """
        if not isinstance(text, str):
            return text
        result = text
        # product and state are simple global replacements
        result = result.replace('[[product]]', product_title)
        result = result.replace('[[state]]', 'United States')
        # keyword per occurrence
        def _kw_sub(_m):
            return random.choice(self.keywords_content)
        result = re.sub(re.escape('[[keyword]]'), _kw_sub, result)
        return result
    
    def _process_content_item(self, item, product_data, state, keyword):
        """Recursively process content item and substitute placeholders"""
        if isinstance(item, dict):
            processed = {}
            for key, value in item.items():
                processed[key] = self._process_content_item(value, product_data, state, keyword)
            return processed
        elif isinstance(item, list):
            return [self._process_content_item(i, product_data, state, keyword) for i in item]
        elif isinstance(item, str):
            return self._substitute_placeholders(item, product_data, state, keyword)
        else:
            return item
    
    def _generate_seo_title(self, product_data, state):
        """Generate SEO title using keywords-seotitle.yaml"""
        product_title = product_data.get('title', '').replace('**', '')
        keyword = random.choice(self.keywords_seo)
        template = self.config.get('seo', {}).get('title_template', '{product_title} — {keyword} {state}')
        return template.format(product_title=product_title, keyword=keyword, state=state)
    
    def _select_random_content(self, pool_name, count=1):
        """Select random items from content pool"""
        if pool_name not in self.content_pools:
            return []
            
        pool = self.content_pools[pool_name]
        if not pool:
            return []
            
        # Ensure we don't try to select more items than available
        actual_count = min(count, len(pool))
        return random.sample(pool, actual_count)

    def _select_unique_processed(self, pool_name, count, process_fn):
        """Select up to `count` items from a pool such that their processed
        content (after substitutions) is unique within the page.

        Items are iterated in a random order; duplicates (by processed content)
        are skipped. The uniqueness key is the YAML dump of the processed item
        (stable, text-based).
        """
        if pool_name not in self.content_pools or not self.content_pools[pool_name]:
            return []

        pool = list(self.content_pools[pool_name])
        random.shuffle(pool)

        selected = []
        seen_keys = set()

        for item in pool:
            processed = process_fn(item)
            # Use YAML dump as a simple stable key for the processed structure
            key = yaml.dump(processed, Dumper=LiteralDumper, default_flow_style=False, allow_unicode=True, sort_keys=True)
            if key in seen_keys:
                continue
            seen_keys.add(key)
            selected.append(processed)
            if len(selected) >= count:
                break

        return selected
    
    def _generate_page_content(self, product_key, product_data, state):
        """Generate complete page content for a product-state combination"""
        # Select random keyword for content substitutions
        content_keyword = random.choice(self.keywords_content)
        
        # Generate SEO title
        seo_title = self._generate_seo_title(product_data, state)
        
        # Select unique content from pools per page
        content_config = self.config.get('content', {})
        savings_items = self._select_random_content('savings', content_config.get('savings_count', 1))
        savings = self._process_content_item(savings_items[0] if savings_items else {}, 
                                             product_data, state, content_keyword)

        benefits = self._select_unique_processed(
            'benefits',
            content_config.get('benefits_count', 6),
            lambda item: self._process_content_item(item, product_data, state, content_keyword),
        )

        faq = self._select_unique_processed(
            'faq',
            content_config.get('faq_count', 10),
            lambda item: self._process_content_item(item, product_data, state, content_keyword),
        )

        testimonials = self._select_unique_processed(
            'testimonials',
            content_config.get('testimonials_count', 3),
            lambda item: self._process_content_item(item, product_data, state, content_keyword),
        )
        
        # Determine state slug and key for data lookup
        state_slug = state.lower().replace(' ', '-')
        state_key = state_slug  # For data/states lookup
        
        # Determine section from product_key
        section = 'exterior' if product_key.startswith('exterior') else 'interior'
        
        # Create page front matter
        layout = self.config.get('pages', {}).get('layout', 'product')
        # Clean product title from markdown formatting for plain text fields
        product_title_clean = product_data.get('title', '').replace('**', '')
        page_content = {
            'layout': layout,
            'title': f"{product_title_clean} in {state}",
            'description': self._substitute_placeholders(
                f"Details about the {product_title_clean.lower()} product in {state}.",
                product_data, state, content_keyword
            ),
            'seoTitle': seo_title,
            'state': state_key,
            # canonical removed - Hugo will use .Permalink (self-reference) by default
            'savings': {
                'headline': self._substitute_placeholders(
                    'Save up to $[[saving_number]] a year',
                    product_data, state, content_keyword
                ),
                'subtitle': savings.get('subtitle', ''),
                'summary': savings.get('summary', '')
            },
            'benefits': {
                'headline': f"Why Choose {product_title_clean} in {state}?",
                'items': [{'title': item.get('title', ''), 'summary': item.get('summary', '')} 
                         for item in benefits]
            },
            'faq': {
                'items': [{'question': item.get('question', ''), 'answer': item.get('answer', '')} 
                         for item in faq]
            },
            'testimonials': {
                'items': [{'title': item.get('title', ''), 'summary': item.get('summary', ''), 
                          'author': item.get('author', '')} for item in testimonials]
            }
        }
        
        return page_content

    # -------------------- Article generation helpers --------------------
    def _slugify(self, s: str) -> str:
        """Slugify per rules: lowercase, spaces->-, strip punctuation, ASCII only-ish."""
        if not s:
            return ''
        s = s.lower()
        # replace spaces with dash
        s = re.sub(r"\s+", "-", s)
        # remove punctuation
        s = re.sub(r'[\.,!?:;"\'`~@#$%^&*()\[\]{}<>/\\|+=]', "", s)
        # collapse dashes
        s = re.sub(r"-+", "-", s)
        # strip leading/trailing dashes
        s = s.strip('-')
        return s

    def _load_yaml_list(self, path: Path):
        with open(path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
            return data if isinstance(data, list) else []

    def _iter_article_block_files(self):
        """Yield article block YAML files sorted by numeric prefix in filename."""
        if not self.article_blocks_dir.exists():
            return []
        files = list(self.article_blocks_dir.glob('*.yaml'))
        def key(p: Path):
            m = re.match(r"(\d+)-", p.stem)
            return int(m.group(1)) if m else 9999
        return sorted(files, key=key)

    def _find_article_cover_image(self) -> str:
        """Return random image path from assets/images/articles/ or empty string.

        Returns relative path like 'images/articles/1-coverimage.jpg'.
        """
        images_dir = self.base_path / 'assets' / 'images' / 'articles'
        if not images_dir.exists() or not images_dir.is_dir():
            return ""
        exts = {'.jpg', '.jpeg', '.png', '.webp'}
        candidates = [p for p in images_dir.iterdir() if p.is_file() and p.suffix.lower() in exts]
        if not candidates:
            return ""
        choice = random.choice(candidates)
        return (Path('images') / 'articles' / choice.name).as_posix()

    def _pick_cover_and_body_images(self):
        """Pick two distinct random images for cover and body. Return (cover, body).

        Paths are relative like 'images/articles/<file>'. Empty strings if none.
        """
        images_dir = self.base_path / 'assets' / 'images' / 'articles'
        exts = {'.jpg', '.jpeg', '.png', '.webp'}
        if not images_dir.exists() or not images_dir.is_dir():
            return "", ""
        candidates = [p for p in images_dir.iterdir() if p.is_file() and p.suffix.lower() in exts]
        if not candidates:
            return "", ""
        if len(candidates) == 1:
            rel = (Path('images') / 'articles' / candidates[0].name).as_posix()
            return rel, ""
        cover_p = random.choice(candidates)
        remaining = [p for p in candidates if p.name != cover_p.name]
        body_p = random.choice(remaining)
        cover = (Path('images') / 'articles' / cover_p.name).as_posix()
        body = (Path('images') / 'articles' / body_p.name).as_posix()
        return cover, body

    def _render_article_item_md(self, item: dict, product_title: str) -> str:
        """Render a single selected article item (dict) to Markdown with substitutions."""
        lines = []
        # h2
        h2 = item.get('h2_section_heading') or item.get('heading')
        if h2:
            lines.append(f"## {self._substitute_placeholders_article(h2, product_title)}")
        # paragraphs
        for p in item.get('paragraphs', []) or []:
            lines.append(self._substitute_placeholders_article(p, product_title))
            lines.append("")
        # lists
        # Support shapes: {'list_items': [..]} or {'lists': [{'items':[...]}]}
        if 'list_items' in item and isinstance(item['list_items'], list):
            for li in item['list_items']:
                li_txt = self._substitute_placeholders_article(li, product_title)
                # strip any existing leading list markers to avoid "- - "
                li_txt = re.sub(r'^\s*[-*]\s+', '', li_txt)
                lines.append(f"- {li_txt}")
            lines.append("")
        for lst in item.get('lists', []) or []:
            items = lst.get('items', []) if isinstance(lst, dict) else []
            for li in items:
                li_txt = self._substitute_placeholders_article(li, product_title)
                li_txt = re.sub(r'^\s*[-*]\s+', '', li_txt)
                lines.append(f"- {li_txt}")
            if items:
                lines.append("")
        # subsections
        for sub in item.get('subsections', []) or []:
            h3 = sub.get('h3_subsection_heading') or sub.get('subsection_heading')
            if h3:
                lines.append(f"### {self._substitute_placeholders_article(h3, product_title)}")
            for p in sub.get('paragraphs', []) or []:
                lines.append(self._substitute_placeholders_article(p, product_title))
                lines.append("")
            for lst in sub.get('lists', []) or []:
                items = lst.get('items', []) if isinstance(lst, dict) else []
                for li in items:
                    li_txt = self._substitute_placeholders_article(li, product_title)
                    li_txt = re.sub(r'^\s*[-*]\s+', '', li_txt)
                    lines.append(f"- {li_txt}")
                if items:
                    lines.append("")
        return "\n".join(lines).strip() + "\n"

    def _assemble_article_markdown(self, product_data: dict) -> str:
        """Pick one item from each numbered article block file and render to Markdown."""
        product_title = (product_data.get('title') or '').replace('**', '')
        parts = []
        for idx, f in enumerate(self._iter_article_block_files()):
            items = self._load_yaml_list(f)
            if not items:
                continue
            chosen = random.choice(items)
            # Deep copy not necessary; we only read
            md = self._render_article_item_md(chosen, product_title)
            if md:
                parts.append(md)
            # After second block (index 1), inject body image shortcode
            # Empty src triggers fallback to .Page.Params.image_body in the shortcode
            if idx == 1:
                parts.append('{{< figureproc >}}\n')
        return "\n".join(parts).strip() + "\n"

    def _read_archetype_article(self):
        """Read archetype/article.md and split into (front_matter_dict, body_template)."""
        path = self.base_path / 'archetypes' / 'article.md'
        fm = {}
        body = "<!-- auto-content-here -->\n"
        if not path.exists():
            return fm, body
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()
        if text.startswith('---'):
            parts = text.split('---', 2)
            if len(parts) == 3:
                _, fm_text, body = parts
                # Try to parse YAML front matter, but tolerate Hugo templating like {{ .Date }}
                try:
                    fm = yaml.safe_load(fm_text) or {}
                except Exception:
                    fm = {}
            else:
                # Unexpected structure; fall back to full text as body
                body = text
        else:
            body = text
        return fm, body

    def _write_article_file(self, product_key: str, product_title: str, article_title: str, content_md: str, dry_run=False):
        """Write a single article using the configured filename pattern and merge archetype content."""
        product_slug = self._slugify(product_title)
        article_slug = self._slugify(article_title)
        pattern = self.config.get('articles', {}).get(
            'filename_pattern', 'articles/{product_slug}-{article_slug}/index.md'
        )
        placeholders = {
            'product_key': product_key,
            'product_slug': product_slug,
            'product_title': product_title,
            'article_slug': article_slug,
            'article_name': article_slug,
            'article_title': article_title,
        }
        try:
            rel_str = pattern.format(**placeholders)
        except KeyError as exc:
            missing = exc.args[0]
            raise ValueError(
                f"Unknown placeholder '{{{missing}}}' in articles.filename_pattern"
            ) from exc
        rel = Path(rel_str)
        output_dir = self.base_path / self.config.get('execution', {}).get('output_dir', 'content')
        filepath = output_dir / rel
        if filepath.exists():
            if dry_run:
                print(f"[DRY RUN] Skip (exists): {filepath}")
                return False
            self._log(f"Skip (exists): {filepath}")
            return False

        publish_dt, date_dt = self._allocate_publish_and_date(use_schedule=self.schedule_articles and self.publish_delay_minutes > 0)

        if dry_run:
            publish_str = publish_dt.isoformat() if publish_dt.tzinfo else publish_dt.strftime('%Y-%m-%dT%H:%M:%S+00:00')
            print(f"[DRY RUN] Would create: {filepath} (publish {publish_str})")
            return True
        # Merge archetype front matter
        fm_default, body_tpl = self._read_archetype_article()
        
        # Ensure image_cover and image_body are present; auto-pick distinct images if available
        cover, body_img = self._pick_cover_and_body_images()
        
        # Build front matter with dates at the top
        fm = {
            'layout': 'article',
            'title': article_title,
            'publishDate': publish_dt.isoformat() if publish_dt.tzinfo else publish_dt.strftime('%Y-%m-%dT%H:%M:%S+00:00'),
            'date': date_dt.isoformat() if date_dt.tzinfo else date_dt.strftime('%Y-%m-%dT%H:%M:%S+00:00'),
        }
        
        # Add images
        fm['image_cover'] = cover or fm_default.get('image_cover', "")
        # Avoid accidental equality; set only if distinct
        if body_img and body_img != fm.get('image_cover'):
            fm['image_body'] = body_img
        else:
            fm['image_body'] = fm_default.get('image_body', "")
        # Set alt text for body image to the page title if not provided
        fm['image_body_alt'] = article_title
        
        # Merge remaining fields from archetype (excluding already set fields)
        for key, value in fm_default.items():
            if key not in fm:
                fm[key] = value
        # Ensure directories
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('---\n')
            yaml.dump(fm, f, Dumper=LiteralDumper, default_flow_style=False, allow_unicode=True, sort_keys=False)
            f.write('---\n\n')
            # Normalize leading newlines in generated content
            content_md = content_md.lstrip('\n')
            if '<!-- auto-content-here -->' in body_tpl:
                f.write(body_tpl.replace('<!-- auto-content-here -->', content_md))
            else:
                f.write(body_tpl)
                if not body_tpl.endswith('\n'):
                    f.write('\n')
                f.write(content_md)
        self._log(f"Created: {filepath}")
        return True

    def generate_all_articles(self, limit=None, dry_run=False):
        """Generate per-product articles for each title from articles.yaml."""
        titles = self.article_titles
        if not titles:
            self._log("No article titles found; skipping article generation.")
            return
        generated = 0
        use_schedule = self.schedule_articles and self.publish_delay_minutes > 0
        if use_schedule:
            self._reset_publish_schedule()
        for product_key in sorted(self.products.keys()):
            product_data = self.products[product_key]
            product_title = (product_data.get('title') or '').replace('**', '')
            for article_title in titles:
                if limit and generated >= limit:
                    self._log(f"Limit reached: {generated}")
                    self._log("Generation complete!")
                    return
                md = self._assemble_article_markdown(product_data)
                created = self._write_article_file(product_key, product_title, article_title, md, dry_run=dry_run)
                if created:
                    generated += 1
        self._log(f"Generation complete! Created {generated} articles")
    
    def _create_page_filename(self, product_key, state):
        """Generate relative path for a product/state page from the configured filename pattern."""
        state_name = state
        state_slug = self._slugify(state) or state.lower().replace(' ', '-')
        product_data = self.products.get(product_key, {}) or {}
        product_title = (product_data.get('title') or '').replace('**', '')
        product_slug = self._slugify(product_title) or self._slugify(product_key) or product_key
        pattern = self.config.get('pages', {}).get(
            'filename_pattern', 'states/{state_slug}-{product_key}/index.md'
        )
        placeholders = {
            'state': state_name,
            'state_name': state_name,
            'state_slug': state_slug,
            'product_key': product_key,
            'product_slug': product_slug,
            'product_title': product_title,
        }
        try:
            rel_str = pattern.format(**placeholders)
        except KeyError as exc:
            missing = exc.args[0]
            raise ValueError(f"Unknown placeholder '{{{missing}}}' in pages.filename_pattern") from exc
        return Path(rel_str)
    
    def _write_page_file(self, content, filename, output_dir, dry_run=False):
        """Write page content to markdown file.
        Returns True if a new file was (or would be) created; False if it already exists.
        """
        filepath = output_dir / filename

        # If file exists, report and skip
        if filepath.exists():
            if dry_run:
                print(f"[DRY RUN] Skip (exists): {filepath}")
            else:
                self._log(f"Skip (exists): {filepath}")
            return False

        if dry_run:
            print(f"[DRY RUN] Would create: {filepath}")
            return True
            
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Ensure the directory for this specific file exists
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        # Write YAML front matter + content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('---\n')
            yaml.dump(
                content,
                f,
                Dumper=LiteralDumper,
                default_flow_style=False,
                allow_unicode=True,
                sort_keys=False,
            )
            f.write('---\n\n')
            f.write(f"<!-- Generated page for {content['title']} -->\n")
            
        self._log(f"Created: {filepath}")
        return True
    
    def generate_all_pages(self, limit=None, dry_run=False):
        """Generate all product-state combination pages.
        Only count and stop at `limit` for pages that are actually newly created
        (or would be created in dry-run). Existing files are skipped and do not
        count toward the limit.
        """
        output_path = self.config.get('execution', {}).get('output_dir', 'content')
        output_dir = self.base_path / output_path

        total_combinations = len(self.products) * len(self.states)
        self._log(f"Generating {total_combinations} total combinations...")

        if limit:
            self._log(f"Limited to first {limit} pages")

        generated_count = 0
        use_schedule = self.schedule_products and self.publish_delay_minutes > 0
        if use_schedule:
            self._reset_publish_schedule()

        # Iterate states first, then products (sorted by key) to generate
        # all products for the first state, then move to the next state, etc.
        for state in self.states:
            for product_key in sorted(self.products.keys()):
                product_data = self.products[product_key]
                if limit and generated_count >= limit:
                    break
                
                # Create filename and check existence early to avoid unnecessary generation
                filename = self._create_page_filename(product_key, state)
                filepath = output_dir / filename

                if filepath.exists():
                    if dry_run:
                        print(f"[DRY RUN] Skip (exists): {filepath}")
                    else:
                        self._log(f"Skip (exists): {filepath}")
                    continue

                # Generate page content and assign scheduled timestamps
                page_content = self._generate_page_content(product_key, product_data, state)
                publish_dt, date_dt = self._allocate_publish_and_date(use_schedule=use_schedule)
                
                # Rebuild dict with dates at the top
                # Build front matter, optionally including slug based on config
                include_slug = self.config.get('pages', {}).get('include_slug', False)
                
                front_matter = {
                    'layout': page_content['layout'],
                    'title': page_content['title'],
                    'description': page_content['description'],
                    'seoTitle': page_content['seoTitle'],
                    'publishDate': publish_dt.isoformat() if publish_dt.tzinfo else publish_dt.strftime('%Y-%m-%dT%H:%M:%S+00:00'),
                    'date': date_dt.isoformat() if date_dt.tzinfo else date_dt.strftime('%Y-%m-%dT%H:%M:%S+00:00'),
                    'state': page_content.get('state'),
                    # canonical removed - Hugo will use .Permalink by default
                    **{k: v for k, v in page_content.items() if k not in ['layout', 'title', 'description', 'seoTitle', 'state', 'slug']}
                }
                
                # Add slug only if configured
                if include_slug and 'slug' in page_content:
                    front_matter['slug'] = page_content['slug']

                # Write file
                created = self._write_page_file(front_matter, filename, output_dir, dry_run)
                if created:
                    generated_count += 1
                progress_interval = self.config.get('logging', {}).get('progress_interval', 50)
                if progress_interval and generated_count % progress_interval == 0:
                    self._log(f"Progress: {generated_count}/{total_combinations if not limit else limit}")
            
            if limit and generated_count >= limit:
                break
        
        self._log(f"Generation complete! Created {generated_count} pages")
        if not dry_run:
            self._log(f"Output directory: {output_dir}")


def load_config(config_path):
    """Load configuration from YAML file"""
    if not config_path or not Path(config_path).exists():
        return {}
    
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def main():
    parser = argparse.ArgumentParser(description='Generate Hugo pages for auto window stickers')
    parser.add_argument('--config', help='Path to config file (default: config.yaml)')
    parser.add_argument('--type', choices=['product', 'article'], default='product', help='What to generate')
    parser.add_argument('--seed', type=int, help='Random seed for reproducible generation')
    parser.add_argument('--limit', type=int, help='Limit number of pages to generate (for testing)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be generated without creating files')
    parser.add_argument('--base-path', default='.', help='Base path to Hugo site (default: current directory)')
    parser.add_argument('--publish-delay-minutes', type=int, help='Spacing in minutes between scheduled publish times')
    
    args = parser.parse_args()
    
    # Load configuration
    config_path = args.config or 'config.yaml'
    config = load_config(config_path)
    
    # Override config with command line arguments
    if args.seed is not None:
        config.setdefault('execution', {})['seed'] = args.seed
    if args.limit is not None:
        config.setdefault('execution', {})['limit'] = args.limit
    if args.dry_run:
        config.setdefault('execution', {})['dry_run'] = True
    if args.base_path != '.':
        config.setdefault('execution', {})['base_path'] = args.base_path
    if args.publish_delay_minutes is not None:
        delay = max(0, args.publish_delay_minutes)
        config.setdefault('scheduling', {})['publish_delay_minutes'] = delay

    # Validate base path
    base_path = Path(config.get('execution', {}).get('base_path', args.base_path))
    if not (base_path / "hugo.yaml").exists() and not (base_path / "config.yaml").exists():
        print("Error: Not a Hugo site directory (no hugo.yaml or config.yaml found)")
        sys.exit(1)
    
    # Initialize generator
    generator = PageGenerator(base_path, config=config)
    
    # Generate pages
    limit = config.get('execution', {}).get('limit') or args.limit
    dry_run = config.get('execution', {}).get('dry_run', False) or args.dry_run
    if args.type == 'product':
        generator.generate_all_pages(limit=limit, dry_run=dry_run)
    else:
        generator.generate_all_articles(limit=limit, dry_run=dry_run)


if __name__ == "__main__":
    main()

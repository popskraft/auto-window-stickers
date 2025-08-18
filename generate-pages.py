#!/usr/bin/env python3
"""
Hugo Page Generation Script for Auto Window Stickers
Generates product-state pages based on data templates and content pools.

Usage: python generate-pages.py [--seed SEED] [--limit LIMIT] [--dry-run]
"""

import os
import sys
import yaml
import random
import argparse
from datetime import datetime
from pathlib import Path
import re
import subprocess

class PageGenerator:
    def __init__(self, base_path, config=None, seed=None):
        self.base_path = Path(base_path)
        self.config = config or {}
        self.seed = seed or self.config.get('execution', {}).get('seed')
        if self.seed:
            random.seed(self.seed)
        # Logging verbosity
        self.verbose = self.config.get('logging', {}).get('verbose', True)
        
        # Load data files
        self.products = self._load_products()
        self.states = self._load_states()
        self.keywords_seo = self._load_keywords_seo()
        self.keywords_content = self._load_keywords_content()
        self.content_pools = self._load_content_pools()
    
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
    
    def _generate_page_content(self, product_key, product_data, state):
        """Generate complete page content for a product-state combination"""
        # Select random keyword for content substitutions
        content_keyword = random.choice(self.keywords_content)
        
        # Generate SEO title
        seo_title = self._generate_seo_title(product_data, state)
        
        # Select random content from pools
        content_config = self.config.get('content', {})
        savings_items = self._select_random_content('savings', content_config.get('savings_count', 1))
        benefits_items = self._select_random_content('benefits', content_config.get('benefits_count', 6))
        faq_items = self._select_random_content('faq', content_config.get('faq_count', 10))
        testimonials_items = self._select_random_content('testimonials', content_config.get('testimonials_count', 3))
        
        # Process content with placeholder substitutions
        savings = self._process_content_item(savings_items[0] if savings_items else {}, 
                                           product_data, state, content_keyword)
        benefits = [self._process_content_item(item, product_data, state, content_keyword) 
                   for item in benefits_items]
        faq = [self._process_content_item(item, product_data, state, content_keyword) 
               for item in faq_items]
        testimonials = [self._process_content_item(item, product_data, state, content_keyword) 
                       for item in testimonials_items]
        
        # Create page front matter
        layout = self.config.get('pages', {}).get('layout', 'product')
        page_content = {
            'layout': layout,
            'title': f"{product_data.get('title', '')} in {state}",
            'description': self._substitute_placeholders(
                f"Details about the {product_data.get('title', '').replace('**', '').lower()} product in {state}.",
                product_data, state, content_keyword
            ),
            'date': datetime.now().isoformat(),
            'seoTitle': seo_title,
            'savings': {
                'headline': savings.get('headline', ''),
                'subtitle': savings.get('subtitle', ''),
                'summary': savings.get('summary', ''),
                'image_file': f"{product_key}-savings.jpg"
            },
            'benefits': {
                'headline': f"Why Choose {product_data.get('title', '').replace('**', '')} in {state}?",
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
    
    def _create_page_filename(self, product_key, state):
        """Generate directory path and filename for the page using config pages.filename_pattern"""
        # Convert state to slug
        state_slug = state.lower().replace(' ', '-')
        pattern = self.config.get('pages', {}).get('filename_pattern', '{state_slug}/{product_key}/index.md')
        try:
            return pattern.format(state_slug=state_slug, product_key=product_key)
        except Exception:
            # Fallback to default if pattern has unexpected placeholders
            return f"{state_slug}/{product_key}/index.md"
    
    def _write_page_file(self, content, filename, output_dir, dry_run=False):
        """Write page content to markdown file"""
        if dry_run:
            print(f"[DRY RUN] Would create: {output_dir / filename}")
            return
            
        # Ensure output directory exists
        output_dir.mkdir(parents=True, exist_ok=True)
        
        filepath = output_dir / filename
        
        # Ensure the directory for this specific file exists
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        # Write YAML front matter + content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write('---\n')
            yaml.dump(content, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
            f.write('---\n\n')
            f.write(f"<!-- Generated page for {content['title']} -->\n")
            
        self._log(f"Created: {filepath}")
    
    def generate_all_pages(self, limit=None, dry_run=False):
        """Generate all product-state combination pages"""
        output_path = self.config.get('execution', {}).get('output_dir', 'content')
        output_dir = self.base_path / output_path
        
        total_combinations = len(self.products) * len(self.states)
        self._log(f"Generating {total_combinations} total combinations...")
        
        if limit:
            self._log(f"Limited to first {limit} pages")
        
        generated_count = 0
        
        for product_key, product_data in self.products.items():
            for state in self.states:
                if limit and generated_count >= limit:
                    break
                    
                # Generate page content
                page_content = self._generate_page_content(product_key, product_data, state)
                
                # Create filename
                filename = self._create_page_filename(product_key, state)
                
                # Write file
                self._write_page_file(page_content, filename, output_dir, dry_run)
                
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
    """Wrapper delegating to consolidated generator in tools/page-generator."""
    base = Path(__file__).parent
    wrapper_script = base / "tools" / "page-generator" / "generate-pages.py"
    wrapper_cfg = base / "tools" / "page-generator" / "config.yaml"
    if not wrapper_script.exists():
        print(f"Error: consolidated generator not found at {wrapper_script}")
        sys.exit(1)
    # Force base-path to the repo root (this file's directory) so relative
    # paths in the portable config resolve correctly when called via wrapper.
    args = [
        sys.executable,
        str(wrapper_script),
        "--config", str(wrapper_cfg),
        "--base-path", str(base),
    ] + sys.argv[1:]
    sys.exit(subprocess.call(args))

if __name__ == "__main__":
    main()

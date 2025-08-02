# Auto Window Stickers - Hugo Website

## Quick Start Guide

This is a [Hugo](https://gohugo.io)-based website that uses templates and YAML data files to generate product pages for window stickers. 

### Core Concepts

1. **Templates & Content Separation**
   - Site uses Hugo templates (`layouts/`) to define page structure
   - Content is stored separately in Markdown files (`content/`)
   - Product data is centralized in YAML files (`data/`)

2. **Important Rules**
   - YAML formatting must be exact (spaces, not tabs)
   - Images go in `assets/images/` or `static/images/`
   - Follow the exact frontmatter structure in content files

### Quick Links
- [Hugo Content Management Guide](https://gohugo.io/content-management/organization/)
- [Hugo Template Guide](https://gohugo.io/templates/introduction/)
- [YAML Syntax Guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)

### Common Tasks
```bash
# Add new product
1. Create data file:    data/products/new-product.yaml
2. Add content:         content/new-product.md
3. Add category pages:  content/*/new-product.md

# Add new category
1. Create category folder: content/new-category/
2. Copy product pages:  content/*.md → content/new-category/
```

## Table of Contents
- [Project Structure](#project-structure)
- [Managing Product Data](#managing-product-data)
- [Content Management](#content-management)
- [Adding New Pages](#adding-new-pages)
- [Development](#development)

## Project Structure

```
auto-window-stickers/
├── data/           # Product data files (YAML)
├── content/        # Markdown content files
├── layouts/        # HTML templates
├── assets/         # CSS, JS, and images
└── static/         # Static files
```

## Managing Product Data

### Why Data is Stored in the `data/` Directory

The `data/` directory serves as a central storage for product information:

**Key Point:** Product data is stored in ONE place (`data/products/*.yaml`) while having many category-specific pages in the `content/` directory.

Example structure:
```
data/products/
└── exterior-window-sticker-blank.yaml         # ONE product data file
    
content/                      # Category pages using same data
├── exterior/exterior-window-sticker-blank.md
└── interior/exterior-window-sticker-blank.md
```

**When to Edit Files:**
- To change product info (prices, features, images) → edit `data/products/*.yaml`
- To change category-specific content → edit files in `content/[category]/*.md`

### Product Data Files Location
All product data is stored in YAML files under the `data/products/` directory:
```
data/products/
├── exterior-window-sticker-blank.yaml
├── exterior-window-sticker-custom.yaml
├── exterior-buyers-guide-asis.yaml
└── [other products...]
```

Each product file contains:
- Basic product information (name, price, SKU)
- Media assets and images
- Product features and benefits
- Pricing information
- Marketing content

### Product YAML Structure
Below is the complete structure for a product data file with all available fields:

```yaml
# Basic Product Information
weight: 1                     # Product weight for sorting
title: "Product Name"         # Full product name
description: "Description"    # Product description
price: 0.39                  # Base price
price_note: "each (1000 min)" # Additional pricing info
size: "8.5 x 11\""           # Physical dimensions
SKU: "1000535"              # Stock Keeping Unit

# Media Assets
ogImage: "images/EXTERIOR/1-blank-1.jpg"  # Main social sharing image
images:                      # Gallery images
  - src: "images/example.jpg"
    alt: "Image description"

# Product Features
features:
  - "Waterproof"
  - "Fade resistant"
  - "Easy to apply"

# Purchase Links
purchase_links:
  - name: "Vendor Name"
    url: "https://example.com/product"
```

## Content Management

### Product Pages
Product pages are stored in two locations:

1. Base product pages in `content/`:
   ```
   content/
   ├── exterior-window-sticker-blank.md
   ├── exterior-window-sticker-custom.md
   └── [other products...]
   ```

2. Category-specific product pages in `content/[category]/`:
   ```
   content/exterior/
   ├── _index.md
   ├── exterior-window-sticker-blank.md
   └── exterior-window-sticker-custom.md
   ```

### Product Page Frontmatter
Here's the complete frontmatter structure for product pages:

```yaml
---
title: "Window Sticker"
description: "High-quality window sticker for automotive use"
date: 2024-01-01
draft: false
---
```

## Adding New Pages

### Adding a New Product

1. Create product data file in `data/products/`:
   ```bash
   touch data/products/new-product.yaml
   ```

2. Create base product page:
   ```bash
   touch content/new-product.md
   ```

3. Create category-specific product pages:
   ```bash
   for category in content/*/; do
     touch "$category/new-product.md"
   done
   ```

### Adding a New Category

1. Create category directory:
   ```bash
   mkdir content/new-category
   ```

2. Create category index:
   ```bash
   touch content/new-category/_index.md
   ```

3. Copy product pages:
   ```bash
   for product in content/*.md; do
     if [ -f "$product" ]; then
       cp "$product" "content/new-category/"
     fi
   done
   ```

## Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
hugo server -D --disableFastRender
```

### Building for Production
```bash
# Build with minification
hugo --minify

# Or using npm script
npm run build
```

The built site will be in the `public/` directory, ready for deployment.

### Working with Tailwind CSS
```bash
# Watch for changes during development
npm run tailwind:watch

# Build minified CSS for production
npm run tailwind:build
```

For more information about Hugo, visit the [official Hugo documentation](https://gohugo.io/documentation/).
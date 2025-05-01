# Nutcracker Project Documentation

## Project Overview
This is a Hugo-based website for Nutcracker products, converted from a Carrd template. The site is built with modern web standards and includes responsive design for optimal viewing across different devices. The primary focus is on product presentation and information delivery, with a clean, professional design that showcases the products effectively.

## Technical Stack
- **Static Site Generator**: Hugo v0.140.2 (extended version)
- **CSS Framework**: Tailwind CSS v3.3.0
- **Language**: Go Templates (Hugo), HTML5, CSS3
- **Design Source**: Carrd template conversion
- **Performance**: Optimized for maximum speed on all devices
- **Deployment**: Netlify static hosting (nutcrackerpro.netlify.app)

## Getting Started: Complete Setup Guide

This section provides comprehensive instructions for setting up and running the Nutcracker website project for both AI assistants and human developers.

### Prerequisites
- **Node.js**: v16.x or later
- **npm**: v8.x or later
- **Hugo**: v0.140.2 (extended version)
- **Git**: Latest version

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/popskraft/nutcracker.git
   cd nutcracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Verify Hugo installation**:
   ```bash
   hugo version
   ```
   Ensure you have Hugo v0.140.2 (extended version) installed.

## Project Structure
```
nutcracker/
├── archetypes/          # Content templates
├── assets/              # Process-needed assets
│   ├── css/             # CSS files
│   ├── js/              # JavaScript files
│   ├── tailwind/        # Tailwind CSS configuration
│   │   ├── tailwind.config.js  # Tailwind configuration
│   │   └── src/base.css        # Tailwind source CSS
│   └── tailwindstyle.css # Compiled Tailwind CSS
├── content/             # Main content directory
│   ├── _index.md        # Homepage content
│   ├── about.md         # About page
│   ├── articles/        # Blog articles
│   ├── privacy-policy.md # Privacy policy
│   ├── products/        # Product pages
│   │   ├── hand-cleaner.md  # Hand cleaner product
│   │   └── nitrile-gloves.md # Nitrile gloves product
│   ├── states/          # State-specific pages
│   └── thank-you.md     # Form submission confirmation
├── data/                # Site data files
│   ├── products/        # Product data
│   └── states/          # State-specific data
├── layouts/             # HTML templates
│   ├── _default/        # Default template files
│   │   ├── baseof.html  # Base template
│   │   ├── list.html    # List template
│   │   └── single.html  # Single template
│   ├── partials/        # Template partials
│   │   ├── benefits/    # Benefits section partials
│   │   ├── forms/       # Form partials
│   │   ├── schema/      # Schema.org JSON-LD partials
│   │   └── coverSlider.html # Cover image/slider partial
│   └── shortcodes/      # Hugo shortcodes
├── static/              # Static assets
│   └── images/          # Image files
├── hugo.yaml            # Hugo configuration
├── package.json         # NPM package configuration
└── netlify.toml         # Netlify deployment configuration
```

## Development Workflow

### Starting the Development Environment

The project includes several npm scripts to streamline development:

1. **Full Development Environment** (Recommended):
   ```bash
   npm run dev:all
   ```
   This command runs both the Hugo server and Tailwind CSS watch process concurrently using the following:
   - Hugo server with live reload at http://localhost:1313
   - Tailwind CSS in watch mode to automatically compile CSS changes

2. **Hugo Server Only**:
   ```bash
   npm run dev
   ```
   Runs only the Hugo development server with live reload.

3. **Tailwind CSS Watch Only**:
   ```bash
   npm run tailwind:watch
   ```
   Only watches and compiles Tailwind CSS changes without starting the Hugo server.

### Building for Production

To build the site for production:

```bash
npm run build
```

This command:
1. Builds the Hugo site with garbage collection and minification
2. Outputs to the `public` directory

### Tailwind CSS Configuration

- **Source File**: `./assets/tailwind/src/base.css`
- **Output File**: `./assets/tailwindstyle.css`
- **Configuration**: `./assets/tailwind/tailwind.config.js`

#### Tailwind CSS Commands

- **Watch Mode**:
  ```bash
  npm run tailwind:watch
  ```
  This watches for changes in the Tailwind source files and recompiles automatically.
  Command: `npx tailwindcss -i ./assets/tailwind/src/base.css -o ./assets/tailwindstyle.css --watch --config ./assets/tailwind/tailwind.config.js`

- **Build for Production**:
  ```bash
  npm run tailwind:build
  ```
  This builds and minifies the Tailwind CSS for production.
  Command: `npx tailwindcss -i ./assets/tailwind/src/base.css -o ./assets/tailwindstyle.css --minify --config ./assets/tailwind/tailwind.config.js`

#### CSS Fingerprinting

Hugo's fingerprinting is used for cache busting:
```html
{{ with resources.Get "tailwindstyle.css" }}
{{ $tailwind := . | minify }}
{{ $tailwind := $tailwind | fingerprint }}
<link rel="stylesheet" href="{{ $tailwind.RelPermalink }}" integrity="{{ $tailwind.Data.Integrity }}" crossorigin="anonymous">
{{ end }}
```

### Server Restart Policy

- Only restart the server when system requirements change or when fixing errors that prevent proper operation
- For simple content or style changes, server restart is NOT necessary (Hugo's live reload will handle these changes)
- Avoid unnecessary server restarts to maintain an efficient development workflow

## Content Management

### Content Types
- Product Pages
- About Section
- Terms & Conditions
- Privacy Policy
- Contact Forms
- Articles
- State-specific Pages
- FAQ sections

### Modular Product Data Structure

Products use a modular data structure where product information is stored in YAML files in the `data/products/` directory, and product pages in the `content/exterior/` directory reference this data through the `product_id` parameter.

#### Product Data Structure (YAML)

```yaml
id: "product-id"
title: "Product Title with **Markdown** Support"
size: "8.5 x 11\""
description: "Detailed product description."
features:
  - "Feature 1"
  - "Feature 2"
  - "Feature 3"
price: 0.39
price_note: "per item (min quantity)"
best_price_note: "* Best Price for AK Dealer Services"
purchase_links:
  - name: "Buy on AK Dealer Services"
    url: "https://akdealerservices.com/product/1000000-product-name"
    icon: "cart"
    primary: true
  - name: "Buy on Amazon"
    url: "#"
    icon: "cart"
    primary: false
images:
  - src: "images/EXTERIOR/product-image-1.jpg"
    alt: "Product Image Alt Text"
    primary: true
  - src: "images/EXTERIOR/product-image-2.jpg"
    alt: "Product Image Alt Text"
    primary: false
```

#### Product Page Structure (Markdown)

```yaml
---
title: "Product Name"
layout: "product"
description: "Details about the product."
product_id: "product-id"
---
```

### Creating New Products

1. **Create a product page**:
   ```bash
   hugo new exterior/new-product-name.md
   ```
   This creates a new product page based on the `archetypes/product.md` archetype.

2. **Generate product data YAML file**:
   ```bash
   bash archetypes/product-data-generator.sh new-product-name
   ```
   This creates a YAML file with product data in `data/products/new-product-name.yaml`.

3. **Edit product data**:
   Update the created YAML file with the correct product data:
   - Title and description
   - Features
   - Price and price notes
   - Purchase links
   - Paths to images in the `assets/images/EXTERIOR/` folder

3. **Adding FAQ Data**:
   FAQ data is stored in page frontmatter, not in global configuration:
   ```yaml
   faq:
     questions:
       - question: "Frequently asked question 1?"
         answer: "Answer to the first question."
       - question: "Frequently asked question 2?"
         answer: "Answer to the second question."
   ```

4. **Image Processing Pattern**:
   The site uses a standardized image processing pattern:
   ```go-html-template
   {{ with .Page.Params.coverImage }}
     {{ $image := resources.Get . }}
     {{ with $image }}
       {{ $filter := images.UnsharpMask .5 .5 0 }}
       {{ $processed := $image.Filter $filter }}
       {{ $final := $processed.Fill "756x756 webp picture Center" }}
       <img 
         src="{{ $final.RelPermalink }}" 
         alt="{{ $.Page.Params.coverImageAlt }}" 
         title="{{ $.Page.Params.coverImageTitle }}"
         loading="eager"
       />
     {{ end }}
   {{ end }}
   ```

   Key components:
   - Desktop images: Fill 756x756 webp picture Center
   - Mobile images: Resize 600x webp picture Center
   - UnsharpMask filter for image enhancement (0.5, 0.5, 0)
   - WebP format for better compression
   - Eager loading for above-the-fold images

5. **Adding New Images**:
   - Place image files in the appropriate directory under `/static/images/` (for cover slider images)
   - Or for products, place them in `/assets/images/productname/`
   - Reference them in front matter using relative paths from the static directory
   - Optimize images before adding them to the project (use WebP format when possible)

## File Naming Conventions
- Content files: lowercase with hyphens (e.g., `product-name.md`)
- Template partials: lowercase with hyphens
- Asset files: descriptive names matching Carrd structure
- Use double quotes in YAML only when needed (for values with spaces or special characters)

## Deployment and Maintenance

### Deployment to Netlify

The site is deployed to Netlify with the following configuration:

1. **Build Command**: `hugo --gc --minify`
2. **Publish Directory**: `public`
3. **Hugo Version**: 0.140.2
4. **Domain**: nutcrackerpro.netlify.app
5. **Configuration File**: `netlify.toml`

#### Deployment Process

1. **Prepare for deployment**:
   ```bash
   # Build Tailwind CSS for production
   npm run tailwind:build
   
   # Build Hugo site
   npm run build
   ```

2. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin main
   ```

3. **Netlify Automatic Deployment**:
   - Netlify automatically detects changes to the repository
   - Builds and deploys the site according to the configuration in netlify.toml
   - Form submissions are handled by Netlify Forms

### Manual Deployment

If you need to deploy manually without GitHub integration:

1. **Build the site locally**:
   ```bash
   npm run build
   ```

2. **Deploy the `public` directory** to your hosting provider.

### Updating the Website

#### Content Updates

1. **Edit existing content**:
   - Locate the appropriate Markdown file in the `content/` directory
   - Make changes to the content or front matter
   - Test changes locally with `npm run dev:all`

2. **Add new content**:
   - Create new Markdown files in the appropriate directory
   - Include all required front matter fields
   - Test locally before deploying

#### Template Updates

1. **Edit template files**:
   - Locate the appropriate template in the `layouts/` directory
   - Make changes to the HTML/template code
   - Test changes locally with `npm run dev:all`

2. **Update partials**:
   - Edit files in the `layouts/partials/` directory
   - Test thoroughly to ensure changes don't break existing pages

#### Style Updates

1. **Edit Tailwind CSS**:
   - Modify the source file at `./assets/tailwind/src/base.css`
   - Run `npm run tailwind:watch` to compile changes
   - Test changes locally

2. **Add custom CSS**:
   - Add custom styles to files in the `assets/css/` directory
   - Reference them in the appropriate template files

### Troubleshooting Common Issues

1. **Hugo Server Won't Start**:
   - Check Hugo version with `hugo version`
   - Ensure you have the extended version installed
   - Verify there are no syntax errors in template files

2. **CSS Changes Not Appearing**:
   - Ensure Tailwind watch process is running
   - Check browser cache (hard refresh with Ctrl+F5)
   - Verify the CSS path in the HTML source

3. **Images Not Displaying**:
   - Check file paths in front matter
   - Ensure images exist in the correct location
   - Verify image processing code in templates

4. **Deployment Failures**:
   - Check Netlify build logs for errors
   - Verify Hugo version in netlify.toml
   - Test build locally with `npm run build`

## Schema.org Implementation
The site uses a modular Schema.org implementation for structured data:

1. **Base Schema Types** (always included):
   - Website schema
   - Organization schema

2. **Page-Specific Schema Types**:
   - Homepage: WebPage + FAQ (if present)
   - Product pages: WebPage + Product + FAQ (if present)
   - Article pages: WebPage + Article
   - About page: WebPage + AboutPage
   - Other pages: WebPage only

3. **Schema Partials**:
   - Each schema type has its own partial in `/layouts/partials/schema/`
   - FAQ schema only included when page has faq frontmatter
   - All schemas use dynamic data from page context

4. **JSON-LD Output Formatting**:
   - Use `{{- -}}` syntax to trim whitespace around Hugo template actions
   - Maintain proper JSON structure with correct comma placement
   - Avoid string escaping in the output
   - Use consistent indentation for readability
   - Ensure valid JSON-LD structure that search engines can parse

## For AI Assistants: Working with This Codebase

This section provides specific guidance for AI assistants working with the Nutcracker codebase.

### Understanding the Codebase Structure

1. **Key Template Files**:
   - `layouts/_default/baseof.html`: Main template that wraps all pages
   - `layouts/partials/coverSlider.html`: Cover image/slider implementation
   - `layouts/partials/schema/*.html`: Schema.org structured data templates
   - `layouts/partials/benefits/*.html`: Product benefits section templates

2. **Content Organization**:
   - Product data is stored in both front matter and data files
   - FAQ data is stored in page front matter, not in global configuration
   - State-specific data is stored in `data/states/` directory

3. **Dynamic Data Pattern for Products from Data Files**:
   ```go
   {{ $filename := .File.BaseFileName }}
   {{ $dataSavings := or .Page.Params.savings (index .Site.Data.products $filename "savings") }}
   ```
   This pattern falls back to data files when front matter doesn't provide values.

### Common Tasks for AI Assistants

1. **Adding a New Product Page**:
   - Create a new markdown file in `content/products/`
   - Include all required front matter fields
   - Reference existing product pages for structure

2. **Updating Cover Images**:
   - Update the `coverImage` and `coverImageMobile` in front matter
   - Ensure images are properly sized and optimized
   - Follow the established image processing pattern

3. **Modifying Schema.org Data**:
   - Edit the appropriate schema partial in `layouts/partials/schema/`
   - Ensure valid JSON-LD structure
   - Use proper whitespace trimming with `{{- -}}` syntax

### Troubleshooting for AI Assistants

1. **Context Issues in Templates**:
   - Store needed values in variables before entering nested contexts
   - Use `$` prefix to access global context
   - Use `.Page` to access page context from within partials

2. **Image Processing Errors**:
   - Check for double with-check pattern
   - Verify image paths are correct
   - Ensure proper error handling for missing images

3. **Schema.org Issues**:
   - Verify JSON syntax is valid
   - Check for proper comma placement
   - Ensure all URLs are absolute with `absURL` filter

## Version Control
- `.gitignore` configured for Hugo
- Excludes:
  - `/public/`
  - `/resources/_gen/`
  - `/assets/jsconfig.json`
  - `hugo_stats.json`
  - `.hugo_build.lock`
  - `.DS_Store`

### Version Control Guidelines

1. **Commit Messages**:
   - Use clear, descriptive commit messages
   - Start with a verb in present tense (e.g., "Add", "Update", "Fix")
   - Include the scope of the change (e.g., "Update product schema template")

2. **Branching Strategy**:
   - Use feature branches for new features
   - Use fix branches for bug fixes
   - Merge to main branch only after testing

3. **Pull Requests**:
   - Include a clear description of changes
   - Reference any related issues
   - Ensure all tests pass before merging

## Best Practices

1. Maintain design consistency with Carrd template
2. Optimize all images and assets for performance
3. Ensure responsive design works on all devices
4. Follow semantic HTML structure
5. Implement proper meta tags for SEO
6. Use appropriate caching strategies
7. Follow server restart policy:
   - Only restart the Hugo server when necessary (system changes or error fixes)
   - Rely on Hugo's live reload for content and style changes
   - Minimize unnecessary server restarts for efficient development
8. Use Tailwind utility classes for consistent styling
9. Keep FAQ data in content frontmatter, not in global configuration
10. Use double quotes in YAML only when needed (for values with spaces or special characters)
11. Run Tailwind build before deploying to ensure latest CSS changes are included

## Future Considerations
- SEO optimization
- Performance monitoring
- Analytics integration
- Social media integration
- Content delivery optimization
- Server-side caching strategies
- Automated asset optimization

## Support and Maintenance
For questions or issues:
- Check Hugo documentation: https://gohugo.io/documentation/
- Review project structure
- Consult this documentation file

## Communication and Collaboration
- All communication regarding project updates, issues, and feature requests should be documented in the project management tool.
- Regular check-ins will be scheduled to discuss progress and address any blockers.
- Code reviews are mandatory for all new features or significant changes to ensure quality and maintainability.
- Documentation should be kept up to date with any changes made to the project to assist future developers and maintainers.
- Use clear and descriptive commit messages to document changes in the version control system.
- Do not push changes to GitHub automatically. Only commit and push changes when explicitly requested.

Last Updated: 2025-03-30

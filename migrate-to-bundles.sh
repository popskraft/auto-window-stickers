#!/bin/bash

# migrate-to-bundles.sh - Migrate existing content files to bundle structure
# Converts: content/category/product.md -> content/category/product/index.md

set -e

echo "Starting migration to bundle structure..."

# Function to migrate files in a directory
migrate_directory() {
    local dir=$1
    local category=$(basename "$dir")
    
    echo "Processing directory: $dir"
    
    # Find all .md files except _index.md
    find "$dir" -maxdepth 1 -type f -name "*.md" ! -name "_index.md" | while read -r file; do
        # Get filename without extension
        local basename=$(basename "$file" .md)
        
        # Create bundle directory
        local bundle_dir="$dir/$basename"
        
        # Skip if bundle already exists
        if [ -d "$bundle_dir" ]; then
            echo "  Skip (bundle exists): $basename"
            continue
        fi
        
        # Create bundle directory
        mkdir -p "$bundle_dir"
        
        # Move file to index.md in bundle
        mv "$file" "$bundle_dir/index.md"
        
        echo "  Migrated: $basename -> $basename/index.md"
    done
}

# Migrate interior products
if [ -d "content/interior" ]; then
    migrate_directory "content/interior"
fi

# Migrate exterior products
if [ -d "content/exterior" ]; then
    migrate_directory "content/exterior"
fi

echo ""
echo "Migration complete!"
echo ""
echo "Summary:"
echo "- All product files have been converted to bundle structure"
echo "- Old structure: content/category/product.md"
echo "- New structure: content/category/product/index.md"
echo ""
echo "Next steps:"
echo "1. Test your Hugo site: hugo server"
echo "2. Verify all pages load correctly"
echo "3. Commit changes to git"

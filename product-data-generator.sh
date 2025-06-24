#!/bin/bash

# product-data-generator.sh - Script to create only data files for a new product
# Usage: ./product-data-generator.sh "Product Name" [exterior|interior]

# Check if product name is provided
if [ -z "$1" ]; then
    echo "Error: Product name is required."
    echo "Usage: ./product-data-generator.sh \"Product Name\" [exterior|interior]"
    exit 1
fi

# Set default category to exterior if not provided
CATEGORY=${2:-exterior}
if [ "$CATEGORY" != "exterior" ] && [ "$CATEGORY" != "interior" ]; then
    echo "Error: Category must be either 'exterior' or 'interior'."
    echo "Usage: ./product-data-generator.sh \"Product Name\" [exterior|interior]"
    exit 1
fi

# Convert product name to slug format (lowercase with hyphens)
PRODUCT_NAME="$1"
PRODUCT_SLUG=$(echo "$PRODUCT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')

# Define file paths
DATA_DIR="data/products"
DATA_FILE="$DATA_DIR/$CATEGORY-$PRODUCT_SLUG.yaml"

# Check if file already exists
if [ -f "$DATA_FILE" ]; then
    echo "Error: Data file already exists: $DATA_FILE"
    exit 1
fi

# Create directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Create data file by copying and modifying the archetype
echo "Creating data file: $DATA_FILE"
cp "archetypes/product-data.yaml" "$DATA_FILE"

# Replace placeholder values in the data file
sed -i '' "s/title: \".*\"/title: \"$PRODUCT_NAME\"/" "$DATA_FILE"
sed -i '' "s|images/CATEGORY|images/${CATEGORY^^}|g" "$DATA_FILE"

# Update purchase links with correct product name in URL
PRODUCT_URL_SLUG=$(echo "$PRODUCT_SLUG" | sed 's/-/-/g')
sed -i '' "s|1000000-product-name|1000000-$PRODUCT_URL_SLUG|" "$DATA_FILE"

echo "Product data file created successfully!"
echo "Data: $DATA_FILE"
echo ""
echo "Next steps:"
echo "1. Edit $DATA_FILE to update product details"
echo "2. Add product images to static/images/${CATEGORY^^}/"
echo "3. Update purchase links with correct product IDs"

# Remind about content file if it doesn't exist
CONTENT_FILE="content/$CATEGORY/$CATEGORY-$PRODUCT_SLUG.md"
if [ ! -f "$CONTENT_FILE" ]; then
    echo ""
    echo "Note: Content file does not exist for this product."
    echo "If you want to create it, run:"
    echo "hugo new --kind product \"$CATEGORY/$CATEGORY-$PRODUCT_SLUG.md\""
fi

exit 0

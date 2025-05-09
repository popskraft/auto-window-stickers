#!/bin/bash

# Script to create a new product with both content and data files
# Usage: ./create-product.sh product-name [state]

if [ $# -lt 1 ]; then
  echo "Usage: ./create-product.sh product-name [state]"
  echo "Example: ./create-product.sh exterior-window-sticker-custom texas"
  exit 1
fi

PRODUCT_NAME=$1
STATE=${2:-""}  # Optional state parameter
PRODUCT_DIR=""

# Determine the product directory based on whether a state is provided
if [ -z "$STATE" ]; then
  # No state provided, use the product category from the name
  CATEGORY=$(echo $PRODUCT_NAME | cut -d'-' -f1)
  PRODUCT_DIR="content/$CATEGORY"
else
  # State provided, create in state-specific directory
  CATEGORY=$(echo $PRODUCT_NAME | cut -d'-' -f1)
  PRODUCT_DIR="content/$CATEGORY/$STATE"
  
  # Create state directory if it doesn't exist
  mkdir -p "$PRODUCT_DIR"
fi

# Create the content file using Hugo's new command
hugo new "$PRODUCT_DIR/$PRODUCT_NAME.md" --kind product

# Create the data file by copying the product-data.yaml template
DATA_DIR="data/products"
mkdir -p "$DATA_DIR"

# Copy the template and replace placeholders
cp "archetypes/product-data.yaml" "$DATA_DIR/$PRODUCT_NAME.yaml"

# Set the ID in the data file to match the filename
sed -i '' "s/^id: .*$/id: \"$PRODUCT_NAME\"/g" "$DATA_DIR/$PRODUCT_NAME.yaml"
sed -i '' "s/{{ replace .Name \\\\-\\\" \\\" | title }}/$(echo $PRODUCT_NAME | tr '-' ' ' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')/g" "$DATA_DIR/$PRODUCT_NAME.yaml"

echo "Created product content at $PRODUCT_DIR/$PRODUCT_NAME.md"
echo "Created product data at $DATA_DIR/$PRODUCT_NAME.yaml"
echo ""
echo "Next steps:"
echo "1. Edit the data file to add specific product details"
echo "2. Update the content file if needed for state-specific information"
echo "3. Add product images to the appropriate directory"

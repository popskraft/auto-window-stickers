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
  
  # Check if state data file exists, create if not
  STATE_DATA_FILE="data/states/$STATE.yaml"
  if [ ! -f "$STATE_DATA_FILE" ]; then
    echo "State data file not found. Creating template at $STATE_DATA_FILE"
    mkdir -p "data/states"
    cat > "$STATE_DATA_FILE" << EOF
suffix: # State abbreviation (e.g., TX)
name: # Full state name (e.g., Texas)
adjective: # State adjective (e.g., Texan)
citiesList:
  - # Major city 1
  - # Major city 2
priceSuffix: # Shipping info specific to state
keyIndustries:
  - # Industry 1
  - # Industry 2
seoKeywords:
  - # SEO keyword 1
  - # SEO keyword 2
EOF
    echo "Please update the state data file with actual values."
  fi
fi

# Create the content file using Hugo's new command
hugo new "$PRODUCT_DIR/$PRODUCT_NAME.md" --kind product

DATA_DIR="data/products"
mkdir -p "$DATA_DIR"

# Copy the template and replace placeholders
cp "archetypes/product-data.yaml" "$DATA_DIR/$PRODUCT_NAME.yaml"

# Replace title placeholder with formatted product name
sed -i '' "s/{{ replace .Name '-' ' ' | title }}/$(echo $PRODUCT_NAME | tr '-' ' ' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')/g" "$DATA_DIR/$PRODUCT_NAME.yaml"

echo "Created product content at $PRODUCT_DIR/$PRODUCT_NAME.md"
echo "Created product data at $DATA_DIR/$PRODUCT_NAME.yaml"
echo ""
echo "Next steps:"
echo "1. Edit the data file to add specific product details"
echo "2. Update the content file if needed for state-specific information"
echo "3. Add product images to the appropriate directory"

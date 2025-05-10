#!/bin/bash

# Script for automatic creation of product data YAML file
# Usage: ./product-data-generator.sh product-name

if [ -z "$1" ]; then
  echo "Product name is required"
  echo "Usage: ./product-data-generator.sh product-name"
  exit 1
fi

PRODUCT_NAME="$1"
PRODUCT_ID="${PRODUCT_NAME}"
TITLE=$(echo "${PRODUCT_NAME}" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
DATA_FILE="data/products/${PRODUCT_ID}.yaml"

# Check if data file already exists
if [ -f "${DATA_FILE}" ]; then
  echo "Data file ${DATA_FILE} already exists"
  exit 1
fi

# Create data file
cat > "${DATA_FILE}" << EOF
title: "${TITLE}"
weight: 10
size: "8.5 x 11\""
description: "Description for ${TITLE} goes here."
features:
  - "Size 8.5 x 11"
  - "Waterproof material"
  - "Highly visible"
  - "Fade resistant"
  - "Die cut on back"
  - "Full color printing available"
  - "No set up charge"
  - "1-part, self-adhesive, 4 sides"
price: 0.00
price_note: "per item (min quantity)"
# best_price_note: "Best Price for AK Dealer Services"
purchase_links:
  - name: # "Buy on AK Dealer Services"
    url: "https://akdealerservices.com/product/1000000-product-name"
  - name: # "Buy on Amazon"
    # url: "#"
images:
  - src: "images/EXTERIOR/${PRODUCT_ID}-1.jpg"
  - src: "images/EXTERIOR/${PRODUCT_ID}-2.jpg"
  - src: "images/EXTERIOR/${PRODUCT_ID}-3.jpg"
EOF

echo "Data file ${DATA_FILE} successfully created"
echo "Don't forget to update product information and image paths"

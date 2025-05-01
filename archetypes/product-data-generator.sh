#!/bin/bash

# Скрипт для автоматического создания YAML файла данных продукта
# Использование: ./product-data-generator.sh product-name

if [ -z "$1" ]; then
  echo "Необходимо указать имя продукта"
  echo "Использование: ./product-data-generator.sh product-name"
  exit 1
fi

PRODUCT_NAME="$1"
PRODUCT_ID="${PRODUCT_NAME}"
TITLE=$(echo "${PRODUCT_NAME}" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
DATA_FILE="data/products/${PRODUCT_ID}.yaml"

# Проверяем, существует ли уже файл данных
if [ -f "${DATA_FILE}" ]; then
  echo "Файл данных ${DATA_FILE} уже существует"
  exit 1
fi

# Создаем файл данных
cat > "${DATA_FILE}" << EOF
id: "${PRODUCT_ID}"
title: "${TITLE}"
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
  - name: "Wholesale Inquiry"
    url: "#wholesale"
    icon: "cart"
    primary: false
images:
  - src: "images/EXTERIOR/${PRODUCT_ID}-1.jpg"
    alt: "${TITLE}"
    primary: true
  - src: "images/EXTERIOR/${PRODUCT_ID}-2.jpg"
    alt: "${TITLE}"
    primary: false
  - src: "images/EXTERIOR/${PRODUCT_ID}-3.jpg"
    alt: "${TITLE}"
    primary: false
EOF

echo "Файл данных ${DATA_FILE} успешно создан"
echo "Не забудьте обновить информацию о продукте и пути к изображениям"

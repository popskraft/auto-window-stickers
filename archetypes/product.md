---
title: "{{ replace .Name \"-\" \" \" | title }}"
layout: "product"
description: "Details about the {{ replace .Name \"-\" \" \" | lower }} product."
date: {{ .Date }}
product_id: "{{ .Name }}"

# Эти поля будут использоваться для создания соответствующего YAML файла в data/products/
# При создании нового продукта вам нужно будет вручную создать YAML файл с этими данными
# или использовать скрипт для автоматического создания

# Основная информация о продукте
# id: "{{ .Name }}"
# title: "{{ replace .Name \"-\" \" \" | title }}"
# size: "8.5 x 11\""
# description: "Product description goes here."

# Характеристики продукта
# features:
#   - "Size 8.5 x 11"
#   - "Waterproof material"
#   - "Highly visible"
#   - "Fade resistant"
#   - "Die cut on back"
#   - "Full color printing available"
#   - "No set up charge"
#   - "1-part, self-adhesive, 4 sides"

# Информация о цене
# price: 0.00
# price_note: "per item (min quantity)"
# best_price_note: "* Best Price for AK Dealer Services"

# Ссылки для покупки
# purchase_links:
#   - name: "Buy on AK Dealer Services"
#     url: "https://akdealerservices.com/product/1000000-product-name"
#     icon: "cart"
#     primary: true
#   - name: "Buy on Amazon"
#     url: "#"
#     icon: "cart"
#     primary: false
#   - name: "Wholesale Inquiry"
#     url: "#wholesale"
#     icon: "cart"
#     primary: false

# Изображения продукта
# images:
#   - src: "images/EXTERIOR/product-image-1.jpg"
#     alt: "{{ replace .Name \"-\" \" \" | title }}"
#     primary: true
#   - src: "images/EXTERIOR/product-image-2.jpg"
#     alt: "{{ replace .Name \"-\" \" \" | title }}"
#     primary: false
#   - src: "images/EXTERIOR/product-image-3.jpg"
#     alt: "{{ replace .Name \"-\" \" \" | title }}"
#     primary: false
---

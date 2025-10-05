# Quick Start: Page Bundles

## Создание нового продукта

```bash
./create-product.sh "Product Name" interior
# или
./create-product.sh "Product Name" exterior
```

Создаст:
- `content/interior/interior-product-name/index.md` (контент)
- `data/products/interior-product-name.yaml` (данные)

## Структура Page Bundle

```
content/interior/interior-product-name/
├── index.md          # Основной контент (front matter)
└── [images/]         # Опционально: изображения для этой страницы
```

## Важно

- ✅ Всегда используйте `index.md` внутри папки
- ✅ URL будет: `/interior/interior-product-name/`
- ✅ Нет редиректов, чистые URL
- ❌ Не создавайте одиночные `.md` файлы

## Генерация страниц со штатами

```bash
python generate-pages.py --type product --limit 10
# Создаст: content/states/{state}/{product}/index.md
```

## Проверка

```bash
hugo server
# Откройте: http://localhost:1313/interior/interior-product-name/
```

---

📚 Подробности: [MIGRATION-TO-BUNDLES.md](MIGRATION-TO-BUNDLES.md)  
📖 Основная документация: [handbook.md](handbook.md)

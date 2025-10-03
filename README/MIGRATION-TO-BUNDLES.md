# Миграция на Page Bundles структуру

## Что изменилось

Структура контента Hugo была переведена с одиночных файлов на **Page Bundles** (папка + index.md).

### Старая структура
```
content/
├── interior/
│   ├── interior-addendum-blank.md
│   ├── interior-addendum-custom.md
│   └── ...
└── exterior/
    ├── exterior-addendum-blank.md
    └── ...
```

### Новая структура (Page Bundles)
```
content/
├── interior/
│   ├── interior-addendum-blank/
│   │   └── index.md
│   ├── interior-addendum-custom/
│   │   └── index.md
│   └── ...
└── exterior/
    ├── exterior-addendum-blank/
    │   └── index.md
    └── ...
```

## Преимущества Page Bundles

1. **Нет редиректов** - Hugo не создает автоматические редиректы для URL без слэша в конце
2. **Лучшая организация** - все ресурсы страницы (изображения, файлы) могут храниться в одной папке
3. **Упрощенная работа с ресурсами** - Page Resources API Hugo работает только с bundles
4. **Чистые URL** - `/interior/interior-addendum-blank/` вместо `/interior/interior-addendum-blank.html`

## Обновленные файлы

### 1. `tools/page-generator/config.yaml`
Добавлен новый паттерн для базовых страниц продуктов:
```yaml
pages:
  layout: "product"
  filename_pattern: "states/{state_slug}/{product_key}/index.md"          # Для state-страниц
  base_product_pattern: "{category}/{product_key}/index.md"               # Для базовых продуктов
```

### 2. `create-product.sh`
Обновлен для создания bundle-структуры:
- Создает папку `content/$CATEGORY/$CATEGORY-$PRODUCT_SLUG/`
- Создает файл `index.md` внутри папки
- Команда Hugo: `hugo new --kind product "$CATEGORY/$CATEGORY-$PRODUCT_SLUG/index.md"`

### 3. `migrate-to-bundles.sh` (новый)
Скрипт для автоматической миграции существующих файлов:
- Находит все `.md` файлы (кроме `_index.md`)
- Создает папку с именем файла
- Перемещает файл в `index.md` внутри папки

## Как использовать

### Создание нового продукта
```bash
./create-product.sh "Product Name" interior
# Создаст: content/interior/interior-product-name/index.md
```

### Миграция существующих файлов (уже выполнено)
```bash
./migrate-to-bundles.sh
```

### Генерация страниц со states
```bash
python generate-pages.py --type product --limit 10
# Создаст: content/states/{state}/{product}/index.md
```

## Проверка

1. Запустить Hugo сервер:
```bash
hugo server
```

2. Проверить URL страниц:
   - ✅ `/interior/interior-addendum-blank/` (с слэшем)
   - ✅ Нет редиректов
   - ✅ Все страницы загружаются корректно

## Совместимость

- **Hugo версия**: Работает со всеми версиями Hugo (Page Bundles поддерживаются с v0.32+)
- **Существующие ссылки**: Все внутренние ссылки продолжают работать
- **SEO**: URL остаются прежними (с trailing slash)

## Откат (если нужен)

Если потребуется вернуться к старой структуре:
```bash
# Переместить index.md обратно
find content/interior -type f -name "index.md" | while read file; do
    dir=$(dirname "$file")
    basename=$(basename "$dir")
    mv "$file" "content/interior/$basename.md"
    rmdir "$dir"
done
```

## Дата миграции
2025-10-03

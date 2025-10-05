# Auto Window Stickers

Hugo-based marketing site for exterior and interior car window stickers.

---

## 📚 Документация

**→ [Полный индекс документации](README/INDEX.md)**

### Быстрый доступ к руководствам:

- **[HANDBOOK.md](README/HANDBOOK.md)** — общее руководство по проекту
- **[PUBLISHING-QUICKSTART.md](README/PUBLISHING-QUICKSTART.md)** — автоматическая публикация за 15 минут
- **[BUNDLES-QUICKSTART.md](README/BUNDLES-QUICKSTART.md)** — миграция на Page Bundles

---

## 🚀 Быстрый старт

### Локальная разработка

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск dev-сервера с Tailwind
npm run dev:all

# 3. Открыть: http://localhost:1313
```

### Генерация контента

```bash
# Генерация страниц продуктов (700 штук)
python generate-pages.py --type product

# Тестовый запуск (2 страницы)
python generate-pages.py --type product --limit 2 --dry-run
```

### Production сборка

```bash
npm run build
# Результат в папке: public/
```

---

## 🔧 Требования

- **Hugo Extended** v0.140.2+
- **Node.js** ≥16
- **Python 3** (для генерации контента)

---

## 📝 Структура контента

Проект использует **Hugo Page Bundles** (папка + index.md):

```
content/
├── exterior/
│   ├── exterior-addendum-blank/
│   │   └── index.md
│   └── exterior-window-sticker-custom/
│       └── index.md
└── interior/
    └── interior-addendum-blank/
        └── index.md
```

**Данные продуктов:**
- YAML: `data/products/<product>.yaml` (цены, характеристики, галерея)
- Markdown: `content/<area>/<product>/index.md` (текст страницы)

---

## 🤝 Workflow разработки

1. Создайте ветку от `main`
2. Внесите изменения
3. Закоммитьте с понятным сообщением
4. Создайте Pull Request
5. Netlify автоматически создаст preview build

---

**Подробности:** См. [HANDBOOK.md](README/HANDBOOK.md) для детальной информации о структуре, автоматизации и правилах работы с YAML.

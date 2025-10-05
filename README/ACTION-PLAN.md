# План действий — Auto Window Stickers SEO Fix

## 📅 Временная шкала

```
День 1 (2 часа)     → Критические исправления
День 2-3 (4 часа)   → UI улучшения
Неделя 1 (8 часов)  → Контент и структура
Месяц 1 (20 часов)  → Полная оптимизация
```

---

## 🔴 День 1: Критические исправления (2 часа)

### Задача 1: Исправить Canonical URLs (30 мин)

**Вариант A — Быстрый (рекомендуется для старта)**

1. Открыть `layouts/_default/baseof.html`
2. Найти строку 33:
   ```html
   <link rel="canonical" href="{{ or .Params.canonical .Params.seo.canonical .Permalink | safeURL }}">
   ```
3. Заменить на:
   ```html
   <link rel="canonical" href="{{ .Permalink | safeURL }}">
   ```
4. Сохранить

**Проверка:**
```bash
npm run dev
# Открыть: http://localhost:1313/states/alabama/exterior-addendum-blank/
# View Source → проверить canonical
```

---

### Задача 2: Улучшить Meta Descriptions (45 мин)

1. Открыть `tools/page-generator/generate-pages.py`
2. Найти функцию генерации description (примерно строка 300-400)
3. Заменить код:

```python
# БЫЛО:
description = f"Details about the {product_title.lower()} product in {state_name}."

# СТАЛО:
def generate_meta_description(product_data, state_name, keyword):
    """Generate unique, SEO-optimized meta description."""
    product_title = product_data.get('title', '').replace('**', '')
    size = product_data.get('size', '')
    price = product_data.get('price', '')
    
    description = (
        f"Buy {product_title} in {state_name}. "
        f"{size} {keyword}. "
        f"${price} each. "
        f"Weather-resistant, laser-compatible. "
        f"Free shipping on bulk orders. Shop now!"
    )
    
    return description[:160]

# Использовать:
front_matter['description'] = generate_meta_description(
    product_data, state_name, selected_keyword
)
```

---

### Задача 3: Оптимизировать SEO Titles (30 мин)

В том же файле `generate-pages.py`:

```python
# БЫЛО:
seo_title = f"{product_title} — {keyword} {state_name}"

# СТАЛО:
def generate_seo_title(product_data, state_name, keyword):
    product_title = product_data.get('title', '').replace('**', '')
    price = product_data.get('price', '')
    
    seo_title = (
        f"{product_title} {state_name} | "
        f"{keyword.title()} ${price} | "
        f"Auto Window Stickers"
    )
    
    if len(seo_title) > 60:
        seo_title = f"{product_title} {state_name} | ${price} | Auto Window Stickers"
    
    return seo_title

front_matter['seoTitle'] = generate_seo_title(
    product_data, state_name, selected_keyword
)
```

---

### Задача 4: Регенерация и деплой (15 мин)

```bash
# 1. Активировать virtualenv
source .venv/bin/activate

# 2. Тестовая генерация
python3 generate-pages.py --dry-run --limit 3

# 3. Проверить вывод, затем полная генерация
python3 generate-pages.py

# 4. Локальная проверка
npm run dev

# 5. Коммит и деплой
git add .
git commit -m "fix(seo): critical fixes - canonical URLs, meta descriptions, SEO titles"
git push origin main
```

**Проверка после деплоя (через 5 мин):**
```bash
curl -s https://autowindowstickers.com/states/alabama/exterior-addendum-blank/ | grep -E "(canonical|description|title)"
```

---

## 🟡 День 2-3: UI улучшения (4 часа)

### Задача 5: Breadcrumbs (1 час)

1. **Создать partial:** `layouts/partials/breadcrumbs.html`
   - Код: см. [CODE-CHANGES.md](CODE-CHANGES.md#5-breadcrumbs-ui)

2. **Добавить CSS:** `assets/custom.css`
   - Стили для breadcrumbs

3. **Подключить в product.html:**
   ```html
   {{ define "main" }}
   {{ partial "breadcrumbs.html" . }}
   {{ partial "product-detail-block.html" . }}
   ...
   ```

4. **Проверка:**
   ```bash
   npm run dev
   # Проверить визуально breadcrumbs на странице
   ```

---

### Задача 6: State Selector (1 час)

1. **Создать partial:** `layouts/partials/state-selector.html`
   - Код: см. [CODE-CHANGES.md](CODE-CHANGES.md#7-state-selector)

2. **Добавить CSS**

3. **Подключить в product.html** (после product-detail-block)

4. **Проверка:** выбрать другой штат в dropdown

---

### Задача 7: Related Products (2 часа)

1. **Создать partial:** `layouts/partials/related-products.html`
   - Код: см. [CODE-CHANGES.md](CODE-CHANGES.md#6-related-products)

2. **Добавить CSS для карточек**

3. **Подключить в product.html** (перед `{{ end }}`)

4. **Проверка:** должны показаться 3 похожих продукта

---

## 🟢 Неделя 1: Контент и структура (8 часов)

### Задача 8: Master Product Pages (3 часа)

**Только если выбран Вариант B для canonical**

1. Создать структуру:
   ```
   content/products/
   ├── exterior-addendum-blank/
   │   └── index.md
   ├── exterior-addendum-custom/
   │   └── index.md
   ...
   ```

2. Шаблон для каждой страницы:
   ```yaml
   ---
   layout: product
   title: Exterior Addendum Blank
   description: Professional exterior addendum blank window stickers...
   seoTitle: Exterior Addendum Blank | Car Window Stickers
   slug: exterior-addendum-blank
   type: product
   ---
   ```

3. Обновить generate-pages.py:
   ```python
   front_matter['canonical'] = f"/products/{product_key}/"
   ```

---

### Задача 9: Hreflang теги (2 часа)

1. **Создать partial:** `layouts/partials/hreflang.html`
   - Код: см. [CODE-CHANGES.md](CODE-CHANGES.md#шаг-3-добавить-hreflang-на-master-pages)

2. **Подключить в baseof.html** (после canonical)

3. **Проверка:**
   ```bash
   curl -s https://autowindowstickers.com/products/exterior-addendum-blank/ | grep hreflang
   ```

---

### Задача 10: Расширить контентные пулы (3 часа)

1. Открыть файлы:
   - `data/content-generator/content/product/benefits.yaml`
   - `data/content-generator/content/product/faq.yaml`
   - `data/content-generator/content/product/savings.yaml`
   - `data/content-generator/content/product/testimonials.yaml`

2. Добавить варианты (50 → 100 в каждом):
   ```yaml
   benefits:
     # ... существующие 50 ...
     - title: "Cost Effective"
       summary: |
         [[product]] delivers premium quality at competitive prices...
     # ... еще 49 новых ...
   ```

3. Регенерировать страницы:
   ```bash
   python3 generate-pages.py
   ```

---

## 📊 Месяц 1: Полная оптимизация (20 часов)

### Неделя 2: Технические улучшения (8 часов)

- [ ] Оптимизировать sitemap.xml (priority, changefreq)
- [ ] Добавить preload для критических ресурсов
- [ ] Настроить Service Worker для офлайн
- [ ] Улучшить CSP headers

### Неделя 3: Контент и UX (6 часов)

- [ ] A/B тестирование SEO titles
- [ ] Добавить реальные отзывы (заменить статичные)
- [ ] Создать comparison таблицы продуктов
- [ ] Улучшить CTA кнопки

### Неделя 4: Мониторинг и доработки (6 часов)

- [ ] Настроить Google Search Console
- [ ] Интеграция с Google Analytics 4
- [ ] Создать дашборд метрик
- [ ] Анализ первых результатов
- [ ] Корректировка стратегии

---

## ✅ Чек-листы проверки

### После каждого деплоя

- [ ] Canonical URL корректен (View Source)
- [ ] Meta description уникален
- [ ] SEO title оптимизирован
- [ ] Breadcrumbs отображаются
- [ ] Related products работают
- [ ] State selector функционален
- [ ] Мобильная версия OK
- [ ] Schema.org валидна (Rich Results Test)

### Еженедельная проверка

- [ ] Google Search Console — индексация
- [ ] Позиции по ключевым запросам
- [ ] Органический трафик
- [ ] CTR в выдаче
- [ ] Bounce rate
- [ ] Time on page
- [ ] Конверсии

### Ежемесячный отчет

- [ ] Рост индексированных страниц
- [ ] Динамика трафика
- [ ] ROI от SEO
- [ ] Новые возможности оптимизации
- [ ] Обновление стратегии

---

## 🎯 Ожидаемые результаты

### Через 1 неделю
- ✅ Canonical URLs исправлены
- ✅ Meta descriptions уникальные
- ✅ Breadcrumbs и navigation улучшены
- ✅ Начало индексации state-страниц

**Метрики:**
- Индексированных страниц: 3 → 50-100
- Органический трафик: +20-30%

### Через 1 месяц
- ✅ Все 700 страниц индексированы
- ✅ Позиции в топ-10 для 30-50% запросов
- ✅ Полная оптимизация контента

**Метрики:**
- Индексированных страниц: 700+
- Органический трафик: +300-500%
- CTR: +75-100%
- Bounce rate: -15-20%

### Через 3 месяца
- ✅ Стабильные позиции в топ-5
- ✅ Рост конверсий
- ✅ Узнаваемость бренда

**Метрики:**
- Органический трафик: +500-800%
- Конверсии: +50-100%
- ROI от SEO: положительный

---

## 🚨 Важные напоминания

### Перед началом работ
1. ✅ Создать бэкап текущего состояния
2. ✅ Протестировать на dev-окружении
3. ✅ Проверить все зависимости

### Во время работ
1. ✅ Делать коммиты после каждой задачи
2. ✅ Тестировать локально перед деплоем
3. ✅ Документировать изменения

### После деплоя
1. ✅ Проверить production
2. ✅ Мониторить ошибки
3. ✅ Собирать метрики

---

## 📞 Поддержка и ресурсы

### Документация
- **Полный отчет:** [SITE-AUDIT-REPORT.md](SITE-AUDIT-REPORT.md)
- **Быстрые фиксы:** [QUICK-FIXES.md](QUICK-FIXES.md)
- **Изменения кода:** [CODE-CHANGES.md](CODE-CHANGES.md)
- **Резюме:** [AUDIT-SUMMARY.md](AUDIT-SUMMARY.md)

### Инструменты
- Google Search Console: https://search.google.com/search-console
- Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly

### Команды
```bash
# Разработка
npm run dev:all

# Генерация
python3 generate-pages.py

# Деплой
git push origin main

# Проверка
curl -s https://autowindowstickers.com/states/alabama/exterior-addendum-blank/ | grep canonical
```

---

**Начните с Дня 1 — критические исправления блокируют весь SEO!**

**Успехов! 🚀**

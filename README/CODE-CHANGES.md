# Конкретные изменения кода — Auto Window Stickers

## 🔴 Критические исправления

### 1. Canonical URLs — Вариант A (быстрый)

**Файл:** `layouts/_default/baseof.html`  
**Строка:** 33

```html
<!-- БЫЛО: -->
<link rel="canonical" href="{{ or .Params.canonical .Params.seo.canonical .Permalink | safeURL }}">

<!-- СТАЛО: -->
<link rel="canonical" href="{{ .Permalink | safeURL }}">
```

**Результат:** Каждая страница ссылается сама на себя (самореференс)

---

### 2. Canonical URLs — Вариант B (правильный)

#### Шаг 1: Найти в generate-pages.py функцию генерации front matter

**Файл:** `tools/page-generator/generate-pages.py`  
**Примерно строки:** 300-400

```python
# БЫЛО:
front_matter['canonical'] = f"/{section}/{product_key}/"

# СТАЛО:
# Для state-страниц canonical указывает на master product page
front_matter['canonical'] = f"/products/{product_key}/"
```

#### Шаг 2: Создать master product pages

**Создать файл:** `content/products/exterior-addendum-blank/index.md`

```yaml
---
layout: product
title: Exterior Addendum Blank
description: Professional exterior addendum blank window stickers for car dealerships. Laser-compatible, weather-resistant, 4.25 x 11 inch.
seoTitle: Exterior Addendum Blank | Car Window Stickers | Auto Window Stickers
slug: exterior-addendum-blank
type: product
---
```

**Повторить для всех 14 продуктов**

#### Шаг 3: Добавить hreflang на master pages

**Создать partial:** `layouts/partials/hreflang.html`

```html
{{- if eq .Type "product" -}}
{{- $productSlug := .Params.slug -}}
{{- if .Site.Data.states -}}
  {{- range $stateKey, $stateData := .Site.Data.states -}}
  <link rel="alternate" 
        hreflang="en-us-{{ $stateData.code | lower }}" 
        href="{{ printf "/states/%s/%s/" $stateData.slug $productSlug | absURL }}" />
  {{- end -}}
{{- end -}}
{{- end -}}
```

**Добавить в baseof.html (после строки 33):**

```html
<link rel="canonical" href="{{ or .Params.canonical .Permalink | safeURL }}">
{{ partial "hreflang.html" . }}
```

---

### 3. Meta Descriptions

**Файл:** `tools/page-generator/generate-pages.py`  
**Функция:** `generate_product_page()` или аналогичная

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
    
    return description[:160]  # Ограничение 160 символов

# Использование:
front_matter['description'] = generate_meta_description(
    product_data, 
    state_name, 
    selected_keyword
)
```

---

### 4. SEO Titles

**Файл:** `tools/page-generator/generate-pages.py`

```python
# БЫЛО:
seo_title = f"{product_title} — {keyword} {state_name}"

# СТАЛО:
def generate_seo_title(product_data, state_name, keyword):
    """Generate optimized SEO title with price and brand."""
    product_title = product_data.get('title', '').replace('**', '')
    price = product_data.get('price', '')
    
    # Формат: Product State | Keyword $Price | Brand
    seo_title = (
        f"{product_title} {state_name} | "
        f"{keyword.title()} ${price} | "
        f"Auto Window Stickers"
    )
    
    # Ограничение 60 символов для Google
    if len(seo_title) > 60:
        seo_title = f"{product_title} {state_name} | ${price} | Auto Window Stickers"
    
    return seo_title

# Использование:
front_matter['seoTitle'] = generate_seo_title(
    product_data,
    state_name,
    selected_keyword
)
```

---

## 🟡 Важные улучшения

### 5. Breadcrumbs UI

**Создать файл:** `layouts/partials/breadcrumbs.html`

```html
{{- $section := .Section -}}
{{- $state := .Params.state -}}
{{- $productTitle := .Title -}}

<nav aria-label="Breadcrumb" class="breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
  <ol class="breadcrumb-list">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/">
        <span itemprop="name">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    
    {{- if $section -}}
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/{{ $section }}/">
        <span itemprop="name">{{ humanize $section | title }} Products</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
    {{- end -}}
    
    {{- if $state -}}
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/states/{{ $state }}/">
        <span itemprop="name">{{ humanize $state | title }}</span>
      </a>
      <meta itemprop="position" content="3" />
    </li>
    {{- end -}}
    
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" aria-current="page">
      <span itemprop="name">{{ $productTitle }}</span>
      <meta itemprop="position" content="4" />
    </li>
  </ol>
</nav>
```

**CSS для breadcrumbs:** `assets/custom.css`

```css
.breadcrumbs {
  margin: 1rem 0;
  padding: 0.5rem 0;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.5rem;
}

.breadcrumb-list li {
  display: flex;
  align-items: center;
}

.breadcrumb-list li:not(:last-child)::after {
  content: "›";
  margin-left: 0.5rem;
  color: #666;
}

.breadcrumb-list a {
  color: #2EC0FF;
  text-decoration: none;
}

.breadcrumb-list a:hover {
  text-decoration: underline;
}

.breadcrumb-list li[aria-current="page"] span {
  color: #333;
  font-weight: 500;
}
```

**Добавить в:** `layouts/_default/product.html` (строка 2)

```html
{{ define "main" }}
{{ partial "breadcrumbs.html" . }}

{{ partial "product-detail-block.html" . }}
<!-- остальное без изменений -->
```

---

### 6. Related Products

**Создать файл:** `layouts/partials/related-products.html`

```html
{{- $currentProduct := .File.ContentBaseName -}}
{{- $currentState := .Params.state -}}
{{- $section := .Section -}}

{{- $relatedPages := where .Site.RegularPages "Params.state" $currentState -}}
{{- $relatedPages = where $relatedPages "Section" $section -}}
{{- $relatedPages = where $relatedPages "File.ContentBaseName" "!=" $currentProduct -}}

{{- if gt (len $relatedPages) 0 -}}
<section class="related-products">
  <div class="container">
    <h2>More {{ humanize $section }} Products in {{ humanize $currentState | title }}</h2>
    <div class="related-grid">
      {{- range first 3 $relatedPages -}}
      {{- $productID := .File.ContentBaseName -}}
      {{- if isset site.Data.products $productID -}}
      {{- $productData := index site.Data.products $productID -}}
      <article class="related-card">
        <a href="{{ .Permalink }}">
          {{- if $productData.images -}}
          {{- $imgSrc := (index $productData.images 0).src -}}
          {{- $img := resources.Get $imgSrc -}}
          {{- if $img -}}
          {{- $thumb := $img.Fill "300x225 webp" -}}
          <img src="{{ $thumb.RelPermalink }}" 
               alt="{{ $productData.title | markdownify | plainify }}"
               loading="lazy"
               width="300" height="225" />
          {{- end -}}
          {{- end -}}
          <h3>{{ .Title }}</h3>
          <p class="price">${{ $productData.price }}</p>
        </a>
      </article>
      {{- end -}}
      {{- end -}}
    </div>
  </div>
</section>
{{- end -}}
```

**CSS:** `assets/custom.css`

```css
.related-products {
  margin: 3rem 0;
  padding: 2rem 0;
  background: #f8f9fa;
}

.related-products h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.related-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.related-card img {
  width: 100%;
  height: auto;
  display: block;
}

.related-card h3 {
  padding: 1rem;
  margin: 0;
  font-size: 1.1rem;
}

.related-card .price {
  padding: 0 1rem 1rem;
  margin: 0;
  color: #2EC0FF;
  font-weight: 600;
  font-size: 1.2rem;
}
```

**Добавить в:** `layouts/_default/product.html` (перед `{{ end }}`)

```html
{{ partial "faq.html" . }}

{{ partial "related-products.html" . }}

{{ end }}
```

---

### 7. State Selector

**Создать файл:** `layouts/partials/state-selector.html`

```html
{{- $productSlug := .Params.slug -}}
{{- $currentState := .Params.state -}}

<div class="state-selector">
  <label for="state-select">View this product in another state:</label>
  <select id="state-select" onchange="if(this.value) location.href=this.value;">
    <option value="">Select State...</option>
    {{- range $key, $state := .Site.Data.states -}}
    <option value="/states/{{ $state.slug }}/{{ $productSlug }}/" 
            {{- if eq $state.slug $currentState }} selected{{- end -}}>
      {{ $state.name }}
    </option>
    {{- end -}}
  </select>
</div>
```

**CSS:** `assets/custom.css`

```css
.state-selector {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f0f8ff;
  border-radius: 8px;
}

.state-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.state-selector select {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.state-selector select:focus {
  outline: none;
  border-color: #2EC0FF;
  box-shadow: 0 0 0 3px rgba(46, 192, 255, 0.1);
}
```

**Добавить в:** `layouts/_default/product.html` (после product-detail-block)

```html
{{ partial "product-detail-block.html" . }}
{{ partial "state-selector.html" . }}
<hr class="divider-component style-2">
```

---

## 🟢 Оптимизации

### 8. Sitemap Priority

**Файл:** `hugo.yaml`  
**Строки:** 163-166

```yaml
# БЫЛО:
sitemap:
  changefreq: monthly
  priority: 0.9
  filename: sitemap.xml

# СТАЛО:
sitemap:
  changefreq: weekly
  priority: 0.5  # Default, будет переопределяться в front matter
  filename: sitemap.xml
```

**В generate-pages.py добавить:**

```python
# Для state-страниц
front_matter['sitemap'] = {
    'priority': 0.4,
    'changefreq': 'monthly'
}
```

**Для главной страницы** (`content/_index.md`):

```yaml
sitemap:
  priority: 1.0
  changefreq: daily
```

**Для категорий** (`content/exterior/_index.md`, `content/interior/_index.md`):

```yaml
sitemap:
  priority: 0.8
  changefreq: weekly
```

---

### 9. Проверка buildFuture

**Файл:** `netlify.toml`  
**Строка:** 5

```toml
# БЫЛО:
command = "hugo --gc --minify"

# СТАЛО (явно указываем):
command = "hugo --gc --minify --buildFuture=false"
```

**Файл:** `hugo.yaml`  
**Строка:** 11

```yaml
# Убедиться что:
buildFuture: false  # Для production
```

---

### 10. Расширение контентных пулов

**Файлы:** `data/content-generator/content/product/*.yaml`

**Текущее:** 50 вариантов каждого типа  
**Цель:** 100+ вариантов

**Пример добавления в** `benefits.yaml`:

```yaml
benefits:
  # ... существующие 50 ...
  
  - title: "Cost Effective"
    summary: |
      [[product]] delivers premium quality at competitive prices, helping your dealership save on [[keyword]] without compromising standards.
  
  - title: "Quick Turnaround"
    summary: |
      Orders ship within 24 hours, so you never run out of [[keyword]] when you need them most.
  
  - title: "Bulk Discounts"
    summary: |
      Save more with volume pricing on [[product]]. The more you order, the better your per-unit cost.
  
  # ... добавить еще 47 вариантов ...
```

**Аналогично для:**
- `savings.yaml` (50 → 100)
- `faq.yaml` (50 → 100)
- `testimonials.yaml` (50 → 100)

---

## 📋 Порядок внедрения

### День 1 (2 часа)
1. ✅ Исправить canonical URLs (Вариант A или B)
2. ✅ Обновить meta descriptions
3. ✅ Улучшить SEO titles
4. ✅ Регенерировать страницы
5. ✅ Деплой

### День 2 (3 часа)
6. ✅ Добавить breadcrumbs
7. ✅ Добавить state selector
8. ✅ Проверить buildFuture
9. ✅ Оптимизировать sitemap
10. ✅ Деплой

### Неделя 1 (5 часов)
11. ✅ Related products блок
12. ✅ Расширить контентные пулы
13. ✅ Создать master pages (если Вариант B)
14. ✅ Добавить hreflang
15. ✅ Финальный деплой

---

## 🧪 Тестирование

### Локальная проверка
```bash
# 1. Запустить dev сервер
npm run dev

# 2. Проверить страницу
open http://localhost:1313/states/alabama/exterior-addendum-blank/

# 3. View Source и проверить:
# - canonical URL
# - meta description
# - SEO title
# - breadcrumbs
# - related products
```

### Production проверка
```bash
# После деплоя
curl -s https://autowindowstickers.com/states/alabama/exterior-addendum-blank/ | grep -E "(canonical|description|title)"
```

### SEO валидация
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly: https://search.google.com/test/mobile-friendly
- PageSpeed: https://pagespeed.web.dev/

---

## 📝 Коммиты

```bash
# Canonical fix
git add layouts/_default/baseof.html
git commit -m "fix(seo): correct canonical URLs to use self-reference"

# Meta descriptions
git add tools/page-generator/generate-pages.py
git commit -m "feat(seo): improve meta descriptions with price and CTA"

# Breadcrumbs
git add layouts/partials/breadcrumbs.html layouts/_default/product.html assets/custom.css
git commit -m "feat(ui): add breadcrumbs navigation with schema.org markup"

# Related products
git add layouts/partials/related-products.html layouts/_default/product.html assets/custom.css
git commit -m "feat(ui): add related products section for better internal linking"

# State selector
git add layouts/partials/state-selector.html layouts/_default/product.html assets/custom.css
git commit -m "feat(ui): add state selector for easy navigation between locations"

# Финальный пуш
git push origin main
```

---

**Важно:** Все изменения обратно совместимы и не ломают существующий функционал!

# Hreflang Implementation Guide

## ✅ Что было сделано

Добавлена полная поддержка hreflang тегов для geo-таргетинга всех state-страниц.

---

## 📁 Созданные файлы

### 1. `/data/states.yaml`
Структурированные данные о всех 50 штатах США:

```yaml
alabama:
  name: "Alabama"
  code: "AL"
  slug: "alabama"

alaska:
  name: "Alaska"
  code: "AK"
  slug: "alaska"
# ... все 50 штатов
```

**Назначение:**
- Централизованное хранилище данных о штатах
- Используется для генерации hreflang тегов
- Может использоваться для других целей (навигация, фильтры и т.д.)

---

### 2. `/layouts/partials/hreflang.html`
Partial для автоматической генерации hreflang тегов:

```html
{{- if and (eq .Type "states") .Params.slug .Params.state -}}
{{- $productSlug := .Params.slug -}}
{{- $currentState := .Params.state -}}
{{- $baseURL := .Site.BaseURL -}}

{{- if .Site.Data.states -}}
  {{- range $stateKey, $stateData := .Site.Data.states -}}
    {{- $stateCode := $stateData.code | lower -}}
    {{- $stateSlug := $stateData.slug -}}
    {{- $url := printf "%sstates/%s/%s/" $baseURL $stateSlug $productSlug -}}
    <link rel="alternate" hreflang="en-us-{{ $stateCode }}" href="{{ $url }}" />
  {{- end -}}
  
  <link rel="alternate" hreflang="x-default" href="{{ .Permalink }}" />
{{- end -}}
{{- end -}}
```

**Логика работы:**
1. Проверяет, что это state-страница (`.Type == "states"`)
2. Получает slug продукта и текущий штат
3. Для каждого штата генерирует hreflang тег
4. Добавляет `x-default` для текущей страницы

---

### 3. Обновлен `/layouts/_default/baseof.html`
Добавлен вызов hreflang partial после canonical:

```html
<link rel="canonical" href="{{ or .Params.canonical .Params.seo.canonical .Permalink | safeURL }}">

{{/* --- Hreflang Tags for Geo-Targeting --- */}}
{{ partial "hreflang.html" . }}
```

---

## 🎯 Результат

### Пример вывода для страницы Alabama:

```html
<head>
  <link rel="canonical" href="https://autowindowstickers.com/states/alabama/exterior-addendum-blank/">
  
  <!-- Hreflang теги для всех 50 штатов -->
  <link rel="alternate" hreflang="en-us-al" href="https://autowindowstickers.com/states/alabama/exterior-addendum-blank/" />
  <link rel="alternate" hreflang="en-us-ak" href="https://autowindowstickers.com/states/alaska/exterior-addendum-blank/" />
  <link rel="alternate" hreflang="en-us-az" href="https://autowindowstickers.com/states/arizona/exterior-addendum-blank/" />
  <!-- ... еще 47 штатов ... -->
  <link rel="alternate" hreflang="en-us-wy" href="https://autowindowstickers.com/states/wyoming/exterior-addendum-blank/" />
  <link rel="alternate" hreflang="x-default" href="https://autowindowstickers.com/states/alabama/exterior-addendum-blank/" />
</head>
```

### Что это дает:

1. **Geo-таргетинг:** Google понимает, что все 50 версий — это один продукт для разных регионов
2. **Правильная выдача:** Пользователь из Texas увидит Texas-версию, из California — California-версию
3. **Нет дублей:** Google не считает это дублированным контентом
4. **Лучшая индексация:** Связь между страницами помогает crawl budget

---

## 📊 Покрытие

- **Всего штатов:** 50
- **Всего продуктов:** 14
- **Всего state-страниц:** 700 (50 × 14)
- **Hreflang тегов на каждой странице:** 51 (50 штатов + x-default)
- **Общее количество hreflang связей:** 35,700 (700 × 51)

---

## 🔍 Проверка

### Локальная проверка:

```bash
# Запустить dev-сервер
npm run dev

# Проверить hreflang теги
curl -s http://localhost:1313/states/alabama/exterior-addendum-blank/ | grep "hreflang"
```

### Production проверка:

```bash
# После деплоя
curl -s https://autowindowstickers.com/states/alabama/exterior-addendum-blank/ | grep "hreflang" | head -5
```

### Google Search Console:

1. Открыть: https://search.google.com/search-console
2. Перейти в: **Покрытие** → **Международный таргетинг** → **Язык**
3. Проверить наличие hreflang тегов
4. Убедиться, что нет ошибок

---

## 🎨 Формат hreflang

### Используемый формат:
```
en-us-{state_code}
```

**Примеры:**
- `en-us-al` — Alabama
- `en-us-ca` — California
- `en-us-tx` — Texas
- `en-us-ny` — New York

### Почему этот формат:

1. **`en`** — язык (English)
2. **`us`** — страна (United States)
3. **`{state_code}`** — штат (двухбуквенный код)

Это соответствует стандарту ISO 3166-2 для регионов США.

### Альтернативные форматы (не используются):

- ❌ `en-US` — только язык и страна (недостаточно специфично)
- ❌ `en-alabama` — не стандартный формат
- ✅ `en-us-al` — правильный формат для geo-таргетинга

---

## 🚀 SEO-преимущества

### До внедрения hreflang:

```
Google видит:
├─ /states/alabama/exterior-addendum-blank/
├─ /states/alaska/exterior-addendum-blank/
├─ /states/arizona/exterior-addendum-blank/
└─ ... (47 других)

Проблема: Google может считать это дублями
```

### После внедрения hreflang:

```
Google понимает:
└─ Exterior Addendum Blank (продукт)
   ├─ Alabama версия (для пользователей из AL)
   ├─ Alaska версия (для пользователей из AK)
   ├─ Arizona версия (для пользователей из AZ)
   └─ ... (47 других региональных версий)

Результат: Правильный geo-таргетинг, нет дублей
```

---

## 📈 Ожидаемые результаты

### Через 2-4 недели после индексации:

1. **Geo-специфичная выдача:**
   - Пользователь из Texas → видит Texas-версию
   - Пользователь из California → видит California-версию

2. **Улучшение позиций:**
   - Локальные запросы: "car window stickers texas" → Texas-версия в топ-10
   - Общие запросы: "car window stickers" → x-default версия

3. **Снижение bounce rate:**
   - Пользователь видит релевантный контент для своего региона
   - Меньше "неправильных" переходов

4. **Рост конверсий:**
   - Локальный контент → выше доверие
   - Правильный geo-таргетинг → больше целевых визитов

---

## 🔧 Техническая документация

### Условия срабатывания partial:

```go
{{- if and (eq .Type "states") .Params.slug .Params.state -}}
```

**Проверяет:**
1. `.Type == "states"` — тип страницы (section)
2. `.Params.slug` — есть slug продукта
3. `.Params.state` — есть параметр штата

**Не срабатывает для:**
- Главной страницы
- Категорий `/exterior/`, `/interior/`
- Статей
- Других типов страниц

### Структура URL:

```
https://autowindowstickers.com/states/{state_slug}/{product_slug}/
                                     ↑             ↑
                                     |             |
                                     |             └─ из .Params.slug
                                     └─ из .Site.Data.states[key].slug
```

---

## ✅ Чек-лист проверки

### Перед деплоем:
- [x] Создан файл `data/states.yaml` со всеми 50 штатами
- [x] Создан partial `layouts/partials/hreflang.html`
- [x] Добавлен вызов partial в `baseof.html`
- [x] Протестировано локально

### После деплоя:
- [ ] Проверить hreflang на production
- [ ] Проверить в Google Search Console (через 1-2 недели)
- [ ] Мониторить индексацию по штатам
- [ ] Отслеживать geo-специфичные позиции

### Через 1 месяц:
- [ ] Анализ трафика по штатам
- [ ] Проверка bounce rate по geo
- [ ] Оценка конверсий по регионам
- [ ] Корректировка стратегии

---

## 🐛 Troubleshooting

### Проблема: Hreflang теги не появляются

**Решение:**
1. Проверить, что страница имеет `.Type == "states"`
2. Убедиться, что есть `.Params.slug` и `.Params.state`
3. Проверить, что файл `data/states.yaml` существует

### Проблема: Неправильные URL в hreflang

**Решение:**
1. Проверить `baseURL` в `hugo.yaml`
2. Убедиться, что slugs в `data/states.yaml` корректны
3. Проверить формат URL в partial

### Проблема: Google не распознает hreflang

**Решение:**
1. Проверить формат: должен быть `en-us-{code}`
2. Убедиться, что все URL доступны (не 404)
3. Проверить в Google Search Console → Международный таргетинг

---

## 📚 Дополнительные ресурсы

- [Google: Использование hreflang](https://developers.google.com/search/docs/advanced/crawling/localized-versions)
- [Hreflang Tags Generator](https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/)
- [ISO 3166-2:US (State codes)](https://en.wikipedia.org/wiki/ISO_3166-2:US)

---

**Статус:** ✅ Реализовано и протестировано  
**Дата:** 2025-10-04  
**Версия:** 1.0

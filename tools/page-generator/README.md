# Генератор страниц для Hugo сайта

## Что это такое?

Это инструмент для автоматического создания страниц продуктов на сайте Auto Window Stickers. Вместо того, чтобы вручную создавать сотни похожих страниц для каждого штата США, генератор делает это автоматически на основе шаблонов.

**Что генератор создаёт:**
- Страницы продуктов для разных штатов (например, "Exterior Window Sticker в Калифорнии")
- Статьи о продуктах с уникальным контентом

## Файлы в этой папке

- 📄 `generate-pages.py` — главный скрипт генератора
- ⚙️ `config.yaml` — настройки генератора (количество FAQ, отзывов и т.д.)
- 📦 `requirements.txt` — список необходимых Python библиотек
- 🚀 `run.sh` — вспомогательный скрипт для быстрого запуска

## Что нужно для работы

- **Python 3.10 или новее** (проверьте: `python3 --version`)
- Базовые знания работы с командной строкой (терминалом)

---

## 🚀 Быстрый старт (рекомендуется)

### Шаг 1: Откройте терминал в корне проекта

```bash
# Замените путь на свой! Примеры:
# macOS/Linux: cd /Users/ваше_имя/projects/auto-window-stickers
# Windows: cd C:\Users\ваше_имя\projects\auto-window-stickers

cd /Users/popskraft/hugo/auto-window-stickers
```

### Шаг 2: Установите зависимости (делается один раз)

```bash
./.venv/bin/python -m pip install -r tools/page-generator/requirements.txt
```

### Шаг 3: Запустите генератор в тестовом режиме

**Сначала всегда запускайте с `--dry-run`** — это покажет, что будет создано, но не создаст файлы:

```bash
./.venv/bin/python generate-pages.py --dry-run --limit 5
```

Что означают параметры:
- `--dry-run` — тестовый режим (файлы не создаются, только показывается что будет)
- `--limit 5` — создать только 5 страниц (для теста)

### Шаг 4: Запустите реальную генерацию

Если результат в тестовом режиме вас устроил:

```bash
./.venv/bin/python generate-pages.py
```

⚠️ **Внимание:** Это создаст реальные файлы в папке `content/states/`

---

## 📚 Альтернативные способы запуска

### Способ 1: Использование helper-скрипта

Если вы находитесь в папке `tools/page-generator/`:

```bash
chmod +x run.sh          # Даём права на выполнение (делается один раз)
./run.sh --dry-run --limit 5
./run.sh                 # Реальная генерация
```

**Что делает `run.sh`:**
1. Создаёт виртуальное окружение Python в `.venv/` (если его нет)
2. Устанавливает необходимые библиотеки
3. Запускает генератор с вашими параметрами

### Способ 2: Прямой запуск из корня проекта

```bash
.venv/bin/python generate-pages.py --dry-run --limit 5
.venv/bin/python generate-pages.py
```

---

## 🖼️ Работа с изображениями для статей

### Где размещать изображения

Все изображения для статей должны находиться в папке:
```
assets/images/articles/
```

### Правила именования файлов

Изображения должны иметь **числовой префикс** для удобной сортировки:

```
1-coverimage.jpg
2-coverimage.jpg
3-coverimage.jpg
4-coverimage.jpg
...
```

**Поддерживаемые форматы:**
- `.jpg` / `.jpeg`
- `.png`
- `.webp`

### Как генератор использует изображения

При создании статьи генератор **автоматически** выбирает два случайных изображения:

1. **`image_cover`** — обложка статьи (отображается вверху)
2. **`image_body`** — изображение в теле статьи (вставляется после 2-го блока контента)

**Пример front matter созданной статьи:**
```yaml
---
title: "How to Apply Exterior Window Stickers"
image_cover: "assets/images/articles/3-coverimage.jpg"
image_body: "assets/images/articles/7-coverimage.jpg"
image_body_alt: "How to Apply Exterior Window Stickers"
---
```

### Вставка изображения в контент

Генератор автоматически вставляет shortcode после 2-го блока текста:

```markdown
{{< figureproc src="/{{< param image_body >}}" alt="{{< param image_body_alt >}}" >}}
```

Это создаёт адаптивное изображение с правильным alt-текстом для SEO.

### Рекомендации по изображениям

1. **Количество:** Минимум 2 изображения для разнообразия
2. **Размер:** Оптимально 1200x800px или больше
3. **Качество:** Высокое качество, но сжатые для веба (до 500KB)
4. **Содержание:** Релевантные изображения продуктов или процесса установки
5. **Формат:** Предпочтительно `.jpg` для фотографий, `.png` для графики

### Пример структуры папки

```
assets/images/articles/
├── 1-coverimage.jpg    (261 KB)
├── 2-coverimage.jpg    (261 KB)
├── 3-coverimage.jpg    (480 KB)
├── 4-coverimage.jpg    (480 KB)
├── 5-coverimage.jpg    (213 KB)
├── 6-coverimage.jpg    (213 KB)
├── 7-coverimage.jpg    (314 KB)
└── 8-coverimage.jpg    (314 KB)
```

### Что делать, если изображений нет?

Если папка `assets/images/articles/` пустая или не существует:
- `image_cover` будет пустой строкой `""`
- `image_body` будет пустой строкой `""`
- Статья создастся, но без изображений

⚠️ **Важно:** Добавьте хотя бы 2-3 изображения перед генерацией статей для лучшего результата!

---

## 🎯 Типы генерации

Генератор может создавать два типа страниц:

### 1. Страницы продуктов (по умолчанию)

Создаёт страницы вида: `content/states/california/exterior-custom/index.md`

```bash
./.venv/bin/python generate-pages.py --type product --dry-run --limit 5
./.venv/bin/python generate-pages.py --type product
```

### 2. Статьи о продуктах

Создаёт статьи вида: `content/articles/exterior-custom/how-to-apply/index.md`

```bash
./.venv/bin/python generate-pages.py --type article --dry-run --limit 5
./.venv/bin/python generate-pages.py --type article
```

---

## ⚙️ Настройка генератора (`config.yaml`)

Все настройки хранятся в файле `config.yaml`. Вот что означает каждый параметр:

### Секция `execution` (Выполнение)

```yaml
execution:
  seed: 42                      # Случайное число для воспроизводимости результатов
  limit: 2                      # Сколько страниц создать (0 = без ограничений)
  dry_run: false                # true = тестовый режим (файлы не создаются)
  base_path: "../.."            # Путь к корню Hugo сайта
  output_dir: "content"         # Куда сохранять созданные страницы
```

### Секция `content` (Контент)

```yaml
content:
  savings_count: 1              # Сколько блоков "экономии" на странице
  benefits_count: 6             # Сколько блоков "преимуществ"
  faq_count: 10                 # Сколько вопросов в FAQ
  testimonials_count: 3         # Сколько отзывов клиентов
  default_saving_number: "3500" # Сумма экономии по умолчанию
```

### Секция `seo` (SEO оптимизация)

```yaml
seo:
  seo_keywords_file: "data/content-generator/keywords-seotitle.yaml"    # Ключевые слова ТОЛЬКО для SEO заголовков
  content_keywords_file: "data/content-generator/keywords.yaml"         # Ключевые слова для замены [[keyword]] в тексте
  title_template: "{product_title} — {keyword} {state}"                 # Шаблон заголовка страницы
```

**Важно:** 
- `keywords-seotitle.yaml` используется ТОЛЬКО для SEO заголовков
- `keywords.yaml` используется для всех остальных замен `[[keyword]]` в контенте

### Секция `pages` (Страницы)

```yaml
pages:
  layout: "product"                                      # Какой Hugo layout использовать
  filename_pattern: "states/{state_slug}/{product_key}/index.md"  # Шаблон пути к файлу
```

### Секция `data_sources` (Источники данных)

```yaml
data_sources:
  products_dir: "data/products"                          # Папка с YAML файлами продуктов
  states_file: "data/content-generator/states.yaml"     # Файл со списком штатов США
```

---

## 🔧 Дополнительные параметры командной строки

Вы можете переопределить настройки из `config.yaml` прямо в команде:

| Параметр | Описание | Пример |
|----------|----------|--------|
| `--config <путь>` | Использовать другой конфиг-файл | `--config my-config.yaml` |
| `--seed <число>` | Изменить случайное число | `--seed 123` |
| `--limit <число>` | Ограничить количество страниц | `--limit 10` |
| `--dry-run` | Тестовый режим (не создавать файлы) | `--dry-run` |
| `--type <тип>` | Тип генерации: `product` или `article` | `--type article` |
| `--base-path <путь>` | Путь к корню Hugo сайта | `--base-path /path/to/site` |

**Примеры:**

```bash
# Создать 10 страниц продуктов в тестовом режиме
./.venv/bin/python generate-pages.py --type product --dry-run --limit 10

# Создать 5 статей с другим случайным числом
./.venv/bin/python generate-pages.py --type article --seed 999 --limit 5
```

---

## 📂 Где создаются файлы?

### Страницы продуктов
```
content/states/california/exterior-custom/index.md
content/states/texas/interior-blank/index.md
content/states/new-york/exterior-buyguide/index.md
```

### Статьи
```
content/articles/exterior-custom/how-to-apply/index.md
content/articles/interior-blank/benefits-guide/index.md
```

---

## ❓ Решение проблем

### Ошибка: "Not a Hugo site directory"
**Причина:** Генератор не может найти Hugo сайт.  
**Решение:** Проверьте, что в папке есть файл `hugo.yaml` или `config.yaml`.

### Ошибка: "Paths not found (states/products/keywords)"
**Причина:** Не найдены файлы с данными.  
**Решение:** Убедитесь, что существуют:
- `data/products/*.yaml` — файлы продуктов
- `data/content-generator/states.yaml` — список штатов
- `data/content-generator/keywords.yaml` — ключевые слова

### Ошибка: "No products loaded"
**Причина:** В папке `data/products/` нет YAML файлов.  
**Решение:** Проверьте, что файлы имеют расширение `.yaml` (не `.yml`).

### Ошибка: "Empty content pools"
**Причина:** Нет файлов с контентом для генерации.  
**Решение:** Проверьте наличие файлов в `data/content-generator/content/product/*.yaml`.

---

## 💡 Полезные советы

1. **Всегда начинайте с `--dry-run`** — это покажет, что будет создано, без реального создания файлов.

2. **Используйте `--limit`** для тестирования — создайте сначала 2-3 страницы и проверьте результат.

3. **Проверяйте результат** — после генерации откройте несколько созданных файлов и убедитесь, что контент выглядит правильно.

4. **Делайте backup** — перед массовой генерацией сделайте копию папки `content/`.

5. **Git commit** — если используете Git, сделайте commit перед генерацией, чтобы можно было откатить изменения.

---

## 📝 Для разработчиков

- Генератор использует **PyYAML** для работы с YAML файлами
- Папка `tools/page-generator/` полностью портативна — можно скопировать в другой проект
- Все пути в `config.yaml` относительные для удобства переноса

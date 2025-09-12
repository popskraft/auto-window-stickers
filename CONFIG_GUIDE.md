# Руководство по настройке скрипта генерации страниц

## Файл конфигурации: `config.yaml`

### Основные настройки запуска

```yaml
execution:
  seed: 42                    # Фиксированный seed для воспроизводимости
  limit: null                 # Ограничение количества страниц (null = все)
  dry_run: false             # Тестовый режим без создания файлов
  base_path: "."             # Путь к Hugo сайту
  output_dir: "content/generated-pages"  # Папка для созданных страниц
```

### Настройки контента

```yaml
content:
  savings_count: 1           # Количество блоков экономии
  benefits_count: 6          # Количество преимуществ
  faq_count: 10             # Количество FAQ
  testimonials_count: 3      # Количество отзывов
  default_saving_number: "3500"  # Значение по умолчанию
```

### SEO настройки

```yaml
seo:
  seo_keywords_file: "data/content-generator/keywords-seotitle.yaml"
  content_keywords_file: "data/content-generator/keywords.yaml"
  title_template: "{product_title} — {keyword} {state}"
```

## Команды запуска с конфигурацией

### 1. Тестовый запуск (рекомендуется)
```bash
# Установить dry_run: true в config.yaml, затем:
python3 generate-pages.py --config config.yaml
```

### 2. Ограниченная генерация
```bash
# Установить limit: 10 в config.yaml для тестирования
python3 generate-pages.py --config config.yaml
```

### 3. Полная генерация
```bash
# Установить limit: null в config.yaml
python3 generate-pages.py --config config.yaml
```

### 4. Переопределение параметров из командной строки
```bash
# Параметры командной строки имеют приоритет над config.yaml
python3 generate-pages.py --config config.yaml --dry-run --limit 5
```

## Настройки для разных сценариев

### Тестирование (5 страниц)
```yaml
execution:
  seed: 42
  limit: 5
  dry_run: true
```

### Разработка (50 страниц)
```yaml
execution:
  seed: 42
  limit: 50
  dry_run: false
```

### Продакшн (все страницы)
```yaml
execution:
  seed: 42
  limit: null
  dry_run: false
```

## Контроль качества

```yaml
quality:
  min_content_length: 10     # Минимальная длина контента
  max_content_length: 5000   # Максимальная длина контента
  validate_yaml: true       # Проверка YAML
  check_placeholders: true  # Проверка замены плейсхолдеров
```

## Логирование

```yaml
logging:
  progress_interval: 50     # Показывать прогресс каждые N страниц
  verbose: false           # Подробный вывод
  log_file: "generation.log"  # Файл логов (null = отключить)
```

## Примеры использования

### Быстрое тестирование
1. Установить в `config.yaml`: `dry_run: true, limit: 3`
2. Запустить: `python3 generate-pages.py --config config.yaml`

### Генерация для одного штата (модификация скрипта)
Добавить в `config.yaml`:
```yaml
filters:
  states_include: ["California"]  # Только Калифорния
  products_include: ["exterior-window-sticker-blank"]  # Только один продукт
```

### Пакетная генерация
```bash
# Генерация по частям для больших объемов
python3 generate-pages.py --config config.yaml --limit 100 --seed 1
python3 generate-pages.py --config config.yaml --limit 100 --seed 2 --offset 100
```

## Мониторинг генерации

Скрипт выводит:
- Прогресс каждые 50 страниц
- Общее количество созданных файлов
- Путь к выходной папке
- Ошибки валидации (если включены)

## Результат

Созданные файлы будут в формате:
- `content/generated-pages/exterior-window-sticker-blank-california.md`
- `content/generated-pages/interior-addendum-custom-texas.md`
- И т.д.

Каждый файл содержит полную YAML front matter согласно архетипу `product.md`.

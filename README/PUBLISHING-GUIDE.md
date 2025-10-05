# Автоматическая публикация контента с отложенной датой

## 📋 Обзор решения

Этот проект использует комбинацию Hugo, Netlify и GitHub Actions для автоматической публикации контента по расписанию.

### Как это работает

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Генерация контента (generate-pages.py)                      │
│    - Создает страницы с publishDate в будущем                   │
│    - Интервал между страницами: 30 минут (настраивается)       │
│    - 700 страниц = ~14.5 дней для полной публикации            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Hugo Build (Netlify)                                         │
│    - buildFuture: false (production)                            │
│    - Публикует только страницы с publishDate <= текущее время  │
│    - Страницы с будущей датой остаются скрытыми                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. GitHub Actions (Scheduled Build)                             │
│    - Запускается ежедневно в 6:00 AM UTC                       │
│    - Триггерит Netlify Build Hook                               │
│    - Netlify пересобирает сайт                                  │
│    - Новые страницы становятся видимыми                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔑 Ключевые концепции Hugo

### publishDate vs date

Hugo использует два поля для управления датами:

| Поле | Назначение | Влияние на видимость |
|------|-----------|---------------------|
| **publishDate** | Контролирует, когда страница становится видимой | ✅ Да (с `buildFuture: false`) |
| **date** | Используется для сортировки и отображения | ❌ Нет |

**Пример front matter:**
```yaml
---
title: "Exterior Window Sticker in California"
publishDate: 2025-10-05T12:00:00Z  # Страница появится 5 октября
date: 2025-10-05T12:00:00Z         # Дата для сортировки
---
```

### buildFuture флаг

| Режим | buildFuture | Поведение |
|-------|-------------|-----------|
| **Development** | `true` | Показывает ВСЕ страницы (включая будущие) |
| **Production** | `false` | Показывает только страницы с `publishDate <= now` |

**Текущая конфигурация:**
```yaml
# hugo.yaml
buildFuture: false  # Production по умолчанию

# hugo.yaml (environments)
environments:
  development:
    buildFuture: true   # Для локальной разработки
  production:
    buildFuture: false  # Для production
```

---

## ⚙️ Настройка автоматической публикации

### Шаг 1: Настройка конфигурации генератора

**Файл:** `config.yaml`

```yaml
scheduling:
  # Базовая временная метка (начало отсчета)
  start_timestamp: "2025-10-04T12:00:00Z"
  
  # Интервал между страницами (в минутах)
  publish_delay_minutes: 30  # 30 минут между страницами
  
  # Применить к продуктам
  apply_to_products: true  # ✅ Включить отложенную публикацию
```

**Расчет времени публикации:**
- 700 страниц × 30 минут = 21,000 минут = 14.5 дней
- Первая страница: `start_timestamp`
- Вторая страница: `start_timestamp + 30 минут`
- Последняя страница: `start_timestamp + 20,970 минут`

### Шаг 2: Создание Build Hook в Netlify

1. **Войдите в Netlify Dashboard:**
   ```
   https://app.netlify.com/sites/autowindowstickers/settings
   ```

2. **Перейдите в Build & Deploy:**
   - Sidebar: `Build & deploy`
   - Section: `Continuous deployment`
   - Найдите: `Build hooks`

3. **Создайте новый Build Hook:**
   - Нажмите: `Add build hook`
   - **Name:** `Scheduled Build` (для отслеживания)
   - **Branch:** `main` (или ваша production ветка)
   - Нажмите: `Save`

4. **Скопируйте URL:**
   ```
   https://api.netlify.com/build_hooks/abc123def456ghi789
   ```
   ⚠️ **Важно:** Сохраните этот URL — он понадобится в следующем шаге

### Шаг 3: Добавление Build Hook в GitHub Secrets

1. **Откройте настройки репозитория:**
   ```
   https://github.com/popskraft/auto-window-stickers/settings/secrets/actions
   ```

2. **Создайте новый Secret:**
   - Нажмите: `New repository secret`
   - **Name:** `NETLIFY_BUILD_HOOK_URL`
   - **Value:** Вставьте URL из Шага 2
   - Нажмите: `Add secret`

### Шаг 4: Проверка GitHub Actions Workflow

**Файл:** `.github/workflows/scheduled-build.yml`

Workflow уже создан и настроен на запуск:
- **Автоматически:** Ежедневно в 6:00 AM UTC
- **Вручную:** Через вкладку Actions в GitHub

**Проверка работы:**
1. Перейдите: `https://github.com/popskraft/auto-window-stickers/actions`
2. Найдите: `Scheduled Netlify Build`
3. Нажмите: `Run workflow` (для ручного запуска)
4. Проверьте логи выполнения

---

## 🚀 Процесс генерации и публикации

### 1. Генерация страниц с отложенной публикацией

```bash
# Установить базовую дату и включить scheduling
# Отредактируйте config.yaml:
# scheduling:
#   start_timestamp: "2025-10-04T12:00:00Z"
#   apply_to_products: true
#   publish_delay_minutes: 60

# Генерация всех страниц (700 штук)
python generate-pages.py --type product

# Результат:
# - content/alabama/exterior-addendum-blank/index.md
#   publishDate: 2025-10-04T12:00:00Z
# - content/alabama/exterior-addendum-custom/index.md
#   publishDate: 2025-10-04T13:00:00Z
# - content/alabama/exterior-buyers-guide-asis/index.md
#   publishDate: 2025-10-04T14:00:00Z
# ... и так далее
```

### 2. Коммит и пуш в репозиторий

```bash
git add content/
git commit -m "Generate 700 product pages with scheduled publishing"
git push origin main
```

### 3. Первый деплой на Netlify

- Netlify автоматически запустит сборку
- Hugo соберет сайт с `buildFuture: false`
- **Видимые страницы:** Только те, у которых `publishDate <= текущее время`
- **Скрытые страницы:** Все с будущей `publishDate`

### 4. Автоматическая публикация по расписанию

**День 1 (4 октября 2025, 12:00 UTC):**
- Первая страница становится видимой
- GitHub Actions еще не запускался

**День 2 (5 октября 2025, 6:00 UTC):**
- GitHub Actions триггерит Netlify Build Hook
- Netlify пересобирает сайт
- Теперь видны все страницы с `publishDate <= 5 октября 6:00 UTC`
- Примерно 18 новых страниц (18 часов × 1 страница/час)

**День 30 (3 ноября 2025):**
- Все 700 страниц опубликованы
- Scheduled builds продолжают работать (на случай новых страниц)

---

## 🔧 Настройка расписания

### Изменение частоты scheduled builds

**Файл:** `.github/workflows/scheduled-build.yml`

```yaml
on:
  schedule:
    # Текущее: Ежедневно в 6:00 AM UTC
    - cron: "0 6 * * *"
```

**Альтернативные расписания:**

| Описание | CRON выражение | Комментарий |
|----------|----------------|-------------|
| Каждые 6 часов | `0 */6 * * *` | Более частые обновления |
| Дважды в день | `0 0,12 * * *` | В полночь и полдень UTC |
| Только по будням | `0 6 * * 1-5` | Пн-Пт в 6:00 AM UTC |
| Каждый час | `0 * * * *` | Максимальная частота |
| Раз в неделю | `0 6 * * 1` | Каждый понедельник |

**Инструмент для создания CRON:** https://crontab.guru/

### Изменение интервала между страницами

**Файл:** `config.yaml`

```yaml
scheduling:
  publish_delay_minutes: 1440  # 1 день между страницами
  # 700 страниц × 1440 минут = 700 дней (~2 года)
```

**Рекомендуемые значения:**

| Интервал | Минуты | Время для 700 страниц |
|----------|--------|----------------------|
| 30 минут | 30 | ~14.5 дней |
| 1 час | 60 | ~29 дней |
| 2 часа | 120 | ~58 дней |
| 6 часов | 360 | ~175 дней |
| 1 день | 1440 | ~700 дней |

---

## 🧪 Тестирование

### Локальное тестирование с будущим контентом

```bash
# Показать все страницы (включая будущие)
hugo server --buildFuture

# Открыть: http://localhost:1313
# Все 700 страниц будут видны
```

### Проверка publishDate в сгенерированных файлах

```bash
# Показать publishDate первых 5 страниц
find content -name "index.md" -type f | head -5 | xargs grep "publishDate:"

# Пример вывода:
# content/alabama/exterior-addendum-blank/index.md:publishDate: 2025-10-04T12:00:00Z
# content/alabama/exterior-addendum-custom/index.md:publishDate: 2025-10-04T13:00:00Z
# content/alabama/exterior-buyers-guide-asis/index.md:publishDate: 2025-10-04T14:00:00Z
```

### Ручной запуск scheduled build

1. Перейдите: `https://github.com/popskraft/auto-window-stickers/actions`
2. Выберите: `Scheduled Netlify Build`
3. Нажмите: `Run workflow`
4. Выберите ветку: `main`
5. Нажмите: `Run workflow`
6. Проверьте логи выполнения

### Проверка Build Hook напрямую

```bash
# Замените URL на ваш Build Hook
curl -X POST "https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID"

# Успешный ответ (HTTP 200):
# {"id":"abc123","state":"new","name":"main","branch":"main",...}
```

---

## 📊 Мониторинг и отладка

### Проверка статуса GitHub Actions

**URL:** `https://github.com/popskraft/auto-window-stickers/actions`

**Что проверять:**
- ✅ Зеленая галочка = успешный запуск
- ❌ Красный крестик = ошибка
- 🟡 Желтый круг = выполняется

**Просмотр логов:**
1. Кликните на workflow run
2. Кликните на job `trigger-netlify-build`
3. Разверните шаги для просмотра деталей

### Проверка Netlify Deploys

**URL:** `https://app.netlify.com/sites/autowindowstickers/deploys`

**Фильтр по Build Hook:**
- Найдите deploys с названием: `Scheduled Build`
- Проверьте статус: `Published` или `Failed`

### Типичные проблемы и решения

| Проблема | Причина | Решение |
|----------|---------|---------|
| GitHub Actions не запускается | Secret не настроен | Проверьте `NETLIFY_BUILD_HOOK_URL` в Secrets |
| Build Hook возвращает 404 | Неверный URL | Пересоздайте Build Hook в Netlify |
| Страницы не появляются | `buildFuture: true` в production | Проверьте `hugo.yaml` и `netlify.toml` |
| Все страницы видны сразу | `apply_to_products: false` | Измените на `true` в `config.yaml` |

---

## 🔐 Безопасность

### Защита Build Hook URL

⚠️ **Важно:** Build Hook URL — это секретный ключ!

**Что НЕ делать:**
- ❌ Не коммитить URL в репозиторий
- ❌ Не публиковать в issues/PR
- ❌ Не делиться публично

**Что делать:**
- ✅ Хранить в GitHub Secrets
- ✅ Использовать через `${{ secrets.NETLIFY_BUILD_HOOK_URL }}`
- ✅ Ротировать при компрометации (пересоздать в Netlify)

### Ограничение доступа

**GitHub Actions:**
- Только maintainers могут редактировать workflows
- Secrets доступны только в Actions

**Netlify:**
- Build Hooks привязаны к конкретной ветке
- Можно создать отдельные hooks для staging/production

---

## 📈 Оптимизация

### Уменьшение времени сборки Hugo

**Текущая команда:**
```bash
hugo --gc --minify
```

**Опции для ускорения:**
```bash
# Отключить minification (быстрее, но больше размер)
hugo --gc

# Использовать кэш
hugo --gc --minify --cacheDir /tmp/hugo_cache

# Параллельная обработка (по умолчанию включено)
hugo --gc --minify --parallel
```

### Оптимизация частоты builds

**Рекомендации:**
- Если `publish_delay_minutes: 60` → scheduled build раз в день достаточно
- Если `publish_delay_minutes: 30` → можно увеличить до 2 раз в день
- Если `publish_delay_minutes: 1440` → раз в неделю достаточно

**Формула:**
```
Частота builds = publish_delay_minutes / 60 / 24
```

---

## 🎯 Стратегии публикации

### Стратегия 1: Быстрый запуск (рекомендуется)

```yaml
# config.yaml
scheduling:
  start_timestamp: "2025-10-04T12:00:00Z"
  publish_delay_minutes: 30  # 30 минут между страницами
  apply_to_products: true

# .github/workflows/scheduled-build.yml
schedule:
  - cron: "0 */6 * * *"  # Каждые 6 часов
```

**Результат:**
- 700 страниц за ~14.5 дней
- 4 сборки в день
- Быстрое наполнение сайта

### Стратегия 2: Постепенный рост

```yaml
# config.yaml
scheduling:
  start_timestamp: "2025-10-04T12:00:00Z"
  publish_delay_minutes: 120  # 2 часа между страницами
  apply_to_products: true

# .github/workflows/scheduled-build.yml
schedule:
  - cron: "0 6 * * *"  # Раз в день
```

**Результат:**
- 700 страниц за ~58 дней
- 1 сборка в день
- Органичный рост контента

### Стратегия 3: Долгосрочная стратегия

```yaml
# config.yaml
scheduling:
  start_timestamp: "2025-10-04T12:00:00Z"
  publish_delay_minutes: 1440  # 1 день между страницами
  apply_to_products: true

# .github/workflows/scheduled-build.yml
schedule:
  - cron: "0 6 * * 1"  # Раз в неделю
```

**Результат:**
- 700 страниц за ~2 года
- 1 сборка в неделю
- Минимальная нагрузка на Netlify

---

## 📚 Дополнительные ресурсы

### Документация

- **Hugo Front Matter:** https://gohugo.io/content-management/front-matter/
- **Hugo publishDate:** https://gohugo.io/methods/page/publishdate/
- **Netlify Build Hooks:** https://docs.netlify.com/build/configure-builds/build-hooks/
- **GitHub Actions Scheduling:** https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
- **CRON Expression Tool:** https://crontab.guru/

### Статьи и туториалы

- **Sebastian De Deyne:** [How to schedule posts with Hugo, Netlify and GitHub Actions](https://sebastiandedeyne.com/how-to-schedule-posts-with-hugo-netlify-and-github-actions)
- **Netlify Blog:** [How to Schedule Deploys with Netlify](https://www.netlify.com/blog/how-to-schedule-deploys-with-netlify/)

---

## ✅ Чеклист запуска

### Перед генерацией контента

- [ ] Установить `start_timestamp` в `config.yaml`
- [ ] Выбрать `publish_delay_minutes` (рекомендуется: 60)
- [ ] Установить `apply_to_products: true`
- [ ] Проверить `limit: null` (для полной генерации)

### Настройка Netlify

- [ ] Создать Build Hook в Netlify Dashboard
- [ ] Скопировать Build Hook URL
- [ ] Проверить `buildFuture: false` в production (hugo.yaml)

### Настройка GitHub

- [ ] Добавить `NETLIFY_BUILD_HOOK_URL` в GitHub Secrets
- [ ] Закоммитить `.github/workflows/scheduled-build.yml`
- [ ] Протестировать ручной запуск workflow

### Генерация и деплой

- [ ] Запустить `python generate-pages.py --type product`
- [ ] Проверить `publishDate` в нескольких файлах
- [ ] Закоммитить и запушить контент
- [ ] Проверить первый деплой на Netlify
- [ ] Убедиться, что видны только страницы с прошедшей датой

### Мониторинг

- [ ] Проверить первый scheduled build (на следующий день)
- [ ] Убедиться, что новые страницы появляются
- [ ] Настроить уведомления GitHub Actions (опционально)
- [ ] Документировать дату завершения публикации

---

**Дата создания документа:** 2025-10-04  
**Версия:** 1.0  
**Автор:** Cascade AI

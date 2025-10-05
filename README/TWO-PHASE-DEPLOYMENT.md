# Двухэтапное развертывание контента

План запуска: сначала 60 страниц для теста, затем остальные 640 страниц.

---

## 🎯 План развертывания

### PHASE 1: Тестовый запуск (60 страниц)
- **Количество:** 60 страниц
- **Интервал:** 30 минут между страницами
- **Время публикации:** ~30 часов (1.25 дня)
- **Цель:** Проверка работы автоматической публикации

### PHASE 2: Полный запуск (640 страниц)
- **Количество:** 640 страниц (остальные)
- **Интервал:** 30 минут между страницами
- **Время публикации:** ~13.3 дня
- **Начало:** После проверки PHASE 1

**Общее время:** ~14.5 дней для всех 700 страниц

---

## 📋 PHASE 1: Тестовый запуск (60 страниц)

### Шаг 1: Проверка конфигурации

**Файл:** `config.yaml`

```yaml
execution:
  limit: 60  # ✅ Установлено

scheduling:
  start_timestamp: "2025-10-04T08:00:00Z"  # ✅ Установлено
  publish_delay_minutes: 30                 # ✅ Установлено
  apply_to_products: true                   # ✅ Установлено
```

**Все готово!** ✅

---

### Шаг 2: Генерация первых 60 страниц

```bash
# Генерация
python generate-pages.py --type product

# Проверка количества
find content -name "index.md" -type f | wc -l
# Ожидается: 60 файлов (+ существующие)

# Проверка временных меток первых 5 страниц
find content -name "index.md" -type f | head -5 | xargs grep "publishDate:"
```

**Ожидаемые временные метки:**
```
Страница 1:  publishDate: 2025-10-04T08:00:00Z
Страница 2:  publishDate: 2025-10-04T08:30:00Z
Страница 3:  publishDate: 2025-10-04T09:00:00Z
...
Страница 60: publishDate: 2025-10-05T13:30:00Z
```

---

### Шаг 3: Коммит и деплой

```bash
# Добавить файлы
git add content/

# Коммит с описанием
git commit -m "Phase 1: Generate 60 product pages with scheduled publishing (30 min intervals)

- Start: 2025-10-04T08:00:00Z
- Interval: 30 minutes
- Total: 60 pages over ~30 hours
- Testing automated publishing system"

# Пуш
git push origin main
```

**Что произойдет:**
- Netlify автоматически задеплоит
- Будут видны только страницы с `publishDate <= текущее время`
- Если сейчас 08:00 UTC → видна 1 страница
- Если сейчас 10:00 UTC → видны 5 страниц

---

### Шаг 4: Мониторинг PHASE 1

#### Проверка сразу после деплоя

```bash
# Открыть сайт
open https://autowindowstickers.com

# Проверить Netlify Deploy
open https://app.netlify.com/sites/autowindowstickers/deploys
```

**Ожидается:**
- Деплой успешен (Published)
- Видны только страницы с прошедшей датой

#### Проверка через 6 часов (14:00 UTC)

**Ожидается:**
- Видны ~12 страниц (6 часов × 2 страницы/час)
- GitHub Actions еще не запускался

#### Проверка на следующий день (6:00 AM UTC)

```bash
# Проверить GitHub Actions
open https://github.com/popskraft/auto-window-stickers/actions
```

**Ожидается:**
- GitHub Actions запустился автоматически
- Netlify пересобрал сайт
- Видны ~44 страницы (22 часа × 2 страницы/час)

#### Проверка через 30 часов (14:00 UTC следующего дня)

**Ожидается:**
- Все 60 страниц видны ✅
- Система работает корректно

---

### Шаг 5: Валидация PHASE 1

**Чеклист проверки:**

- [ ] Все 60 страниц сгенерированы
- [ ] Временные метки корректны (интервал 30 минут)
- [ ] Страницы появляются постепенно (не все сразу)
- [ ] GitHub Actions запускается ежедневно в 6:00 AM UTC
- [ ] Netlify Build Hook работает
- [ ] Новые страницы появляются после scheduled build
- [ ] Нет ошибок в логах GitHub Actions
- [ ] Нет ошибок в логах Netlify

**Если все ✅ → переходим к PHASE 2**

---

## 📋 PHASE 2: Полный запуск (640 страниц)

### Шаг 1: Обновление конфигурации

**Файл:** `config.yaml`

```yaml
execution:
  # Изменить limit
  limit: null  # ← Убрать лимит для генерации всех оставшихся

scheduling:
  # Обновить start_timestamp для продолжения
  # Установить на время окончания PHASE 1 + 30 минут
  start_timestamp: "2025-10-05T14:00:00Z"  # ← Последняя страница PHASE 1 + 30 мин
  
  # Остальное не меняем
  publish_delay_minutes: 30
  apply_to_products: true
```

**Расчет start_timestamp для PHASE 2:**
```
PHASE 1 последняя страница: 2025-10-04T08:00:00Z + (59 × 30 мин) = 2025-10-05T13:30:00Z
PHASE 2 первая страница:    2025-10-05T13:30:00Z + 30 мин       = 2025-10-05T14:00:00Z
```

---

### Шаг 2: Генерация оставшихся 640 страниц

```bash
# Генерация
python generate-pages.py --type product

# Проверка количества
find content -name "index.md" -type f | wc -l
# Ожидается: 700 файлов (60 из PHASE 1 + 640 новых)

# Проверка временных меток новых страниц
find content -name "index.md" -type f | tail -5 | xargs grep "publishDate:"
```

**Ожидаемые временные метки:**
```
Страница 61:  publishDate: 2025-10-05T14:00:00Z  (первая новая)
Страница 62:  publishDate: 2025-10-05T14:30:00Z
...
Страница 700: publishDate: 2025-10-18T11:30:00Z  (последняя)
```

---

### Шаг 3: Коммит и деплой

```bash
# Добавить файлы
git add content/ config.yaml

# Коммит с описанием
git commit -m "Phase 2: Generate remaining 640 product pages (60-700)

- Start: 2025-10-05T14:00:00Z
- Interval: 30 minutes
- Total: 640 pages over ~13.3 days
- Completing full 700-page rollout"

# Пуш
git push origin main
```

---

### Шаг 4: Мониторинг PHASE 2

#### Ежедневная проверка

**GitHub Actions:**
```
https://github.com/popskraft/auto-window-stickers/actions
```

**Netlify Deploys:**
```
https://app.netlify.com/sites/autowindowstickers/deploys
```

**Ожидается:**
- Ежедневно в 6:00 AM UTC запускается scheduled build
- Каждый день появляются ~48 новых страниц
- Нет ошибок в логах

#### Финальная проверка (18 октября)

```bash
# Проверить общее количество страниц
find content -name "index.md" -type f | wc -l
# Ожидается: 700 файлов

# Проверить последнюю временную метку
find content -name "index.md" -type f | xargs grep "publishDate:" | sort | tail -1
# Ожидается: publishDate: 2025-10-18T11:30:00Z
```

**Все 700 страниц опубликованы!** ✅

---

## 📊 Таймлайн развертывания

```
День 1 (4 окт, 08:00 UTC)
├─ PHASE 1 START
├─ Генерация 60 страниц
├─ Деплой на Netlify
└─ Видна 1 страница

День 2 (5 окт, 06:00 UTC)
├─ Первый scheduled build
├─ Видны ~44 страницы из PHASE 1
└─ PHASE 1 почти завершена

День 2 (5 окт, 14:00 UTC)
├─ PHASE 1 COMPLETE (все 60 страниц видны)
├─ PHASE 2 START
├─ Генерация 640 страниц
└─ Деплой на Netlify

День 3-17 (6-18 окт)
├─ Ежедневные scheduled builds
├─ По ~48 новых страниц в день
└─ Постепенная публикация

День 18 (18 окт, 11:30 UTC)
└─ PHASE 2 COMPLETE
    └─ Все 700 страниц опубликованы ✅
```

---

## 🔍 Troubleshooting

### Проблема: Страницы не появляются

**Проверить:**
1. GitHub Actions запускается? → `https://github.com/popskraft/auto-window-stickers/actions`
2. Netlify Build Hook работает? → Проверить логи Actions
3. `buildFuture: false` в hugo.yaml? → Должно быть false для production

### Проблема: Все страницы видны сразу

**Причина:** `apply_to_products: false` в config.yaml

**Решение:** Изменить на `apply_to_products: true`

### Проблема: GitHub Actions не запускается

**Причина:** Secret `NETLIFY_BUILD_HOOK_URL` не настроен

**Решение:** Добавить Secret в GitHub (см. основную документацию)

---

## 📞 Поддержка

**Документация:**
- Полное руководство: `README/PUBLISHING-GUIDE.md`
- Быстрый старт: `README/PUBLISHING-QUICKSTART.md`

**Мониторинг:**
- GitHub Actions: https://github.com/popskraft/auto-window-stickers/actions
- Netlify Deploys: https://app.netlify.com/sites/autowindowstickers/deploys

---

**Дата создания:** 2025-10-04  
**Версия:** 1.0  
**Статус:** Ready for PHASE 1

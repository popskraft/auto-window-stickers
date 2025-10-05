# Быстрый старт: Автоматическая публикация контента

## 🎯 Цель

Настроить автоматическую публикацию 700 страниц продуктов по расписанию через Netlify и GitHub Actions.

---

## ⚡ 5 шагов до запуска

### 1️⃣ Настройка конфигурации генератора

**Файл:** `config.yaml`

```yaml
execution:
  limit: null  # ✅ Убрать лимит для production

scheduling:
  start_timestamp: "2025-10-04T12:00:00Z"  # ✅ Установить начальную дату
  publish_delay_minutes: 30                # ✅ 30 минут между страницами
  apply_to_products: true                  # ✅ Включить scheduling
```

**Результат:** 700 страниц будут опубликованы за ~14.5 дней (30 мин × 700 = 14.5 дня)

---

### 2️⃣ Создание Build Hook в Netlify

1. Откройте: https://app.netlify.com/sites/autowindowstickers/settings/deploys
2. Найдите секцию: **Build hooks**
3. Нажмите: **Add build hook**
4. Заполните:
   - **Name:** `Scheduled Build`
   - **Branch:** `main`
5. **Скопируйте URL** (например: `https://api.netlify.com/build_hooks/abc123...`)

---

### 3️⃣ Добавление Secret в GitHub

1. Откройте: https://github.com/popskraft/auto-window-stickers/settings/secrets/actions
2. Нажмите: **New repository secret**
3. Заполните:
   - **Name:** `NETLIFY_BUILD_HOOK_URL`
   - **Value:** Вставьте URL из шага 2
4. Нажмите: **Add secret**

---

### 4️⃣ Генерация контента

```bash
# Генерация всех 700 страниц
python generate-pages.py --type product

# Проверка первых страниц
find content -name "index.md" -type f | head -3 | xargs grep "publishDate:"

# Коммит и пуш
git add content/ .github/
git commit -m "Generate 700 product pages with scheduled publishing"
git push origin main
```

---

### 5️⃣ Проверка работы

**Сразу после деплоя:**
- Netlify соберет сайт
- Видны только страницы с `publishDate <= текущее время`
- Остальные скрыты до наступления их даты

**На следующий день (6:00 AM UTC):**
- GitHub Actions автоматически запустит Build Hook
- Netlify пересоберет сайт
- Появятся новые страницы (примерно 18 штук за сутки)

**Проверка:**
```bash
# Ручной запуск Build Hook для теста
curl -X POST "https://api.netlify.com/build_hooks/YOUR_HOOK_ID"
```

---

## 📊 Что происходит автоматически

```
День 1 (4 окт, 12:00 UTC)
├─ Первая страница становится видимой
└─ GitHub Actions еще не запускался

День 2 (5 окт, 6:00 UTC)
├─ GitHub Actions триггерит Netlify
├─ Netlify пересобирает сайт
└─ Видны ~36 новых страниц (18 часов × 2 стр/час)

День 3 (6 окт, 6:00 UTC)
├─ Еще один scheduled build
└─ Видны ~84 страницы (42 часа × 2 стр/час)

...

День 15 (18 октября)
└─ Все 700 страниц опубликованы ✅
```

---

## 🔍 Мониторинг

### GitHub Actions
**URL:** https://github.com/popskraft/auto-window-stickers/actions

- ✅ Зеленая галочка = успех
- ❌ Красный крестик = ошибка
- Можно запустить вручную: **Run workflow**

### Netlify Deploys
**URL:** https://app.netlify.com/sites/autowindowstickers/deploys

- Фильтр по: **Scheduled Build**
- Проверка статуса: **Published**

---

## 🛠️ Настройка расписания

### Изменить частоту builds

**Файл:** `.github/workflows/scheduled-build.yml`

```yaml
schedule:
  # Текущее: Ежедневно в 6:00 AM UTC
  - cron: "0 6 * * *"
  
  # Альтернативы:
  # - cron: "0 */6 * * *"   # Каждые 6 часов
  # - cron: "0 0,12 * * *"  # Дважды в день (00:00 и 12:00 UTC)
  # - cron: "0 6 * * 1-5"   # Только по будням
```

### Изменить интервал между страницами

**Файл:** `config.yaml`

```yaml
scheduling:
  # Текущее: 30 минут (14.5 дней для 700 страниц)
  publish_delay_minutes: 30
  
  # Альтернативы:
  # publish_delay_minutes: 60    # 29 дней
  # publish_delay_minutes: 120   # 58 дней
  # publish_delay_minutes: 1440  # 700 дней (1 страница в день)
```

---

## 🧪 Локальное тестирование

```bash
# Показать ВСЕ страницы (включая будущие)
hugo server --buildFuture

# Открыть: http://localhost:1313
# Все 700 страниц будут видны для проверки
```

---

## ❗ Частые проблемы

| Проблема | Решение |
|----------|---------|
| GitHub Actions не запускается | Проверьте Secret `NETLIFY_BUILD_HOOK_URL` |
| Все страницы видны сразу | Убедитесь: `apply_to_products: true` в config.yaml |
| Страницы не появляются | Проверьте: `buildFuture: false` в hugo.yaml (production) |
| Build Hook возвращает 404 | Пересоздайте Build Hook в Netlify |

---

## 📚 Полная документация

Для детального изучения см.: [SCHEDULED-PUBLISHING.md](SCHEDULED-PUBLISHING.md)

**Включает:**
- Подробное объяснение Hugo publishDate vs date
- Стратегии публикации (быстрая/постепенная/долгосрочная)
- Оптимизация и безопасность
- Troubleshooting и мониторинг

---

**Время настройки:** ~15 минут  
**Автоматизация:** 100%  
**Поддержка:** Не требуется после настройки

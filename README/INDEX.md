# Auto Window Stickers - Documentation Index

Документация по оптимизации и рефакторингу сайта autowindowstickers.com

## 📚 Содержание

### 🎨 Frontend Оптимизация

#### [RESPONSIVE_IMAGES.md](RESPONSIVE_IMAGES.md)
**Responsive Images Optimization**
- Реализация `srcset` и `sizes` для адаптивных изображений
- Экономия ~342 KiB трафика на мобильных устройствах
- Улучшение LCP и FCP метрик
- Оптимизация hero images, gallery thumbnails, feature images, логотипов

**Ключевые метрики:**
- Processed images: 145 → 171 (+26 responsive вариантов)
- Экономия трафика: ~342 KiB на mobile
- Качество сжатия: q85 для всех изображений

#### [HERO_DRY_REFACTORING.md](HERO_DRY_REFACTORING.md)
**Hero Section - DRY Refactoring**
- Устранение 80% дублирования кода
- Создание переиспользуемого компонента `hero-column.html`
- Сокращение с 163 до 148 строк (главный файл: 36 строк)
- Применение принципа Single Source of Truth

**Преимущества:**
- Единая логика обработки изображений
- Легко добавлять новые секции
- Консистентность и упрощение поддержки

### 📖 Справочники

#### [handbook.md](handbook.md)
**Project Handbook**
- Общие правила работы с проектом
- Структура проекта
- Best practices

## 🔧 Технологии

- **Hugo** v0.148.1+extended
- **WebP** для всех изображений
- **Responsive Images** с srcset/sizes
- **TailwindCSS** для стилизации
- **DRY принцип** в шаблонах

## 📊 Результаты оптимизации

### Performance
- ✅ LCP улучшен через responsive images
- ✅ FCP улучшен через приоритетную загрузку
- ✅ Экономия трафика: ~342 KiB на mobile

### Code Quality
- ✅ DRY: устранено 80% дублирования
- ✅ Single Source of Truth для логики
- ✅ Переиспользуемые компоненты

### SEO
- ✅ Правильные width/height атрибуты
- ✅ Оптимизированные alt тексты
- ✅ Семантическая разметка (h1/h2)

## 🚀 Быстрый старт

### Сборка проекта
```bash
hugo --cleanDestinationDir
```

### Локальный сервер
```bash
hugo server --buildDrafts --disableFastRender
```

### Проверка responsive images
```bash
# Посмотреть сгенерированные размеры
ls -lh public/images/home/*_hu*.webp | grep "exterior-cover"

# Проверить srcset в HTML
grep -A 3 "srcset=" public/index.html | head -20
```

## 📝 Структура файлов

```
layouts/partials/
├── home/
│   ├── hero.html              # Главный файл hero секции (36 строк)
│   ├── hero-column.html       # Переиспользуемый компонент (112 строк)
│   ├── features.html          # Features секция с responsive images
│   └── about.html             # About секция
├── header.html                # Header с responsive logo
└── footer.html                # Footer

README/
├── INDEX.md                   # Этот файл
├── RESPONSIVE_IMAGES.md       # Документация по responsive images
├── HERO_DRY_REFACTORING.md   # Документация по DRY рефакторингу
└── handbook.md                # Общий справочник
```

## 🐛 Исправленные проблемы

### JavaScript Errors
- ✅ Fixed: `TypeError: Cannot read properties of null (reading 'classList')`
- ✅ Добавлена проверка существования элементов перед инициализацией slideshow

### Template Errors
- ✅ Fixed: `undefined variable "$processed"` и `$final`
- ✅ Правильная область видимости переменных в условных блоках

### Image Optimization
- ✅ Реализованы responsive images с srcset
- ✅ Добавлено сжатие q85 для всех изображений
- ✅ Правильные width/height атрибуты везде

## 📞 Контакты

Для вопросов по документации или предложений по улучшению создайте issue или PR.

---

**Последнее обновление:** 2025-10-03
**Hugo версия:** v0.148.1+extended

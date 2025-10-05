# Internal Linking Guide

## Navigation Standards
- Keep header links to Home, Exterior, Interior, and add States when the directory is public.
- Mirror the same core links in the footer together with contact details and the wholesale form.
- Add breadcrumbs to product, state, and article pages in the format `Home → Category → Page`.

## Category Pages (`/exterior/`, `/interior/`)
- Introduce each page with a short paragraph that links to the top selling products.
- Include a callout pointing users to the States directory for compliance focused information.
- Within any rich text blocks, link to at least one relevant article or FAQ entry.

## Product Detail Pages
- Provide a link back to the category hub near the top of the page.
- Add a related products section that points to at least two sibling SKUs.
- In FAQ and benefits text, link key phrases to supporting articles or state guides when helpful.
- Keep the purchase call to action, but also mention the wholesale form for bulk orders.

## State Landing Pages
- Link to the matching product bundle in the hero or introduction.
- Offer a link to the parent state index (for example `/states/alabama/`) when available.
- Reference authoritative external resources sparingly (DMV or FTC pages) and balance them with internal anchors.
- Suggest two or three other state-product pages to distribute crawl depth.

## Articles
- At the top, link back to the primary product and any relevant state guide.
- Use descriptive anchor text inside the article body, not raw URLs or repetitive phrases.
- End with a clear call to action that links to the wholesale form and a high value state or product page.

## Maintenance Tips
- After major content imports, crawl the site (Screaming Frog or similar) to confirm there are no orphaned pages.
- When editors add manual overrides, keep related product arrays in front matter documented in pull requests.
- Review anchor text variety quarterly and swap repeated links where needed.

graph TD
  Home["Главная"] --> NavHome["Хедер/футер: Exterior, Interior, States"]
  NavHome --> Exterior["Категория Exterior"]
  NavHome --> Interior["Категория Interior"]
  NavHome --> StatesIndex["Директория States"]
  NavHome --> Contacts["Контакты + опт-форма"]

  Exterior --> TopProducts["Топ-продукты"]
  Interior --> TopProducts
  Exterior --> CategoryCallout["Callout → States"]
  Interior --> CategoryCallout
  CategoryCallout --> StatesIndex
  Exterior --> ArticlesFAQ["Релевантные статьи/FAQ"]
  Interior --> ArticlesFAQ

  Product["Карточка продукта"] --> CategoryReturn["Ссылка назад на категорию"]
  Product --> RelatedProducts["Релевантные SKU"]
  Product --> ProductArticles["Статьи/гайды по теме"]
  Product --> StatesGuides["Соотв. state guide"]
  Product --> Wholesale["Опт-форма"]
  ProductArticles --> Wholesale

  StatePage["State страница"] --> BundleLink["Линк на продуктовый бандл"]
  StatePage --> ParentState["Линк на индекс штата"]
  StatePage --> StatePagePeers["2–3 других state page"]
  StatePage --> Authorities["Внешние DMV/FTC (умеренно)"]

  Article["Статья"] --> PrimaryProduct["Основной продукт"]
  Article --> RelevantState["Релевантный state guide"]
  Article --> BodyLinks["Контекстные ссылки на FAQ/продукты"]
  Article --> WholesaleCall["CTA: опт-форма"]
  Article --> HighValue["Высокоценный state или продукт"]

  Contacts -.-> Wholesale
  StatesIndex --> StatePage
  TopProducts --> Product
  RelatedProducts --> Product
  StatePagePeers --> StatePage


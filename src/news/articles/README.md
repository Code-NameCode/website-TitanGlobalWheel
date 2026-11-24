# Posting a news article

You only ever edit **one file** per article, then run **one command**. The
command rebuilds the index, the related-articles lists, and the manifest
automatically — you never touch JSON by hand.

## Steps

1. **Copy the template** to a new file (keep the `_` prefix only on the template):
   ```
   src/news/articles/_template.html   →   src/news/articles/my-article.html
   ```
2. **Fill in the marked spots** (search for `TODO:`):
   - `<title>` and the headline `<h1>`
   - `meta description` (the summary shown on the card)
   - `og:image` + the hero `<img src>` (drop the image in `src/news/images/`)
   - the `<time datetime="YYYY-MM-DD">` date
   - the breadcrumb / `kicker` / `data-related-category` (e.g. `Product Launch`)
   - `data-related-tags` (used to find related articles)
   - `data-related-slug` = your filename **without** `.html`
   - the article body
3. **Run the generator** from the `Titan` project root:
   ```
   npm run news
   ```
   (or `node generate-news.cjs`)
4. **Open `News.html`** — your article is there, with related articles working.

## How it works

`generate-news.cjs` scans every `*.html` in this folder (except files starting
with `_`), reads the article's metadata straight from the page
(`<title>`, `<time datetime>`, `data-related-*`, `<meta description>`,
`og:image`), then rewrites:

- `manifest.json`
- the inline data block in `News.html`
- the inline data block in every article page (so "related articles" works
  even when you open the file directly, without a server)

## Notes

- For a **pull-quote**, **spec card**, or **image gallery** layout, copy one of
  the 4 real articles in this folder instead of the template and adapt it.
- The `data-related-tags` / `data-related-category` drive the "Related articles"
  suggestions — use the same words across articles you want grouped together.
- Images go in `src/news/images/`. Reference them by their filename (relative).

# Approval deck source

- `deck.html` is the 14-slide deck (1280×720 per slide). The PDF in the folder above is rendered from it with Chromium.
- `img/` holds the screenshots, captured from the production build by `capture-screenshots.mjs` (run with the book served at http://localhost:4173/).
- To re-render: open `deck.html` in Chromium and print to PDF with "Background graphics" on, or use Playwright `page.pdf({ width: '1280px', height: '720px', printBackground: true })`.

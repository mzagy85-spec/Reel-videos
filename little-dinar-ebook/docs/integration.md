# Integration guide: website, iOS and Android WebView

The book is a static site. It needs no backend, no login, no banking APIs and no native bridge. Everything below is optional host polish. None of it is live: production domains, app release processes and server configuration belong to the bank's teams, and nothing here has been tested inside the real apps.

## 1. Deploying the static build

1. Run `npm ci && npm run build`. Output goes to `dist/`.
2. Copy `dist/` to a bank-controlled HTTPS location, for example `https://<bank-domain>/kids/money-book/`. Assets are referenced relatively, so any sub-path works without a rebuild. Alternatively build with `BASE_PATH=/kids/money-book/`.
3. Set these response headers on the server or CDN. The example below uses placeholders; replace them with the approved origins:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self' https://<approved-website-origin>
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Cache-Control: (assets/*) public, max-age=31536000, immutable   (index.html) no-cache
```

Notes:

- The build also carries the same CSP, minus `frame-ancestors`, in a `<meta>` tag as a safety net. A meta tag cannot set `frame-ancestors`, so the header is required for embedding control.
- `style-src 'unsafe-inline'` covers dynamic style attributes such as progress bars and grid placement. The book contains no inline `<script>`; the host config block is JSON data, not script.
- Do not remove existing bank security headers. Merge these with them.
- There is no service worker. If offline use is requested later, scope a worker to the book's path only and never let it cache banking pages or API responses.

## 2. Website embed (iframe)

See `embed/iframe-example.html`. Key points:

- Give the iframe a descriptive `title`: «رحلة الدينار الصغير: كتاب تفاعلي عن المال» / "The Little Dinar Journey: interactive money book".
- Size it responsively. The example uses `width: 100%`, a min-height of about 720px, and `height: 100dvh` on phones.
- Always provide a fallback link that opens the book in its own tab.
- Pass `?lang=en` in the `src` to start in English. Arabic is the default.
- Add the website origin to `frame-ancestors` (header above) and to `allowedParentOrigins` in the book's `index.html` (section 4).

**Django CMS.** The platform has not been confirmed, and I have no access to the CMS repository. `embed/django-cms-snippet.html` is a plain HTML plugin/snippet example to adapt. It does not change any CMS configuration.

## 3. iOS WKWebView and Android WebView

The bank's app teams own these steps. A static bundle does not update the native apps or replace their release process.

| Topic | Guidance |
|---|---|
| Origin | Load only the approved HTTPS URL of the book. Restrict navigation to that origin (iOS: `WKNavigationDelegate.decidePolicyFor`; Android: `shouldOverrideUrlLoading`). The book has no outbound links in the child experience; source URLs in the parent drawer are plain text, not links. |
| Isolation | Use a separate, non-persistent data store for the book where possible (`WKWebsiteDataStore.nonPersistent()` on iOS; on Android, no shared cookies with banking sessions). The book never reads or writes auth state. |
| Safe areas | The page uses `viewport-fit=cover` and `env(safe-area-inset-*)`. Let the WebView extend under the notch and home indicator; the bottom page bar respects the inset. |
| Back / close | The book uses `history.replaceState`, so the system back button leaves the book rather than stepping through 15 pages. To show an in-book "Close the book" button, set `"showCloseButton": true` in the host config; the book then sends `ld:close-request` and the app dismisses the screen. |
| Sound | Audio is off until the child turns it on, so no autoplay permission is needed. Set `mediaTypesRequiringUserActionForPlayback = .all` (iOS) and `setMediaPlaybackRequiresUserGesture(true)` (Android). |
| Background | The book pauses ambient animation and stops audio on `visibilitychange`/`pagehide`. Make sure the WebView reports visibility (Android: call `onPause()`/`onResume()` on the WebView). |
| JavaScript | Required. DOM storage is optional: without it the book still works and simply cannot remember progress. |
| Download / print | "Save the card as a picture" uses a normal `<a download>`. Many WebViews ignore it; the book then shows a message suggesting a screenshot with a grown-up. To support saving, implement `WKDownloadDelegate` (iOS 14.5+) or a `DownloadListener` for `blob:` URLs (Android). Printing uses `window.print()`, which WebViews often ignore; the app can offer its own print/share action, or leave printing to the website. |
| Text size | The book scales with the WebView text zoom and has its own Large text setting. Do not disable zoom. |

## 4. Host adapter (optional)

Configuration lives in `index.html`, edited at deployment with no rebuild:

```html
<script id="ld-host-config" type="application/json">
  { "allowedParentOrigins": ["https://<approved-website-origin>"], "showCloseButton": false }
</script>
```

Origins must be exact `https://` origins. Plain `http://localhost` is accepted only for local testing. An empty list disables all parent messaging.

### Website postMessage

The book sends messages only to the parent origin it learns from `location.ancestorOrigins` or the referrer, and only if that origin is on the allowlist. It always uses an explicit target origin, never `'*'`.

| Direction | Message |
|---|---|
| book → host | `{ type: 'ld:ready', version: 1, locale }` once on load |
| book → host | `{ type: 'ld:page-change', pageId, pageNumber, locale }` on every page change |
| book → host | `{ type: 'ld:close-request' }` when the close button is pressed (only if enabled) |
| host → book | `{ type: 'ld:set-locale', locale: 'ar' \| 'en' }` |
| host → book | `{ type: 'ld:set-motion', motion: 'system' \| 'reduce' \| 'full' }` |

Inbound messages must:

- come from `window.parent` (the book checks `event.source`);
- come from an allowlisted `event.origin`;
- match these exact shapes, with no extra keys.

Anything else is ignored. There is no command to open URLs or run code.

Host-side example:

```js
const BOOK_ORIGIN = 'https://<book-origin>';
window.addEventListener('message', (e) => {
  if (e.origin !== BOOK_ORIGIN) return;
  if (e.data?.type === 'ld:close-request') closeBookPanel();
});
iframe.contentWindow.postMessage({ type: 'ld:set-locale', locale: 'en' }, BOOK_ORIGIN);
```

### Native bridge

If present, the book also sends the three outbound messages to:

- iOS: `window.webkit.messageHandlers.littleDinar.postMessage(message)`. Register a `WKScriptMessageHandler` named `littleDinar` and accept only the three types.
- Android: `window.LittleDinarAndroid.postMessage(JSON.stringify(message))`. Add an `@JavascriptInterface` object; validate the JSON and accept only the three types.

Native → book: call `window.LittleDinar.receive({ type: 'ld:set-locale', locale: 'en' })` via `evaluateJavaScript` / `evaluateJavascript`. The same schema validation applies. Do not add a generic "execute" or "open any URL" bridge.

## 5. Analytics

Off by default, and there is no analytics code in the build. If Gulf Bank later approves first-party analytics:

- **Events.** Use only these: `page_view { pageNumber }`, `activity_complete { conceptId }` and `book_complete {}`.
- **Data.** No identifiers, no free text, no device fingerprinting, no third-party endpoint.
- **Implementation.** Emit them through the host adapter (`sendToHost`) so the bank's own approved pipeline decides what to record. Turn them on with a host-config flag after a privacy review.

## 6. Print and PDF

"Print the book" in the parent drawer renders a static 15-page edition in the current language: one book page per sheet, with each activity reduced to its written instruction. A note on every page says print cannot keep the interactions. "Print the card" prints only the keepsake card. Where `window.print` is unavailable, the book says so and nothing breaks.

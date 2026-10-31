// Optional host adapter. The book works fully without any host.
//
// Configuration comes from the JSON block <script id="ld-host-config"> in index.html, which the website/app
// team edits at deployment. Nothing is sent to a parent window unless its origin is listed there.
//
// Inbound (parent -> book), validated by origin, source and schema:
//   { type: 'ld:set-locale', locale: 'ar' | 'en' }
//   { type: 'ld:set-motion', motion: 'system' | 'reduce' | 'full' }
// Outbound (book -> parent / native), explicit target origin, never '*':
//   { type: 'ld:ready', version: 1, locale }
//   { type: 'ld:page-change', pageId, pageNumber, locale }
//   { type: 'ld:close-request' }
// Native bridges (only if present): window.webkit.messageHandlers.littleDinar.postMessage(msg) on iOS,
// window.LittleDinarAndroid.postMessage(JSON.stringify(msg)) on Android. Only the three outbound messages above.
// Native -> book: window.LittleDinar.receive(msg) with the same inbound schema.

import type { Locale } from '../content/schema';

export interface HostConfig {
  allowedParentOrigins: string[];
  showCloseButton: boolean;
  analytics: boolean;
}

// Production origins must be https. Plain http is accepted only for localhost testing.
const ORIGIN_RE = /^(https:\/\/[a-z0-9.-]+(:\d+)?|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/i;

const DEFAULTS: HostConfig = { allowedParentOrigins: [], showCloseButton: false, analytics: false };

export function readHostConfig(): HostConfig {
  try {
    const el = document.getElementById('ld-host-config');
    const parsed = el?.textContent ? JSON.parse(el.textContent) : {};
    const origins = Array.isArray(parsed.allowedParentOrigins)
      ? parsed.allowedParentOrigins.filter((o: unknown): o is string => typeof o === 'string' && ORIGIN_RE.test(o))
      : [];
    return {
      allowedParentOrigins: origins,
      showCloseButton: parsed.showCloseButton === true,
      analytics: false, // Analytics stay off. See docs/integration.md before enabling any first-party events.
    };
  } catch {
    return DEFAULTS;
  }
}

export type Outbound =
  | { type: 'ld:ready'; version: 1; locale: Locale }
  | { type: 'ld:page-change'; pageId: string; pageNumber: number; locale: Locale }
  | { type: 'ld:close-request' };

export type Inbound =
  | { type: 'ld:set-locale'; locale: Locale }
  | { type: 'ld:set-motion'; motion: 'system' | 'reduce' | 'full' };

export function parseInbound(data: unknown): Inbound | null {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  const keys = Object.keys(d);
  if (d.type === 'ld:set-locale' && (d.locale === 'ar' || d.locale === 'en') && keys.length === 2) return { type: 'ld:set-locale', locale: d.locale };
  if (d.type === 'ld:set-motion' && (d.motion === 'system' || d.motion === 'reduce' || d.motion === 'full') && keys.length === 2) return { type: 'ld:set-motion', motion: d.motion };
  return null;
}

interface NativeWindow extends Window {
  webkit?: { messageHandlers?: { littleDinar?: { postMessage: (m: unknown) => void } } };
  LittleDinarAndroid?: { postMessage: (m: string) => void };
  LittleDinar?: { receive: (m: unknown) => void };
}

/** The parent origin we trust, learned from document.referrer only if it is on the allowlist. */
function trustedParentOrigin(cfg: HostConfig): string | null {
  if (window.parent === window) return null;
  let ref: string | null = null;
  try {
    // ancestorOrigins is available in Chromium/WebKit; fall back to the referrer.
    const ao = (window.location as Location & { ancestorOrigins?: DOMStringList }).ancestorOrigins;
    ref = ao && ao.length ? ao[0] : document.referrer ? new URL(document.referrer).origin : null;
  } catch {
    ref = null;
  }
  return ref && cfg.allowedParentOrigins.includes(ref) ? ref : null;
}

export function sendToHost(cfg: HostConfig, msg: Outbound) {
  const origin = trustedParentOrigin(cfg);
  if (origin) window.parent.postMessage(msg, origin);
  const w = window as NativeWindow;
  try { w.webkit?.messageHandlers?.littleDinar?.postMessage(msg); } catch { /* ignore */ }
  try { w.LittleDinarAndroid?.postMessage(JSON.stringify(msg)); } catch { /* ignore */ }
}

export function listenToHost(cfg: HostConfig, onMessage: (m: Inbound) => void): () => void {
  const handler = (e: MessageEvent) => {
    if (e.source !== window.parent || window.parent === window) return;
    if (!cfg.allowedParentOrigins.includes(e.origin)) return;
    const m = parseInbound(e.data);
    if (m) onMessage(m);
  };
  window.addEventListener('message', handler);
  const w = window as NativeWindow;
  w.LittleDinar = { receive: (raw: unknown) => { const m = parseInbound(raw); if (m) onMessage(m); } };
  return () => {
    window.removeEventListener('message', handler);
    delete w.LittleDinar;
  };
}

/** Host may pass ?lang=en (or ar). Arabic is the default. */
export function initialLocaleFromUrl(): Locale | null {
  try {
    const p = new URLSearchParams(window.location.search);
    const l = p.get('lang');
    return l === 'en' || l === 'ar' ? l : null;
  } catch {
    return null;
  }
}

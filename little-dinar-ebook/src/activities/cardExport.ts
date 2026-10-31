// Draws the generic "Money Explorer" keepsake on a canvas and offers it as a PNG download.
// No personal data is drawn or requested. Returns false where downloads are not possible (some WebViews),
// so the UI can explain the fallback instead of showing a broken button.

import logoWhiteUrl from '../assets/brand/gb-logo-white.svg';
import arrowsRedUrl from '../assets/brand/arrows-double-red.webp';
import type { Locale } from '../content/schema';

interface CardText { locale: Locale; title: string; line: string; habit: string; credit: string; note: string }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && cur) { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

export async function exportCardImage(text: CardText): Promise<boolean> {
  try {
    await document.fonts?.ready;
    const W = 1200, H = 800;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    const rtl = text.locale === 'ar';
    ctx.direction = rtl ? 'rtl' : 'ltr';
    // Background: white card with a primary-red band carrying the approved inverted logo.
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#EF2B2D'; ctx.fillRect(0, 0, W, 170);
    ctx.fillStyle = '#F3F3F3'; ctx.fillRect(0, H - 120, W, 120);
    const logo = await loadImage(logoWhiteUrl);
    const lh = 64, lw = lh * (logo.naturalWidth && logo.naturalHeight ? logo.naturalWidth / logo.naturalHeight : 5.645);
    ctx.drawImage(logo, W - 70 - lw, 53, lw, lh);
    const arrows = await loadImage(arrowsRedUrl);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(arrows, 70, 230, 120, 128);
    ctx.globalAlpha = 1;

    const x = rtl ? W - 90 : 230;
    const maxW = W - 320;
    ctx.textAlign = rtl ? 'right' : 'left';
    ctx.fillStyle = '#00248F';
    ctx.font = '700 84px Cairo, sans-serif';
    ctx.fillText(text.title, x, 330);
    ctx.fillStyle = '#5F6264';
    ctx.font = '600 38px Cairo, sans-serif';
    let y = 410;
    for (const l of wrap(ctx, text.line, maxW)) { ctx.fillText(l, x, y); y += 54; }
    ctx.fillStyle = '#CE0000';
    ctx.font = '700 40px Cairo, sans-serif';
    y += 10;
    for (const l of wrap(ctx, text.habit, maxW)) { ctx.fillText(l, x, y); y += 56; }
    ctx.fillStyle = '#5F6264';
    ctx.font = '400 28px Cairo, sans-serif';
    ctx.textAlign = rtl ? 'right' : 'left';
    ctx.fillText(text.credit, rtl ? W - 70 : 70, H - 70);
    ctx.font = '400 22px Cairo, sans-serif';
    ctx.fillText(text.note, rtl ? W - 70 : 70, H - 34);

    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png'));
    if (!blob) return false;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    if (!('download' in a)) { URL.revokeObjectURL(url); return false; }
    a.href = url;
    a.download = text.locale === 'ar' ? 'mustakshif-al-mal.png' : 'money-explorer.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch {
    return false;
  }
}

import { useId } from 'react';

/** Unique, colon-free id prefix so gradients never collide when several SVGs render together. */
export function useSvgId(prefix: string): string {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

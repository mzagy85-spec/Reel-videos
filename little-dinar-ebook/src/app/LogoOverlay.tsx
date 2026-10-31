import logoColour from '../assets/brand/gb-logo-colour.svg';

/**
 * Places the official logo file on the blank sign panel left in an illustration, using the same viewBox and
 * aspect handling as the art so it lines up exactly. The logo is drawn unaltered, upright, at its own ratio
 * (preserveAspectRatio "meet"), on a clean white panel with clear space. It is never drawn into the artwork.
 */
export function LogoOverlay({ viewBox, x, y, width, height, slice = false }: { viewBox: string; x: number; y: number; width: number; height: number; slice?: boolean }) {
  return (
    <svg className="logo-overlay" viewBox={viewBox} preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} aria-hidden="true" focusable="false">
      <image href={logoColour} x={x} y={y} width={width} height={height} preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

/** Sign panel positions agreed with the illustration set. */
export const BRANCH_SIGN = { x: 450, y: 124, width: 300, height: 52 }; // inside the white panel x 420-780, y 110-190
export const MAP_BANK_SIGN = { x: 688, y: 368, width: 124, height: 24 }; // inside the map bank panel x 680-820, y 360-400

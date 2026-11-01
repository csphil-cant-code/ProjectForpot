/**
 * Pondo app mark from `public/logo-mark-light.jpg` — the peso emblem from the
 * brand logo, re-graded into a light pastel tile so it sits quietly next to the
 * UI. Decorative: the wordmark next to it already names the app.
 */
export const pondoMark = (size = 42, className?: string): string => `<img
  src="${import.meta.env.BASE_URL}logo-mark-light.jpg"
  alt=""
  width="${size}"
  height="${size}"
  class="pondo-mark${className ? ` ${className}` : ""}"
  draggable="false"
/>`;

/** GCash brand mark from `public/image.png`. */
export const gcashLogo = (
  size = 20,
  decorative = false,
  className?: string,
): string => `<img
  src="${import.meta.env.BASE_URL}image.png"
  alt="${decorative ? "" : "GCash"}"
  width="${size}"
  height="${size}"
  style="width:${size}px;height:${size}px"
  class="gcash-logo${className ? ` ${className}` : ""}"
  draggable="false"
/>`;

/** Inline paper-bill mark with a peso sign — no image asset needed. */
export const cashLogo = (
  size = 20,
  decorative = false,
  className?: string,
): string => `<svg
  width="${size}"
  height="${size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.6"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="cash-logo${className ? ` ${className}` : ""}"
  ${decorative ? 'aria-hidden="true"' : 'role="img" aria-label="Cash"'}
  focusable="false"
>
  <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
  <path d="M5.2 8.7h1.2M5.2 15.3h1.2M17.6 8.7h1.2M17.6 15.3h1.2" opacity="0.5" />
  <path d="M10.6 8.8v6.4" />
  <path d="M10.6 8.8h1.7a1.9 1.9 0 0 1 0 3.8h-1.7" />
  <path d="M9.2 10.8h3.9M9.2 12.4h3.9" />
</svg>`;

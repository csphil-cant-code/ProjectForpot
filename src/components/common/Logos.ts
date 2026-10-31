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

/** Cash mark from `public/cash.png`. */
export const cashLogo = (
  size = 20,
  decorative = false,
  className?: string,
): string => `<img
  src="${import.meta.env.BASE_URL}cash.png"
  alt="${decorative ? "" : "Cash"}"
  width="${size}"
  height="${size}"
  style="width:${size}px;height:${size}px"
  class="cash-logo${className ? ` ${className}` : ""}"
  draggable="false"
/>`;

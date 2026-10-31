const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat("en-PH", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** `₱1,250.00` */
export const peso = (value: number): string => pesoFormatter.format(value);

/** `₱1.3K` — handy for chart labels. */
export const pesoCompact = (value: number): string =>
  `₱${compactFormatter.format(value)}`;

/** Keeps the minus sign before the currency symbol on negatives. */
export const signedPeso = (value: number): string =>
  value < 0 ? `−${peso(Math.abs(value))}` : peso(value);

export const percent = (value: number): string =>
  `${Math.round(value * 100)}%`;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

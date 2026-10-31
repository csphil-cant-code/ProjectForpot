export type IconName =
  | "home"
  | "list"
  | "wallet"
  | "chart"
  | "settings"
  | "plus"
  | "trash"
  | "down-left"
  | "up-right"
  | "chevron-left"
  | "chevron-right"
  | "search"
  | "download"
  | "upload"
  | "refresh"
  | "close"
  | "leaf"
  | "alert"
  | "check"
  | "coins"
  | "phone"
  | "banknote";

const paths: Record<IconName, string> = {
  home: `
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9.5 21v-6h5v6" />`,
  list: `
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1" />
    <circle cx="3.5" cy="12" r="1" />
    <circle cx="3.5" cy="18" r="1" />`,
  wallet: `
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z" />
    <path d="M3 8h15" />
    <path d="M16 13h2" />`,
  chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />`,
  settings: `
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />`,
  plus: `<path d="M12 5v14M5 12h14" />`,
  trash: `
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    <path d="M10 11v5M14 11v5" />`,
  "down-left": `<path d="M17 7 7 17M7 9v8h8" />`,
  "up-right": `<path d="M7 17 17 7M9 7h8v8" />`,
  "chevron-left": `<path d="m14 6-6 6 6 6" />`,
  "chevron-right": `<path d="m10 6 6 6-6 6" />`,
  search: `
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />`,
  download: `
    <path d="M12 3v12M7 10l5 5 5-5" />
    <path d="M4 19h16" />`,
  upload: `
    <path d="M12 15V3M7 8l5-5 5 5" />
    <path d="M4 19h16" />`,
  refresh: `
    <path d="M20 11a8 8 0 0 0-13.7-5.3L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 13.7 5.3L20 16" />
    <path d="M20 20v-4h-4" />`,
  close: `<path d="M6 6l12 12M18 6 6 18" />`,
  leaf: `
    <path d="M4 20c0-8 5-14 16-16 0 11-6 16-13 16H4Z" />
    <path d="M4 20c3-6 7-9 12-11" />`,
  alert: `
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 9.5v4.5M12 17.2v.1" />`,
  check: `<path d="m4 12.5 5 5L20 6.5" />`,
  coins: `
    <ellipse cx="9" cy="7" rx="6" ry="3" />
    <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
    <path d="M3 11v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.4" />
    <circle cx="16.5" cy="16.5" r="4.5" />
    <path d="M16.5 14.5v4M14.8 16.5h3.4" />`,
  phone: `
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M11 18.5h2" />`,
  banknote: `
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <circle cx="12" cy="12" r="2.8" />
    <path d="M6 9.5v5M18 9.5v5" />`,
};

export const icon = (
  name: IconName,
  size = 20,
  className?: string,
): string => `<svg
  width="${size}"
  height="${size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  ${className ? `class="${className}"` : ""}
  aria-hidden="true"
>${paths[name]}</svg>`;

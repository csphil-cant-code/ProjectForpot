const pad = (value: number): string => String(value).padStart(2, "0");

export const toISO = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayISO = (): string => toISO(new Date());

/** `2026-10-31` → `2026-10` */
export const monthOf = (iso: string): string => iso.slice(0, 7);

export const currentMonth = (): string => monthOf(todayISO());

export const monthLabel = (month: string): string => {
  const [year, index] = month.split("-").map(Number);
  return new Date(year, index - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const monthShort = (month: string): string => {
  const [year, index] = month.split("-").map(Number);
  return new Date(year, index - 1, 1).toLocaleDateString("en-US", {
    month: "short",
  });
};

export const shiftMonth = (month: string, delta: number): string => {
  const [year, index] = month.split("-").map(Number);
  return monthOf(toISO(new Date(year, index - 1 + delta, 1)));
};

export const previousMonths = (month: string, count: number): string[] => {
  const months: string[] = [];
  for (let offset = count - 1; offset >= 0; offset -= 1) {
    months.push(shiftMonth(month, -offset));
  }
  return months;
};

export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatDateLong = (iso: string): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const relativeDay = (iso: string): string => {
  const today = todayISO();
  if (iso === today) return "Today";
  if (iso === shiftMonthDay(today, -1)) return "Yesterday";
  return formatDate(iso);
};

/** Adds days to an ISO date without timezone surprises. */
export const shiftMonthDay = (iso: string, delta: number): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return toISO(new Date(year, month - 1, day + delta));
};

export const weekdayShort = (iso: string): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
  });
};

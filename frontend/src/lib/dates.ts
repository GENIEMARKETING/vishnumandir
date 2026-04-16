type YyyyMmDd = `${number}-${number}-${number}`;

function isYyyyMmDd(value: string): value is YyyyMmDd {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Parse a date coming from typical form inputs.
 *
 * - If value is "YYYY-MM-DD" (from <input type="date">), interpret it as a *local* calendar date
 *   to avoid the common off-by-one bug from Date("YYYY-MM-DD") being parsed as UTC.
 * - Otherwise, fall back to the JS Date parser.
 */
export function parseFormDate(value: string): Date | null {
  if (!value) return null;

  if (isYyyyMmDd(value)) {
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function formatLongUsDate(dt: Date): string {
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


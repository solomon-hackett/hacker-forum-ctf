export function timeAgo(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

  const now = Date.now();
  const past = new Date(date).getTime();

  if (isNaN(past)) return "unknown time";

  const diff = past - now;

  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(diff / 60_000);
  const hours = Math.round(diff / 3_600_000);
  const days = Math.round(diff / 86_400_000);
  const weeks = Math.round(diff / 604_800_000);
  const months = Math.round(diff / 2_629_746_000);
  const years = Math.round(diff / 31_556_952_000);

  // Very recent
  if (Math.abs(seconds) < 10) return "just now";
  if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");

  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");

  if (Math.abs(days) < 7) {
    if (Math.abs(days) === 1) return seconds < 0 ? "yesterday" : "tomorrow";
    return rtf.format(days, "day");
  }

  if (Math.abs(weeks) < 5) return rtf.format(weeks, "week");
  if (Math.abs(months) < 12) return rtf.format(months, "month");

  return rtf.format(years, "year");
}

export function truncate(text: string, length: number = 200): string {
  if (!text) return "";
  if (text.length <= length) return text;

  return text.slice(0, length).trimEnd() + "...";
}

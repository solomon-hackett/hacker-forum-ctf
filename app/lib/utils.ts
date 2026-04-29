export function generatePrettyDate(created_at: string | Date) {
  const created =
    created_at instanceof Date ? created_at : new Date(created_at);

  if (isNaN(created.getTime())) return "invalid date";

  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffDays < 365)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

  return created.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSort(sort: string) {
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
  }
  return (
    <select
      onChange={(e) => {
        handleSort(e.target.value);
      }}
      defaultValue={searchParams.get("sort")?.toString()}
      className="bg-base-input focus:bg-base-hover px-2 py-1 border border-transparent focus:border-border-input rounded-full"
    >
      <option value="title-asc">Title Ascending</option>
      <option value="title-desc">Title Descending</option>
      <option value="author-asc">Author Ascending</option>
      <option value="author-desc">Author Descending</option>
      <option value="created_at-asc">Creation Date Ascending</option>
      <option value="created_at-desc">Creation Date Descending</option>
    </select>
  );
}

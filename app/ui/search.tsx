"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="relative w-full max-w-sm">
      <MagnifyingGlassIcon className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />

      <input
        type="text"
        name="search"
        id="search"
        placeholder="Search..."
        className="bg-base-input hover:bg-base-hover focus:bg-base-hover py-2 pr-4 pl-10 border border-transparent focus:border-border-input rounded-full outline-none w-full"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}

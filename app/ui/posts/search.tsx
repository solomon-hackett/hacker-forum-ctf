"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

        .search-wrapper {
          position: relative;
          width: 100%;
          max-width: 360px;
        }
        .search-input {
          width: 100%;
          background: #1a1d27;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.65rem 0.9rem 0.65rem 2.6rem;
          font-size: 0.875rem;
          font-family: 'Sora', sans-serif;
          color: #e8eaf2;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder {
          color: #6b7091;
          font-size: 0.8rem;
        }
        .search-input:focus {
          border-color: #7c6dfa;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.12);
        }
        .search-icon {
          position: absolute;
          top: 50%;
          left: 0.75rem;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #6b7091;
          pointer-events: none;
          transition: color 0.2s;
        }
        .search-wrapper:focus-within .search-icon {
          color: #7c6dfa;
        }
      `}</style>

      <div className="search-wrapper">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          className="search-input"
          type="text"
          name="search"
          id="search"
          placeholder="Search posts…"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </div>
    </>
  );
}

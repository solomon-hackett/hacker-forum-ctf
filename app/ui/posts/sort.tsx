"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

const SORT_OPTIONS = [
  { label: "Title Ascending", value: "title-asc" },
  { label: "Title Descending", value: "title-desc" },
  { label: "Creation Date Descending", value: "date-desc" },
  { label: "Creation Date Ascending", value: "date-asc" },
];

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = searchParams.get("sort");
  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === currentSort)?.label ?? "Sort By";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sort-wrapper {
          position: relative;
          font-family: 'Sora', sans-serif;
          display: inline-block;
        }

        .sort-trigger-wrap {
          border-radius: 10px;
          padding: 1px;
          background: #2a2d3a;
          transition: background 0.2s;
        }
        .sort-trigger-wrap:hover {
          background: linear-gradient(135deg, rgba(124,109,250,0.6), rgba(91,156,246,0.4));
        }
        .sort-trigger-wrap.open {
          background: linear-gradient(135deg, rgba(124,109,250,0.5), rgba(91,156,246,0.35));
        }

        .sort-trigger {
          background: #1a1d27;
          border: none;
          border-radius: 9px;
          color: #e8eaf2;
          font-family: 'Sora', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.65rem 0.9rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          width: 100%;
        }

        .sort-trigger-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: #6b7091;
        }
        .sort-trigger-value {
          color: #e8eaf2;
          font-size: 0.82rem;
        }
        .sort-chevron {
          width: 1rem;
          height: 1rem;
          color: #6b7091;
          margin-left: 2px;
        }

        .sort-menu-wrap {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          padding: 1px;
          background: linear-gradient(135deg, rgba(124,109,250,0.5), rgba(91,156,246,0.35));
          border-radius: 10px;
          z-index: 50;
          animation: sort-menu-in 0.15s ease-out forwards;
          transform-origin: top center;
        }

        .sort-menu {
          background: #1a1d27;
          border-radius: 9px;
          overflow: hidden;
        }

        .sort-option {
          width: 100%;
          background: transparent;
          border: none;
          color: #a0a3b8;
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          padding: 0.6rem 0.9rem;
          cursor: pointer;
          text-align: left;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .sort-option:hover {
          background: rgba(124, 109, 250, 0.08);
          color: #e8eaf2;
        }
        .sort-option.active {
          color: #9fa6ff;
          background: rgba(124, 109, 250, 0.06);
        }
        .sort-option + .sort-option {
          border-top: 1px solid #2a2d3a;
        }

        @keyframes sort-menu-in {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className="sort-wrapper">
        <div className={`sort-trigger-wrap${isOpen ? " open" : ""}`}>
          <button
            className="sort-trigger"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="sort-trigger-label">Sort:</span>
            <span className="sort-trigger-value">{currentLabel}</span>
            {isOpen ? (
              <ChevronUpIcon className="sort-chevron" />
            ) : (
              <ChevronDownIcon className="sort-chevron" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="sort-menu-wrap">
            <div className="sort-menu" role="listbox">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`sort-option${currentSort === option.value ? " active" : ""}`}
                  onClick={() => handleSort(option.value)}
                  role="option"
                  aria-selected={currentSort === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

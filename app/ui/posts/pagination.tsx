"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { generatePagination } from "@/app/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .pagination-root {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-family: 'DM Mono', monospace;
        }

        .pagination-arrow {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid #2a2d3a;
          background: #1a1d27;
          color: #6b7091;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .pagination-arrow:hover {
          border-color: #7c6dfa;
          color: #e8eaf2;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.1);
        }
        .pagination-arrow.disabled {
          opacity: 0.3;
          pointer-events: none;
        }

        .pagination-number {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid #2a2d3a;
          background: #1a1d27;
          color: #a0a3b8;
          font-size: 0.78rem;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .pagination-number:hover {
          border-color: #7c6dfa;
          color: #e8eaf2;
          box-shadow: 0 0 0 3px rgba(124, 109, 250, 0.1);
        }
        .pagination-number.active {
          background: transparent;
          border: 1px solid transparent;
          background-image: linear-gradient(#1a1d27, #1a1d27),
                            linear-gradient(135deg, rgba(124,109,250,0.9), rgba(91,156,246,0.7));
          background-origin: border-box;
          background-clip: padding-box, border-box;
          color: #9fa6ff;
          box-shadow: 0 0 12px rgba(124, 109, 250, 0.15);
        }
        .pagination-number.ellipsis {
          border-color: transparent;
          background: transparent;
          color: #3a3d52;
          pointer-events: none;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="pagination-root">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;
          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx("pagination-number", {
    active: isActive,
    ellipsis: position === "middle",
  });

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = clsx("pagination-arrow", { disabled: isDisabled });
  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4 h-4" />
    ) : (
      <ArrowRightIcon className="w-4 h-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

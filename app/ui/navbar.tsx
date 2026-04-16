"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", name: "Home" },
  { href: "/posts", name: "Posts" },
  { href: "/account", name: "Account" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="top-0 z-50 sticky flex justify-between items-center px-6 py-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-6 bg-base-surface/60 shadow-glow-green/20 backdrop-blur-sm px-5 py-2 rounded-xl"
      >
        <Image
          src="/forum-logo.png"
          alt="Hacker Forum logo"
          width={811}
          height={280}
          className="w-auto h-10 sm:h-14 md:h-20"
        />
      </Link>

      {/* Desktop links */}
      <div className="hidden sm:flex items-center gap-6 bg-base-surface/60 shadow-glow-green/20 backdrop-blur-sm px-5 py-2 rounded-xl">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "relative px-2 py-1 rounded-xl text-xl md:text-2xl lg:text-4xl transition-all duration-300",
                "hover:bg-neon-green hover:shadow-glow-green hover:text-base hover:animate-glow-pulse",
                isActive
                  ? "bg-neon-green text-base shadow-glow-green"
                  : "text-neon-green",
              )}
            >
              {link.name}
              {/* Active underline accent */}
              {isActive && (
                <span className="bottom-0 left-1/2 absolute bg-neon-green shadow-glow-green rounded-full w-1.5 h-1.5 -translate-x-1/2" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
        className="sm:hidden flex flex-col justify-center items-center gap-1.5 bg-base-surface/60 shadow-glow-green/20 backdrop-blur-sm p-3 rounded-xl w-11 h-11"
      >
        <span
          className={clsx(
            "block bg-neon-green shadow-glow-green rounded-full w-5 h-0.5 transition-all duration-300",
            menuOpen && "rotate-45 translate-y-2",
          )}
        />
        <span
          className={clsx(
            "block bg-neon-green shadow-glow-green rounded-full w-5 h-0.5 transition-all duration-300",
            menuOpen && "opacity-0",
          )}
        />
        <span
          className={clsx(
            "block bg-neon-green shadow-glow-green rounded-full w-5 h-0.5 transition-all duration-300",
            menuOpen && "-rotate-45 -translate-y-2",
          )}
        />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden top-full right-6 absolute flex flex-col gap-1 bg-base-surface/90 shadow-glow-green/10 backdrop-blur-sm mt-2 px-4 py-3 border border-neon-green/20 rounded-xl min-w-40">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  "px-3 py-2 rounded-lg text-lg transition-all duration-200",
                  "hover:bg-neon-green hover:shadow-glow-green hover:text-base",
                  isActive
                    ? "bg-neon-green text-base shadow-glow-green font-medium"
                    : "text-neon-green",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

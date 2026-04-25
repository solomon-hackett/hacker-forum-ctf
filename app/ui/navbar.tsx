"use client";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", name: "Home" },
  { href: "/posts", name: "Posts" },
  { href: "/account", name: "Account" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="top-0 z-50 sticky flex justify-between items-center px-6 py-4">
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
          priority
        />
      </Link>

      <div className="hidden sm:flex items-center gap-6 bg-base-surface/60 shadow-glow-green/20 backdrop-blur-sm px-5 py-2 rounded-xl">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "relative px-2 py-1 rounded-xl text-xl md:text-2xl lg:text-4xl transition-all duration-300",
                "hover:bg-neon-green hover:text-base",
                isActive
                  ? "bg-neon-green text-base shadow-glow-green"
                  : "text-neon-green",
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

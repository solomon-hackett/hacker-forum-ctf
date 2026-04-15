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
    <nav className="flex justify-between items-center px-6 py-4">
      <Link href="/" className="flex items-center">
        <Image
          src="/forum-logo.png"
          alt="Hacker Forum logo"
          width={811}
          height={280}
          className="w-auto h-20"
        />
      </Link>
      <div className="flex items-center gap-6 bg-base-surface/60 shadow-glow-green/20 px-5 py-2 rounded-xl">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "hover:bg-neon-green hover:shadow-glow-green px-2 py-1 rounded-xl hover:text-base text-4xl transition hover:animate-glow-pulse duration-400",
              {
                "bg-neon-green-dim text-base": pathname === link.href,
              },
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

"use client";

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: "/posts", name: "Posts" },
  { href: "/account", name: "Account" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

        .navbar {
          font-family: 'Sora', sans-serif;
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
        }
        .navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(13,14,18,0.95) 0%, rgba(13,14,18,0.0) 100%);
          pointer-events: none;
          z-index: -1;
        }
        .nav-logo-wrap {
          display: flex;
          align-items: center;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.5rem 1.25rem;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nav-logo-wrap:hover {
          border-color: #3d4155;
          box-shadow: 0 0 20px rgba(124,109,250,.08);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.4rem 0.5rem;
        }
        .nav-link {
          position: relative;
          padding: 0.4rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 400;
          color: #6b7091;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover {
          color: #e8eaf2;
          background: #1a1d27;
        }
        .nav-link.active {
          color: #e8eaf2;
          background: linear-gradient(135deg, rgba(124,109,250,.2), rgba(91,156,246,.15));
          border: 1px solid rgba(124,109,250,.25);
          font-weight: 500;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #7c6dfa, #5b9cf6);
        }
        @media (max-width: 640px) {
          .nav-links { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo-wrap">
          <Image
            src="/forum-logo.png"
            alt="Hacker Forum logo"
            width={811}
            height={280}
            className="w-auto h-8 sm:h-10"
            priority
          />
        </Link>

        <div className="nav-links">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx("nav-link", { active: isActive })}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

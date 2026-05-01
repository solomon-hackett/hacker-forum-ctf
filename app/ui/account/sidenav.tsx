"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { handleSignOut } from "@/app/lib/actions";
import {
  ArrowLeftStartOnRectangleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const links = [
  { href: "/account", name: "Your Account", icon: UserIcon },
  { href: "/account/posts", name: "Your Posts", icon: DocumentTextIcon },
];

const adminLinks = [
  { href: "/account/admin", name: "Admin", icon: ShieldCheckIcon },
];

export default function SideNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sidenav {
          font-family: 'Sora', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 220px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
          z-index: 20;
          background: #0d0e12;
          border-right: 1px solid #2a2d3a;
        }

        .sidenav-logo-spacer {
          height: 80px;
          margin-top: -0.75rem;
          margin-left: -0.75rem;
          margin-right: -0.75rem;
          flex-shrink: 0;
          border-bottom: 1px solid #2a2d3a;
        }

        .sidenav-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.4rem;
          position: relative;
          min-height: 0;
          overflow: hidden;
        }
        .sidenav-panel::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(124,109,250,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .sidenav-link {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.4rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 400;
          color: #6b7091;
          text-decoration: none;
          border: 1px solid transparent;
          box-sizing: border-box;
          width: 100%;
          flex-shrink: 0;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .sidenav-link:hover { color: #e8eaf2; background: #1a1d27; }
        .sidenav-link.active {
          color: #e8eaf2;
          background: linear-gradient(135deg, rgba(124,109,250,.18), rgba(91,156,246,.12));
          border-color: rgba(124,109,250,.25);
          font-weight: 500;
        }
        .sidenav-link.admin-link { color: #ef9f27; }
        .sidenav-link.admin-link:hover {
          background: rgba(239,159,39,.08); color: #f5bc5e;
        }
        .sidenav-link.admin-link.active {
          background: rgba(239,159,39,.12);
          border-color: rgba(239,159,39,.3);
          color: #f5bc5e;
        }

        .sidenav-icon { flex-shrink: 0; }

        .sidenav-divider {
          height: 1px; background: #2a2d3a;
          border: none; margin: 0.25rem 0; flex-shrink: 0;
        }

        .sidenav > form { flex-shrink: 0; width: 100%; }
        .sidenav-signout {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.45rem 0.4rem;
          border-radius: 10px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          color: #6b7091;
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          flex-shrink: 0;
          white-space: nowrap;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .sidenav-signout:hover {
          color: #f09595;
          background: rgba(240,149,149,.06);
          border-color: rgba(240,149,149,.2);
        }
      `}</style>

      <aside className="sidenav">
        <div className="sidenav-logo-spacer" />

        <nav className="sidenav-panel">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidenav-link${isActive ? " active" : ""}`}
              >
                <Icon className="w-4 h-4 sidenav-icon" />
                {link.name}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <hr className="sidenav-divider" />
              {adminLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`sidenav-link admin-link${isActive ? " active" : ""}`}
                  >
                    <Icon className="w-4 h-4 sidenav-icon" />
                    {link.name}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <form action={handleSignOut}>
          <button className="sidenav-signout">
            <ArrowLeftStartOnRectangleIcon className="w-4 h-4 sidenav-icon" />
            Sign Out
          </button>
        </form>
      </aside>
    </>
  );
}

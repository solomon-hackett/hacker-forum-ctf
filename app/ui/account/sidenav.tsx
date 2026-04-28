"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { handleSignOut } from "@/app/lib/actions";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import NotificationTray from "./notification-tray";

const links = [
  { href: "/account", name: "Your Account", icon: UserIcon },
  { href: "/account/posts", name: "Your Posts", icon: DocumentTextIcon },
];

const adminLinks = [{ href: "/admin", name: "Admin", icon: ShieldCheckIcon }];

export default function SideNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
          transition: width 0.25s ease;
          z-index: 30;
          background: #0d0e12;
          border-right: 1px solid #2a2d3a;
          border-top: none;
        }
        .sidenav.collapsed {
          width: 68px;
        }

        /* Toggle button */
        .sidenav-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.5rem;
          cursor: pointer;
          color: #6b7091;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .sidenav-toggle:hover {
          border-color: #3d4155;
          color: #e8eaf2;
        }

        /* Nav panel */
        .sidenav-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.5rem;
          position: relative;
          overflow: hidden;
          min-height: 0;
        }
        .sidenav-panel::before {
          content: '';
          position: absolute;
          top: -50px; right: -50px;
          width: 150px; height: 150px;
          background: radial-gradient(circle, rgba(124,109,250,.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .spacer{
        display: flex;
          align-items: center;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.5rem 1.25rem;
          text-decoration: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        /* Links */
        .sidenav-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.65rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 400;
          color: #6b7091;
          text-decoration: none;
          border: 1px solid transparent;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          flex-shrink: 0;
        }
        .sidenav-link:hover {
          color: #e8eaf2;
          background: #1a1d27;
        }
        .sidenav-link.active {
          color: #e8eaf2;
          background: linear-gradient(135deg, rgba(124,109,250,.18), rgba(91,156,246,.12));
          border-color: rgba(124,109,250,.25);
          font-weight: 500;
        }
        .sidenav-link.admin-link { color: #ef9f27; }
        .sidenav-link.admin-link:hover {
          background: rgba(239,159,39,.08);
          color: #f5bc5e;
        }
        .sidenav-link.admin-link.active {
          background: rgba(239,159,39,.12);
          border-color: rgba(239,159,39,.3);
          color: #f5bc5e;
        }

        .sidenav-divider {
          height: 1px;
          background: #2a2d3a;
          border: none;
          margin: 0.25rem 0;
          flex-shrink: 0;
        }

        /* Label hide on collapse */
        .sidenav-label {
          opacity: 1;
          max-width: 200px;
          transition: opacity 0.15s ease, max-width 0.25s ease;
          overflow: hidden;
        }
        .sidenav.collapsed .sidenav-label {
          opacity: 0;
          max-width: 0;
          pointer-events: none;
        }

        /* Sign out */
        .sidenav-signout {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.65rem;
          border-radius: 10px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          color: #6b7091;
          font-family: 'Sora', sans-serif;
          font-size: 0.82rem;
          cursor: pointer;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          flex-shrink: 0;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .sidenav-signout:hover {
          color: #f09595;
          background: rgba(240,149,149,.06);
          border-color: rgba(240,149,149,.2);
        }
      `}</style>

      <aside className={clsx("sidenav", { collapsed })}>
        {/* Collapse toggle */}
        <button
          className="sidenav-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="w-4 h-4" />
        </button>

        {/* Nav links */}
        <nav className="sidenav-panel">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx("sidenav-link", { active: isActive })}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="sidenav-label">{link.name}</span>
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
                    className={clsx("sidenav-link admin-link", {
                      active: isActive,
                    })}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="sidenav-label">{link.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Sign out pinned to bottom */}
        <form action={handleSignOut}>
          <button className="sidenav-signout">
            <ArrowLeftStartOnRectangleIcon className="w-4 h-4 shrink-0" />
            <span className="sidenav-label">Sign Out</span>
          </button>
        </form>
      </aside>
    </>
  );
}

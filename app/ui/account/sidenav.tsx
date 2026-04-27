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
        :root {
          --navbar-height: 64px;
        }

        .sidenav {
          font-family: 'Sora', sans-serif;
          top: var(--navbar-height);
          left: 0;
          height: calc(100vh - var(--navbar-height));
          width: ${collapsed ? "72px" : "220px"};
          padding: 1rem;
          display: flex;
          flex-direction: column;
          transition: width 0.25s ease;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 10px;
          padding: 0.4rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }

        .toggle-btn:hover {
          background: #1a1d27;
        }

        .sidenav-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;

          background: #13151c;
          border: 1px solid #2a2d3a;
          border-radius: 14px;
          padding: 0.5rem;
        }

        .sidenav-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.6rem;
          border-radius: 10px;
          font-size: 0.875rem;
          color: #6b7091;
          text-decoration: none;
          transition: all 0.2s;
        }

        .sidenav-link:hover {
          color: #e8eaf2;
          background: #1a1d27;
        }

        .sidenav-link.active {
          color: #e8eaf2;
          background: linear-gradient(
            135deg,
            rgba(124,109,250,.2),
            rgba(91,156,246,.15)
          );
          border: 1px solid rgba(124,109,250,.25);
        }

        .sidenav-link.admin {
          color: #f6c177;
        }

        .sidenav-link.admin.active {
          border-color: rgba(246, 193, 119, 0.4);
        }

        .label {
          white-space: nowrap;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

        .signout-wrap {
          margin-top: auto;
        }

        .signout-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 0.6rem;
          border-radius: 10px;
          background: #13151c;
          border: 1px solid #2a2d3a;
          color: #6b7091;
          transition: all 0.2s;
        }

        .signout-btn:hover {
          color: #e8eaf2;
          background: #1a1d27;
        }
      `}</style>

      <aside className="sidenav">
        {/* collapse toggle */}
        <button
          className="toggle-btn"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          <Bars3Icon className="w-5" />
        </button>

        {/* centered links */}
        <div className="sidenav-panel">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx("sidenav-link", { active: isActive })}
              >
                <Icon className="w-5 shrink-0" />
                <span className="label">{link.name}</span>
              </Link>
            );
          })}

          {isAdmin &&
            adminLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx("sidenav-link admin", {
                    active: isActive,
                  })}
                >
                  <Icon className="w-5 shrink-0" />
                  <span className="label">{link.name}</span>
                </Link>
              );
            })}
        </div>

        {/* bottom sign out */}
        <form className="signout-wrap" action={handleSignOut}>
          <button className="signout-btn">
            <ArrowLeftStartOnRectangleIcon className="w-5 shrink-0" />
            <span className="label">Sign Out</span>
          </button>
        </form>
      </aside>
    </>
  );
}

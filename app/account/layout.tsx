import { Metadata } from 'next';

import SideNav from '@/app/ui/account/sidenav';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "Your posts",
  description: "View your GhostNet posts.",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = session?.user?.role;
  const isAdmin = role === "admin";

  return (
    <>
      <style>{`
        .account-layout {
          display: flex;
          min-height: 100vh;
        }
        .account-sidebar-offset {
          /* matches sidenav expanded width */
          width: 220px;
          flex-shrink: 0;
          transition: width 0.25s ease;
        }
        .account-content {
          flex: 1;
          min-width: 0;
          padding: 2rem;
        }
      `}</style>

      <div className="account-layout">
        <SideNav isAdmin={isAdmin} />
        {/* Spacer div that mirrors the fixed sidenav width */}
        <div className="account-sidebar-offset" />
        <main className="account-content">{children}</main>
      </div>
    </>
  );
}

import SideNav from "@/app/ui/account/sidenav";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const role = session?.user?.role;
  let isAdmin = false;
  if (role === "admin") isAdmin = true;
  return (
    <main className="flex w-screen">
      <SideNav isAdmin={isAdmin} />
      {children}
    </main>
  );
}

import SideNav from "../ui/account/side-nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SideNav />
      {children}
    </>
  );
}

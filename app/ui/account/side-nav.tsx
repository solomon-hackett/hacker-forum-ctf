import Link from "next/link";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

const links = [
  {
    href: "/account",
    name: "Personal Info",
  },
  {
    href: "/account/posts",
    name: "Your Posts",
  },
];

export default function SideNav() {
  return (
    <nav className="hidden sm:flex items-center gap-6 bg-base-surface/60 shadow-glow-green/20 backdrop-blur-sm px-5 py-2 rounded-xl w-fit h-full">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col bg-base-surface">
          {links.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="bg-base-surface">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </nav>
  );
}

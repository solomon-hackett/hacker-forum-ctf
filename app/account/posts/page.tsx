import Link from "next/link";

import UserPosts from "@/app/ui/account/user-posts";
import PageHeading from "@/app/ui/page-heading";
import { auth } from "@/auth";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  const session = await auth();
  const id = session?.user?.id;
  const role = session?.user?.role;
  const isAdmin = role === "admin";
  return (
    <div>
      <PageHeading heading="Your posts" />
      {!isAdmin && (
        <Link href="/posts/create" className="flex items-center">
          <PlusCircleIcon className="w-5 h-5" />
          Create Post
        </Link>
      )}
      <UserPosts id={id} />
    </div>
  );
}

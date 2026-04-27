import { Metadata } from "next";
import Link from "next/link";

import NewPostsCarousel from "../ui/home/new-posts";
import PageHeading from "../ui/page-heading";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center px-10">
      <PageHeading heading="Welcome to GhostNet" />
      <NewPostsCarousel />
      <Link href="/posts">View More</Link>
      <div
        id="comments"
        dangerouslySetInnerHTML={{
          __html:
            "<!-- Dev comment: flag1{K7mR2pX9nQ} the admin account has a weak password, we should probably change that. We currently don't sanitise the private posts, should probably fix that, additionally, they are displayed without being escaped on the user's page. !IMPORTANT: remove before deployment! Use /api/env to get the environment variables. -->",
        }}
      />
    </main>
  );
}

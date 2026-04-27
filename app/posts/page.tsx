import { Metadata } from "next";

import PageHeading from "@/app/ui/page-heading";
import PostGrid from "@/app/ui/posts/post-grid";

export const metadata: Metadata = {
  title: "Posts",
  description: "View the posts on the GhostNet dark web hacker forum.",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <PageHeading heading="Posts" />
      <PostGrid />
    </main>
  );
}

import { Metadata } from "next";
import PostGrid from "@/app/ui/posts/post-grid";

export const metadata: Metadata = {
  title: "Posts",
  description: "View the posts on the GhostNet dark web hacker forum.",
};

export default function Page() {
  return (
    <main>
      <PostGrid />
    </main>
  );
}

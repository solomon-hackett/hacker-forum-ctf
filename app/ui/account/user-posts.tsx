import { fetchUserPosts } from "@/app/lib/data";

import PostGrid from "./post-grid";

export default async function UserPosts({
  id,
  isAdmin,
}: {
  id: string;
  isAdmin: boolean;
}) {
  const posts = await fetchUserPosts(id);
  return <PostGrid posts={posts} isAdmin={isAdmin} />;
}

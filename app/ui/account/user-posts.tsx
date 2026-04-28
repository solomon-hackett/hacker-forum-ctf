import { fetchUserPosts } from "@/app/lib/data";
import PostGrid from "@/app/ui/account/post-grid";

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

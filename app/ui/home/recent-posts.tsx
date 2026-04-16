"use server";

import { fetchRecentPosts } from "@/app/lib/data";
import Carousel from "@/app/ui/carousel";

export default async function RecentPosts() {
  const posts = await fetchRecentPosts();
  return <Carousel title="Recent Posts" items={posts} />;
}

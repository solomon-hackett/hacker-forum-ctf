import { fetchNewPosts } from "@/app/lib/data";

import Carousel from "../post-carousel";

export default async function NewPostsCarousel() {
  const posts = await fetchNewPosts();
  return <Carousel posts={posts} />;
}

import { fetchFilteredPosts } from "@/app/lib/data";
import Link from "next/link";

export default async function PostGrid({
  query,
  sort,
  currentPage,
}: {
  query: string;
  sort: string;
  currentPage: number;
}) {
  const posts = await fetchFilteredPosts(query, sort, currentPage);
  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-10 w-full">
      {posts.map((post) => (
        <article
          className="group flex flex-col bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-72 h-80 transition-all hover:-translate-y-0.5 duration-200 snap-start shrink-0"
          key={post.id}
        >
          <h1 className="font-semibold text-primary line-clamp-2 leading-snug">
            {post.title}
          </h1>
          <h2 className="mt-1 font-medium text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-wide">
            {post.author}
          </h2>
          <p className="flex-1 mt-3 text-neutral-600 dark:text-neutral-400 text-sm line-clamp-4 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex justify-between items-center mt-4">
            <Link
              href={`/posts/${post.id}`}
              className="group/link inline-flex items-center gap-1 font-medium text-blue-500 hover:text-blue-600 text-sm transition-colors"
            >
              Read more
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform translate-x-0 group-hover/link:translate-x-0.5"
              >
                <path
                  d="M3 7h8M8 4l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <time className="text-neutral-400 dark:text-neutral-500 text-xs">
              {post.created_at}
            </time>
          </div>
        </article>
      ))}
    </div>
  );
}

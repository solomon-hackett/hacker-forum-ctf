import Search from "@/app/ui/search";
import { Suspense } from "react";
import PostGrid from "@/app/ui/posts/post-grid";
import SortDropdown from "@/app/ui/posts/sort-dropdown";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { PostGridSkeleton } from "@/app/ui/skeletons";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <main className="flex flex-col justify-center items-center px-4 sm:px-10">
      <div className="flex flex-col w-full max-w-400">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Search />
            <SortDropdown />
          </div>
          <Link
            href="/posts/create"
            className="flex justify-center items-center gap-1.5 hover:bg-neon-green hover:shadow-glow-green px-3 py-2 border border-neon-green rounded-md w-full sm:w-auto font-mono text-neon-green text-sm hover:text-base whitespace-nowrap transition-all duration-200"
          >
            <PlusCircleIcon className="w-4 h-4" />
            Create Post
          </Link>
        </div>
        <Suspense
          key={query + sort + currentPage}
          fallback={<PostGridSkeleton />}
        >
          <PostGrid query={query} sort={sort} currentPage={currentPage} />
        </Suspense>
      </div>
    </main>
  );
}

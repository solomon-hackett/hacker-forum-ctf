import { Metadata } from "next";
import PageHeading from "../ui/page-heading";
import RecentPosts from "../ui/home/recent-posts";
import { Suspense } from "react";
import { CarouselSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center px-10">
      <PageHeading title="GhostNet" />
      <Suspense fallback={<CarouselSkeleton />}>
        <RecentPosts />
      </Suspense>
    </main>
  );
}

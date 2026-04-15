import { Metadata } from "next";
import PageHeading from "../ui/PageHeading";
import RecentPosts from "../ui/home/recent-posts";
import { Suspense } from "react";
import { CarouselSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <PageHeading title="GhostNet" />
      <Suspense fallback={<CarouselSkeleton />}>
        <RecentPosts />
      </Suspense>
    </main>
  );
}

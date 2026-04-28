import { Metadata } from "next";
import { Suspense } from "react";

import Form from "@/app/ui/posts/create-form";
import { CreateSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Create a Post",
  description: "Create a post on GhostNet",
};

export default async function Page(props: {
  searchParams?: Promise<{
    redirect?: string;
  }>;
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const id = session?.user?.id;
  const redirect = searchParams?.redirect || "/posts";

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 1rem",
        background: "#0d0f14",
      }}
    >
      <Suspense fallback={<CreateSkeleton />}>
        <Form id={id} redirect={redirect} />
      </Suspense>
    </main>
  );
}

import { Suspense } from "react";

import PostPage from "@/app/ui/posts/post";
import { auth } from "@/auth";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const session = await auth();
  const id = params.id;
  const redirect = searchParams.redirect ?? "/posts";
  const userId = session?.user?.id;
  console.log(id);
  return (
    <main>
      <Suspense>
        <PostPage id={id} author={userId} redirect={redirect} />
      </Suspense>
    </main>
  );
}

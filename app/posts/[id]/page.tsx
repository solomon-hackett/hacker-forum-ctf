import { Suspense } from "react";

import PostPage from "@/app/ui/posts/post";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  console.log(id);
  return (
    <main>
      <Suspense>
        <PostPage id={id} />
      </Suspense>
    </main>
  );
}

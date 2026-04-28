import { Suspense } from "react";

import Edit from "@/app/ui/posts/edit";
import { EditSkeleton } from "@/app/ui/skeletons";
import { auth } from "@/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const params = await props.params;
  const userId = session?.user?.id;
  const id = params.id;

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
      <Suspense fallback={<EditSkeleton />}>
        <Edit id={id} userId={userId} />
      </Suspense>
    </main>
  );
}

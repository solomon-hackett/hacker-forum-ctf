import { fetchPostById } from "@/app/lib/data";

import EditForm from "./edit-form";

export default async function Edit({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const post = await fetchPostById(id);
  console.log(post.public);
  return (
    <EditForm
      id={post.id}
      authorId={userId ?? ""}
      currentTitle={post.title}
      currentContent={post.content}
      isPublic={post.public}
    />
  );
}

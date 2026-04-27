import { createPost } from "@/app/lib/actions";

export default function CreateForm() {
  return <form action={createPost}></form>;
}

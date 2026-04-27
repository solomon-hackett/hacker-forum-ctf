import PageHeading from "@/app/ui/page-heading";
import Form from "@/app/ui/posts/create-form";

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <PageHeading heading="Create a Post" />
      <Form />
    </main>
  );
}

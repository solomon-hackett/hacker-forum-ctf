import PageHeading from "@/app/ui/page-heading";
import Form from "@/app/ui/posts/create-form";
import { auth } from "@/auth";

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
    <main className="flex flex-col justify-center items-center">
      <PageHeading heading="Create a Post" />
      <h2>
        All posts are reviwed by an auto-mod before being approved for the site,
        please be patient.
      </h2>
      <Form id={id} redirect={redirect} />
    </main>
  );
}

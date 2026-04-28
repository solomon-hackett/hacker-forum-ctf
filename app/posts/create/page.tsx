import { Metadata } from 'next';

import Form from '@/app/ui/posts/create-form';
import { auth } from '@/auth';

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
    <main className="flex flex-col justify-center items-center">
      <Form id={id} redirect={redirect} />
    </main>
  );
}

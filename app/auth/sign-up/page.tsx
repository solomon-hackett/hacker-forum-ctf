import { Metadata } from 'next';

import Form from '@/app/ui/auth/sign-up-form';

export const metadata: Metadata = {
  title: "Sign Up",
};
export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <Form />
    </main>
  );
}

import { Metadata } from 'next';
import { Suspense } from 'react';

import Form from '@/app/ui/auth/login-form';

export const metadata: Metadata = {
  title: "Log In",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <Suspense>
        <Form />
      </Suspense>
    </main>
  );
}

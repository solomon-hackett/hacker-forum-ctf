import { Suspense } from "react";

import LoginForm from "@/app/ui/auth/login-form";

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

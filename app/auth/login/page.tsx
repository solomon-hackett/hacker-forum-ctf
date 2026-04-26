import { Suspense } from "react";

import LoginForm from "@/app/ui/auth/login-form";

export default function Page() {
  return (
    <main>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

import LoginForm from "@/app/ui/auth/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <main>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

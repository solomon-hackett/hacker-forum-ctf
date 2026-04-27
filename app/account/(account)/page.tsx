import { Suspense } from "react";

import UserInfo from "@/app/ui/account/user-info";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <div>
      {userId && (
        <Suspense>
          <UserInfo id={userId} />
        </Suspense>
      )}
    </div>
  );
}

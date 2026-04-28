import { Metadata } from 'next';
import { Suspense } from 'react';

import UserInfo from '@/app/ui/account/user-info';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "Account",
  description: "View your GhostNet account.",
};

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

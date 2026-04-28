import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();

  const unlocked = cookieStore.get("paywall_unlocked")?.value === "true";

  return (
    <main className="relative min-h-screen">
      <div className={unlocked ? "" : "blur-lg"}>
        <h1>Upcoming Paid Feature</h1>
        <p>FLAG&#123;a8Kp3VtM6s&#125;</p>
      </div>

      {!unlocked && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
          <div className="bg-base-surface shadow-lg p-6 rounded-lg text-center">
            <h1 className="font-bold text-xl text-content-danger">
              You must pay to use this feature
            </h1>
          </div>
        </div>
      )}
    </main>
  );
}

import { fetchUserById } from "@/app/lib/data";

export default async function UserInfo({ id }: { id: string }) {
  const user = await fetchUserById(id);

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-2xl">{user.username}</h1>

      <div className="p-4 border rounded-md">
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>

        {user.role === "admin" && (
          <>
            <p className="text-red-500">You have elevated privileges.</p>
          </>
        )}
      </div>
    </div>
  );
}

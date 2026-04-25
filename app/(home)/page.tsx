import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center px-10">
      <div
        id="comments"
        dangerouslySetInnerHTML={{
          __html:
            "<!-- Dev comment: flag1{K7mR2pX9nQ} the admin account has a weak password, we should probably change that. We currently don't sanitise the private posts, should probably fix that, additionally, they are displayed without being escaped on the user's page. -->",
        }}
      />
    </main>
  );
}

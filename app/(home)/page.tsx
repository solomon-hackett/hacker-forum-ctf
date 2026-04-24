import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center px-10">
      <div
        dangerouslySetInnerHTML={{
          __html:
            "<!-- Dev comment: flag1{K7mR2pX9nQ} the admin account has a weak password, we should probably change that. -->",
        }}
      />
    </main>
  );
}

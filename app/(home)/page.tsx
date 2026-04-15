import { Metadata } from "next";
import PageHeading from "../ui/PageHeading";

export const metadata: Metadata = {
  title: "Home",
};

export default function Page() {
  return (
    <main>
      <PageHeading title="GhostNet" />
    </main>
  );
}

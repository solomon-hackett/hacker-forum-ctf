import { fetchInReview } from "@/app/lib/data";

export default async function Page() {
  const toReview = await fetchInReview();
  return (
    <main>
      {toReview.map((post) => (
        <div key={post.id} className="post" data-id={post.id}>
          <p
            className="post-title"
            dangerouslySetInnerHTML={{ __html: post.title }}
          ></p>
          <p
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
        </div>
      ))}
    </main>
  );
}

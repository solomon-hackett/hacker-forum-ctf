import { fetchPosts } from "@/app/lib/data";

export default async function PostGrid() {
  const posts = await fetchPosts();
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <h3>
            {post.author_role}
            {post.author_username}
          </h3>
          <p>{post.content}</p>
          <p>{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

import postgres from "postgres";
import { Post } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchPosts() {
  const data = await sql<Post[]>`SELECT 
  posts.id,
  posts.title,
  posts.content,
  posts.created_at,
  users.username AS author_username,
  users.role AS author_role
FROM posts
JOIN users ON posts.author = users.id
ORDER BY posts.created_at DESC;`;
  return data;
}

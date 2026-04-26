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
  WHERE in_review = false and public = true
  ORDER BY posts.created_at DESC;`;
  return data;
}

export async function fetchPostById(id: number) {
  const data = await sql<Post[]>`SELECT 
  posts.id,
  posts.title,
  posts.content,
  posts.created_at,
  users.username AS author_username,
  users.role AS author_role
  FROM posts
  JOIN users ON posts.author = users.id
  WHERE id = ${id};`;
  return data[0];
}

export async function fetchInReview() {
  console.log("RUNNING QUERY", new Date().toISOString());
  const data = await sql<
    Post[]
  >`SELECT posts.id, posts.title, posts.content FROM posts WHERE in_review = true`;
  return data;
}

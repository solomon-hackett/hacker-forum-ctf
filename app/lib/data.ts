import postgres from "postgres";

import { Notification, Post, User } from "./definitions";
import { generatePrettyDate } from "./utils";

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
  const posts = data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
  return posts;
}

export async function fetchUserPosts(id: string) {
  const data = await sql<Post[]>`SELECT 
  posts.id,
  posts.title,
  posts.content,
  posts.created_at,
  posts.public,
  posts.successful_xss,
  users.username AS author_username,
  users.role AS author_role
  FROM posts
  JOIN users ON posts.author = users.id
  WHERE posts.author = ${id} AND posts.in_review = false;`;
  const posts = data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
  return posts;
}

export async function fetchPostById(id: string) {
  const data = await sql<Post[]>`SELECT 
  posts.id,
  posts.title,
  posts.content,
  posts.created_at,
  users.username AS author_username,
  users.role AS author_role
  FROM posts
  JOIN users ON posts.author = users.id
  WHERE posts.id = ${id};`;
  return {
    ...data[0],
    created_at: generatePrettyDate(data[0].created_at),
  };
}

export async function fetchNewPosts() {
  const data = await sql<Post[]>`SELECT 
  posts.id,
  posts.title,
  posts.content,
  posts.created_at,
  users.username AS author_username,
  users.role AS author_role
  FROM posts
  JOIN users ON posts.author = users.id
  WHERE posts.id != 71
  ORDER BY created_at DESC
  LIMIT 10;`;
  const posts = data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
  return posts;
}

export async function fetchInReview() {
  const data = await sql<
    Post[]
  >`SELECT posts.id, posts.title, posts.content FROM posts WHERE in_review = true`;
  return data;
}

export async function fetchUserById(id: string) {
  const data = await sql<User[]>`SELECT * FROM users WHERE users.id = ${id}`;
  return data[0];
}

export async function fetchNotifications(id: string, role: string) {
  const data = await sql<Notification[]>`
    SELECT *
    FROM notifications
    WHERE notifications.user_id = ${id}
    AND (
      ${role} = 'admin'
      OR notifications.is_read = false
      OR notifications.created_at >= NOW() - INTERVAL '3 weeks'
    )
    ORDER BY notifications.created_at DESC;
  `;

  const notifications = data.map((n) => ({
    ...n,
    created_at: generatePrettyDate(n.created_at),
  }));

  return notifications;
}

import postgres from "postgres";

import { Notification, Post, User } from "./definitions";
import { generatePrettyDate } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 12;

const SORT_CLAUSES = {
  "title-asc": sql`ORDER BY posts.title ASC`,
  "title-desc": sql`ORDER BY posts.title DESC`,
  "date-asc": sql`ORDER BY posts.created_at ASC`,
  "date-desc": sql`ORDER BY posts.created_at DESC`,
} as const;

type SortKey = keyof typeof SORT_CLAUSES;

const privFlagPost: Post = {
  id: 0,
  title: "flag3{Y7hR2cN9Qx}",
  content: "testing private posts",
  created_at: "1 year ago",
  author: "0f630aca-c35d-44da-aa47-8d9ac0c095a1",
  author_username: "admin",
  author_role: "admin",
  in_review: false,
  public: false,
  successful_xss: false,
};

const paginationFlagPost: Post = {
  id: 0,
  title: "flag4{Y7hR2cN9Qx}",
  content:
    "this post is kind of glitched and shows up on page -1 for some reason",
  created_at: "1 year ago",
  author: "0f630aca-c35d-44da-aa47-8d9ac0c095a1",
  author_username: "admin",
  author_role: "admin",
  in_review: false,
  public: false,
  successful_xss: false,
};

export async function fetchFilteredPosts(
  query: string,
  sort: string,
  priv: number,
  currentPage: number,
) {
  if (currentPage === -1) {
    return [paginationFlagPost];
  }

  const orderBy =
    SORT_CLAUSES[(sort in SORT_CLAUSES ? sort : "title-asc") as SortKey];
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const q = `%${query}%`;
  const data = await sql<Post[]>`
    SELECT 
      posts.id,
      posts.title,
      posts.content,
      posts.created_at,
      users.username AS author_username,
      users.role AS author_role
    FROM posts
    JOIN users ON posts.author = users.id
    WHERE in_review = false 
      AND public = true 
      AND (
        posts.title ILIKE ${q} OR
        posts.content ILIKE ${q} OR
        users.username ILIKE ${q} OR 
        users.role ILIKE ${q} OR
        posts.created_at::text ILIKE ${q}
      )
    ${orderBy}
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
  `;
  const posts = data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
  if (priv === 1) {
    posts.push(privFlagPost);
  }
  return posts;
}

export async function fetchPostsPages(query: string) {
  const q = `%${query}%`;

  const data = await sql`
    SELECT 
      COUNT(*)
    FROM posts
    JOIN users ON posts.author = users.id
    WHERE in_review = false 
      AND public = true 
      AND (
        posts.title ILIKE ${q} OR
        posts.content ILIKE ${q} OR
        users.username ILIKE ${q} OR 
        users.role ILIKE ${q} OR
        posts.created_at::text ILIKE ${q}
      )
  `;
  const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  return totalPages;
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
  posts.public,
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
  WHERE posts.id != 71 AND posts.public = true
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

export async function fetchNotifications(id: string) {
  const data = await sql<Notification[]>`
    SELECT notifications.*
    FROM notifications
    JOIN users ON users.id = notifications.user_id
    WHERE notifications.user_id = ${id}
    AND (
      users.role = 'admin'
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

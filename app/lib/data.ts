import postgres from "postgres";
import { Post } from "./definitions";
import { timeAgo } from "./utils";
import { truncate } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 15;
const ALLOWED_SORTS: Record<string, { column: string; direction: string }> = {
  "title-asc": { column: "title", direction: "ASC" },
  "title-desc": { column: "title", direction: "DESC" },
  "author-asc": { column: "author", direction: "ASC" },
  "author-desc": { column: "author", direction: "DESC" },
  "created_at-asc": { column: "created_at", direction: "ASC" },
  "created_at-desc": { column: "created_at", direction: "DESC" },
};

export async function fetchRecentPosts() {
  try {
    const data = await sql<
      Post[]
    >`SELECT * FROM posts WHERE id NOT IN (31) ORDER BY created_at DESC LIMIT 10;`;
    const posts = data.map((post) => ({
      ...post,
      created_at: timeAgo(post.created_at),
      excerpt: truncate(post.content, 150),
    }));
    return posts;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch recent posts, please try again later.");
  }
}

export async function fetchFilteredPosts(
  query: string,
  sort: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const { column, direction } =
    ALLOWED_SORTS[sort] ?? ALLOWED_SORTS["created_at-desc"];
  try {
    const data = await sql<Post[]>`
  SELECT * FROM posts
  WHERE title ILIKE ${`%${query}%`}
     OR content ILIKE ${`%${query}%`}
     OR author ILIKE ${`%${query}%`}
     OR created_at::text ILIKE ${`%${query}%`}
  ORDER BY ${sql.unsafe(column)} ${sql.unsafe(direction)}
  LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;

    const posts = data.map((post) => ({
      ...post,
      created_at: timeAgo(post.created_at),
      excerpt: truncate(post.content, 150),
    }));
    return posts;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch posts, please try again later.");
  }
}

export async function fetchPostById({ id }: { id: string }) {
  try {
    const data = await sql<
      Post[]
    >`SELECT id, title, author, content FROM posts WHERE id=${id}`;
    return data[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch post, please try again later.");
  }
}

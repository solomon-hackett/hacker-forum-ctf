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

// The real SELECT returns 6 columns:
// posts.id, posts.title, posts.content, posts.created_at, author_username, author_role
const REQUIRED_COLUMNS = 6;

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

const FAKE_USERS = [
  {
    id: 1,
    username: "admin",
    password: "flag5{H2cZ7mF6uB}",
    role: "admin",
  },
  {
    id: 2,
    username: "john_doe",
    password: "hunter2",
    role: "member",
  },
  {
    id: 3,
    username: "jane_smith",
    password: "p@ssw0rd",
    role: "moderator",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip SQL comments from a fragment.
 * Supports:
 *   --     single-line (PostgreSQL / standard SQL)
 *   /* *\/  block comment (PostgreSQL / standard SQL)
 *   #      single-line (MySQL — included for CTF leniency)
 */
function stripComments(sql: string): string {
  return sql
    .replace(/#.*/g, "")
    .replace(/--[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .trim();
}

/**
 * Count how many columns are in the SELECT list of a raw SQL fragment.
 * Only looks at the first SELECT … FROM block; ignores nested parens.
 * Comments are stripped before counting.
 */
function countSelectedColumns(query: string): number | null {
  const stripped = stripComments(query);
  const match = stripped.match(/select(.+?)from/i);
  if (!match) return null;
  const cols = match[1].trim();
  const parts = cols.split(/,(?![^(]*\))/);
  return parts.filter((p) => p.trim().length > 0).length;
}

/**
 * Split the raw user input on the FIRST apostrophe.
 *
 * - No apostrophe → whole string is the normal search query, injectedSql is "".
 * - Apostrophe present → everything before it is the normal search query,
 *   everything after is treated as injected SQL.
 *
 * Example:
 *   "hello' UNION SELECT 1,2,3,4,5,6 FROM users-- -"
 *   → normalQuery = "hello"
 *   → injectedSql = " UNION SELECT 1,2,3,4,5,6 FROM users-- -"
 */
function splitOnApostrophe(rawInput: string): {
  normalQuery: string;
  injectedSql: string;
  hasApostrophe: boolean;
} {
  const idx = rawInput.indexOf("'");
  if (idx === -1) {
    return { normalQuery: rawInput, injectedSql: "", hasApostrophe: false };
  }
  return {
    normalQuery: rawInput.slice(0, idx),
    injectedSql: rawInput.slice(idx + 1),
    hasApostrophe: true,
  };
}

/**
 * Given the SQL fragment that follows the apostrophe, simulate the PostgreSQL
 * error that would actually be returned, or null if the fragment looks valid.
 */
function getSimulatedSqlError(
  normalQuery: string,
  injectedSql: string,
): string | null {
  const stripped = stripComments(injectedSql);
  const q = stripped.toLowerCase().replace(/\s+/g, " ").trim();

  const ilikeLine = `posts.title ILIKE '%${normalQuery}'`;

  // -------------------------------------------------------------------------
  // 1. Second bare apostrophe inside the injected fragment → unterminated
  //    quoted string.
  // -------------------------------------------------------------------------
  if (injectedSql.includes("'")) {
    const afterSecond = injectedSql.slice(injectedSql.indexOf("'") + 1);
    return (
      `ERROR:  unterminated quoted string at or near "'${afterSecond.slice(0, 20)}"\n` +
      `LINE 1: ${ilikeLine}${injectedSql.slice(0, 40)}\n` +
      `        ${"^".padStart(ilikeLine.length + 2)}`
    );
  }

  // -------------------------------------------------------------------------
  // 2. Nothing left after stripping comments → valid closed string + comment.
  // -------------------------------------------------------------------------
  if (q === "") {
    return null;
  }

  // -------------------------------------------------------------------------
  // 3. UNION without SELECT
  // -------------------------------------------------------------------------
  if (/\bunion\b/.test(q) && !/\bselect\b/.test(q)) {
    return (
      `ERROR:  syntax error at or near "UNION"\n` +
      `LINE 1: ${ilikeLine} UNION\n` +
      `        ${"^".padStart(ilikeLine.length + 7)}`
    );
  }

  // -------------------------------------------------------------------------
  // 4. UNION SELECT without FROM
  // -------------------------------------------------------------------------
  if (/\bunion\b/.test(q) && /\bselect\b/.test(q) && !/\bfrom\b/.test(q)) {
    const colMatch = stripped.match(/select(.+)/i);
    const cols = colMatch ? colMatch[1].trim().slice(0, 40) : "...";
    return (
      `ERROR:  syntax error at or near "SELECT"\n` +
      `DETAIL: Each UNION query must have a FROM clause.\n` +
      `LINE 1: ${ilikeLine} UNION SELECT ${cols}\n` +
      `        ${"^".padStart(ilikeLine.length + 14)}`
    );
  }

  // -------------------------------------------------------------------------
  // 5. UNION SELECT … FROM … — check column count and table/column validity
  // -------------------------------------------------------------------------
  if (/\bunion\b/.test(q) && /\bselect\b/.test(q) && /\bfrom\b/.test(q)) {
    const colCount = countSelectedColumns(injectedSql);
    const colMatch = stripped.match(/select(.+?)from/i);
    const cols = colMatch ? colMatch[1].trim().slice(0, 60) : "...";

    // 5a. Wrong column count
    if (colCount !== null && colCount !== REQUIRED_COLUMNS) {
      return (
        `ERROR:  each UNION query must have the same number of columns\n` +
        `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ...\n` +
        `        ${"^".padStart(ilikeLine.length + 7)}`
      );
    }

    // 5b. Unknown table
    const tableMatch = stripped.match(/from\s+(\w+)/i);
    const table = tableMatch ? tableMatch[1].toLowerCase() : "";
    const knownTables = ["users", "posts", "notifications"];
    if (table && !knownTables.includes(table)) {
      return (
        `ERROR:  relation "${table}" does not exist\n` +
        `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ${table}\n` +
        `        ${"^".padStart(ilikeLine.length + 7 + cols.length + 6 + table.length)}`
      );
    }

    // 5c. Named columns that don't exist on users
    const selectBody = colMatch ? colMatch[1] : "";
    const hasOnlyLiterals = /^[\d\s,null']+$/i.test(selectBody);
    if (!hasOnlyLiterals && table === "users") {
      const colNames = selectBody
        .split(/,(?![^(]*\))/)
        .map((c) => c.trim().split(/\s+/)[0].toLowerCase());
      const validUserCols = [
        "id",
        "username",
        "password",
        "role",
        "email",
        "created_at",
        "null",
      ];
      const badCol = colNames.find(
        (c) => c && !/^\d+$/.test(c) && !validUserCols.includes(c),
      );
      if (badCol) {
        return (
          `ERROR:  column "${badCol}" does not exist\n` +
          `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ${table}\n` +
          `        ${"^".padStart(ilikeLine.length + 15 + cols.indexOf(badCol))}`
        );
      }
    }

    // 5d. Type mismatch for non-users/posts tables
    if (table && table !== "users" && table !== "posts") {
      return (
        `ERROR:  UNION types text and integer cannot be matched\n` +
        `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ${table}\n` +
        `        ${"^".padStart(ilikeLine.length + 7)}`
      );
    }

    // 5e. Everything looks valid → no error
    return null;
  }

  // -------------------------------------------------------------------------
  // 6. Miscellaneous errors
  // -------------------------------------------------------------------------

  // DROP / DELETE / INSERT / UPDATE → permission denied
  if (/\b(drop|delete|insert|update|truncate|alter|create)\b/.test(q)) {
    const kw = q.match(
      /\b(drop|delete|insert|update|truncate|alter|create)\b/,
    )![1];
    return (
      `ERROR:  permission denied for table ${["insert", "update", "delete"].includes(kw) ? "posts" : "unknown"}\n` +
      `DETAIL: The current user does not have ${kw.toUpperCase()} privileges.`
    );
  }

  // Stray semicolon → multiple statements not allowed
  if (stripped.includes(";")) {
    return (
      `ERROR:  cannot insert multiple commands into a prepared statement\n` +
      `LINE 1: ${ilikeLine}${stripped.slice(0, 30)};\n` +
      `        ${"^".padStart(ilikeLine.length + stripped.indexOf(";") + 2)}`
    );
  }

  // Unmatched parenthesis
  const openParens = (stripped.match(/\(/g) || []).length;
  const closeParens = (stripped.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return (
      `ERROR:  syntax error at or near "${openParens > closeParens ? "(" : ")"}"\n` +
      `LINE 1: ${ilikeLine}${stripped.slice(0, 40)}\n` +
      `        ${"^".padStart(ilikeLine.length + 2)}`
    );
  }

  // Generic syntax fallback for unrecognised continuations
  const firstKeyword = q.match(/^(\w+)/)?.[1] ?? "";
  const validContinuations = [
    "and",
    "or",
    "order",
    "limit",
    "offset",
    "group",
    "having",
    "union",
    "intersect",
    "except",
  ];
  if (firstKeyword && !validContinuations.includes(firstKeyword)) {
    return (
      `ERROR:  syntax error at or near "${firstKeyword}"\n` +
      `LINE 1: ${ilikeLine}${stripped.slice(0, 40)}\n` +
      `        ${"^".padStart(ilikeLine.length + 2)}`
    );
  }

  return null;
}

/**
 * Returns true only when the injected SQL contains a complete UNION SELECT
 * with exactly REQUIRED_COLUMNS columns targeting the users table.
 * Comments (including #) are stripped before checking.
 */
function isCompletedUnionSelectAttempt(injectedSql: string): boolean {
  const q = stripComments(injectedSql).toLowerCase().replace(/\s+/g, " ");
  if (
    !q.includes("union") ||
    !q.includes("select") ||
    !q.includes("from") ||
    !q.includes("users")
  ) {
    return false;
  }
  const colCount = countSelectedColumns(injectedSql);
  return colCount === REQUIRED_COLUMNS;
}

// ---------------------------------------------------------------------------
// Public data-fetching functions
// ---------------------------------------------------------------------------

export async function fetchFilteredPosts(
  rawQuery: string,
  sort: string,
  priv: number,
  currentPage: number,
) {
  if (currentPage === -1) {
    return [paginationFlagPost];
  }

  const { normalQuery, injectedSql, hasApostrophe } =
    splitOnApostrophe(rawQuery);

  // ------------------------------------------------------------------
  // No apostrophe → plain search, no injection simulation.
  // ------------------------------------------------------------------
  if (!hasApostrophe) {
    const posts = await fetchNormalPosts(rawQuery, sort, currentPage);
    if (priv === 1) posts.push(privFlagPost);
    return posts;
  }

  // ------------------------------------------------------------------
  // Apostrophe present → simulate injected SQL path.
  // ------------------------------------------------------------------

  // Successful UNION injection
  if (isCompletedUnionSelectAttempt(injectedSql)) {
    const posts = await fetchNormalPosts(normalQuery, sort, currentPage);
    const leakedRows: Post[] = FAKE_USERS.map((u) => ({
      id: 0,
      title: `${u.username}`,
      content: `${u.password}`,
      created_at: `4`,
      author: "",
      author_username: "5",
      author_role: "6",
      in_review: false,
      public: true,
      successful_xss: false,
    }));
    return [...posts, ...leakedRows];
  }

  // Malformed injection → throw a simulated SQL error
  const sqlError = getSimulatedSqlError(normalQuery, injectedSql);
  if (sqlError) {
    throw new Error(sqlError);
  }

  // Valid-looking but non-exploiting injection (e.g. ' AND 1=1-- -)
  // Run the query using only the part before the apostrophe.
  const posts = await fetchNormalPosts(normalQuery, sort, currentPage);
  if (priv === 1) posts.push(privFlagPost);
  return posts;
}

async function fetchNormalPosts(
  query: string,
  sort: string,
  currentPage: number,
): Promise<Post[]> {
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
  return data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
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
  const data = await sql<Post[]>`
    SELECT 
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
    WHERE posts.author = ${id} AND posts.in_review = false;
  `;
  return data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
}

export async function fetchPostById(id: string) {
  const data = await sql<Post[]>`
    SELECT 
      posts.id,
      posts.title,
      posts.content,
      posts.created_at,
      posts.public,
      posts.author,
      users.username AS author_username,
      users.role AS author_role
    FROM posts
    JOIN users ON posts.author = users.id
    WHERE posts.id = ${id};
  `;
  return {
    ...data[0],
    created_at: generatePrettyDate(data[0].created_at),
  };
}

export async function fetchNewPosts() {
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
    WHERE posts.id != 71 AND posts.public = true
    ORDER BY created_at DESC
    LIMIT 10;
  `;
  return data.map((post) => ({
    ...post,
    created_at: generatePrettyDate(post.created_at),
  }));
}

export async function fetchInReview() {
  const data = await sql<Post[]>`
    SELECT posts.id, posts.title, posts.content 
    FROM posts 
    WHERE in_review = true
  `;
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
  return data.map((n) => ({
    ...n,
    created_at: generatePrettyDate(n.created_at),
  }));
}

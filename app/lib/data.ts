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
 *
 * Supported comment styles (MySQL + PostgreSQL union for CTF leniency):
 *   --           end-of-line, with or without trailing space/chars (PostgreSQL/standard)
 *   -- -         common SQLi terminator variant
 *   #            end-of-line (MySQL)
 *   /* ... *\/   block comment, including the /*!...*\/ MySQL variant (both dbs)
 *
 * Note: bare `#` is a URL fragment delimiter and will never reach the server
 * from a browser address bar — players must URL-encode it as %23.  We handle
 * it here so curl / programmatic attempts also work.
 */
function stripComments(raw: string): string {
  return (
    raw
      // block comments (including MySQL /*!...*\/ optimizer hints)
      .replace(/\/\*!?[\s\S]*?\*\//g, "")
      // MySQL # single-line (also catches %23-decoded versions)
      .replace(/#.*/g, "")
      // standard -- single-line: match -- followed by anything to EOL,
      // OR -- at the very end of the string (no trailing char required)
      .replace(/--.*/g, "")
      .trim()
  );
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
 * Determine what happens after an apostrophe is injected.
 *
 * Returns one of three outcomes:
 *   { kind: "commented-out" }                    — rest of query is commented out, no UNION
 *   { kind: "error", message: string }           — SQL syntax/semantic error
 *   { kind: "valid", isUnion: "users"|"posts"|false } — structurally valid SQL continuation
 *
 * Flow:
 *   1. Strip comments from the injected fragment.
 *   2. If nothing remains → the attacker commented out the rest → silent pass.
 *   3. Check for a second bare apostrophe → unterminated string error.
 *   4. Check for forbidden DDL/DML → permission denied error.
 *   5. Check for stray semicolon → multiple statements error.
 *   6. Check for unmatched parentheses → syntax error.
 *   7. UNION present but no SELECT → syntax error.
 *   8. UNION SELECT present but no FROM → syntax error.
 *   9. UNION SELECT … FROM … → validate column count, then table, then columns.
 *  10. Non-UNION continuation → validate it starts with a known SQL keyword.
 */
function evaluateInjection(
  normalQuery: string,
  injectedSql: string,
):
  | { kind: "commented-out" }
  | { kind: "error"; message: string }
  | { kind: "valid"; isUnion: "users" | "posts" | false } {
  const ilikeLine = `posts.title ILIKE '%${normalQuery}'`;

  // ── Step 1: strip comments to see what actually executes ─────────────────
  const stripped = stripComments(injectedSql);
  const q = stripped.toLowerCase().replace(/\s+/g, " ").trim();

  // ── Step 2: nothing after the apostrophe at all → unterminated string ───────
  if (injectedSql.trim() === "") {
    return {
      kind: "error",
      message:
        `ERROR:  unterminated quoted string at or near "'"\n` +
        `LINE 1: ${ilikeLine}'\n` +
        `        ${"^".padStart(ilikeLine.length + 2)}`,
    };
  }

  // ── Step 3: everything commented out → silent pass ─────────────────────────
  // The apostrophe already closed the ILIKE string literal; -- # /**/ etc.
  // now comment out the trailing %' junk → perfectly valid SQL.
  if (q === "") {
    return { kind: "commented-out" };
  }

  // ── Step 4: second bare apostrophe → unterminated quoted string ───────────
  if (injectedSql.includes("'")) {
    const afterSecond = injectedSql.slice(injectedSql.indexOf("'") + 1);
    return {
      kind: "error",
      message:
        `ERROR:  unterminated quoted string at or near "'${afterSecond.slice(0, 20)}"\n` +
        `LINE 1: ${ilikeLine}${injectedSql.slice(0, 40)}\n` +
        `        ${"^".padStart(ilikeLine.length + 2)}`,
    };
  }

  // ── Step 5: DDL / DML → permission denied ────────────────────────────────
  if (/\b(drop|delete|insert|update|truncate|alter|create)\b/.test(q)) {
    const kw = q.match(
      /\b(drop|delete|insert|update|truncate|alter|create)\b/,
    )![1];
    return {
      kind: "error",
      message:
        `ERROR:  permission denied for table ${["insert", "update", "delete"].includes(kw) ? "posts" : "unknown"}\n` +
        `DETAIL: The current user does not have ${kw.toUpperCase()} privileges.`,
    };
  }

  // ── Step 6: stray semicolon → multiple statements not allowed ─────────────
  if (stripped.includes(";")) {
    return {
      kind: "error",
      message:
        `ERROR:  cannot insert multiple commands into a prepared statement\n` +
        `LINE 1: ${ilikeLine}${stripped.slice(0, 30)};\n` +
        `        ${"^".padStart(ilikeLine.length + stripped.indexOf(";") + 2)}`,
    };
  }

  // ── Step 6: unmatched parentheses ─────────────────────────────────────────
  const openParens = (stripped.match(/\(/g) || []).length;
  const closeParens = (stripped.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return {
      kind: "error",
      message:
        `ERROR:  syntax error at or near "${openParens > closeParens ? "(" : ")"}"\n` +
        `LINE 1: ${ilikeLine}${stripped.slice(0, 40)}\n` +
        `        ${"^".padStart(ilikeLine.length + 2)}`,
    };
  }

  // ── Step 7: UNION without SELECT ──────────────────────────────────────────
  if (/\bunion\b/.test(q) && !/\bselect\b/.test(q)) {
    return {
      kind: "error",
      message:
        `ERROR:  syntax error at or near "UNION"\n` +
        `LINE 1: ${ilikeLine} UNION\n` +
        `        ${"^".padStart(ilikeLine.length + 7)}`,
    };
  }

  // ── Step 8: UNION SELECT without FROM ────────────────────────────────────
  if (/\bunion\b/.test(q) && /\bselect\b/.test(q) && !/\bfrom\b/.test(q)) {
    const colMatch = stripped.match(/select(.+)/i);
    const cols = colMatch ? colMatch[1].trim().slice(0, 40) : "...";
    return {
      kind: "error",
      message:
        `ERROR:  syntax error at or near "SELECT"\n` +
        `DETAIL: Each UNION query must have a FROM clause.\n` +
        `LINE 1: ${ilikeLine} UNION SELECT ${cols}\n` +
        `        ${"^".padStart(ilikeLine.length + 14)}`,
    };
  }

  // ── Step 9: UNION SELECT … FROM … ────────────────────────────────────────
  if (/\bunion\b/.test(q) && /\bselect\b/.test(q) && /\bfrom\b/.test(q)) {
    const colMatch = stripped.match(/select(.+?)from/i);
    const cols = colMatch ? colMatch[1].trim().slice(0, 60) : "...";

    // Whether the attacker has terminated the query with a comment token.
    // Without one the DB sees the trailing %' from the ILIKE still appended,
    // so the query is structurally open — column count is unknowable and the
    // DB would throw a generic syntax error, not a column mismatch.
    const hasCommentToken = /--|#|\/\*/.test(injectedSql);

    // 9a. No comment token → query is still open, generic syntax error
    if (!hasCommentToken) {
      return {
        kind: "error",
        message:
          `ERROR:  syntax error at or near "%"\n` +
          `LINE 1: ${ilikeLine}${stripped.slice(0, 40)} %'\n` +
          `        ${"^".padStart(ilikeLine.length + stripped.slice(0, 40).length + 3)}`,
      };
    }

    const colCount = countSelectedColumns(injectedSql);

    // 9b. Wrong column count (only reachable once query is terminated)
    if (colCount !== null && colCount !== REQUIRED_COLUMNS) {
      return {
        kind: "error",
        message:
          `ERROR:  each UNION query must have the same number of columns\n` +
          `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ...\n` +
          `        ${"^".padStart(ilikeLine.length + 7)}`,
      };
    }

    // 9b. FROM with nothing after it → syntax error
    const tableMatch = stripped.match(/from\s+(\w+)/i);
    if (!tableMatch) {
      return {
        kind: "error",
        message:
          `ERROR:  syntax error at or near "FROM"\n` +
          `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM\n` +
          `        ${"^".padStart(ilikeLine.length + 7 + cols.length + 7)}`,
      };
    }

    const table = tableMatch[1].toLowerCase();

    // 9c. Only users and posts exist; everything else is an unknown relation
    if (table !== "users" && table !== "posts") {
      return {
        kind: "error",
        message:
          `ERROR:  relation "${table}" does not exist\n` +
          `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ${table}\n` +
          `        ${"^".padStart(ilikeLine.length + 7 + cols.length + 6 + table.length)}`,
      };
    }

    // 9d. posts → duplicate results to simulate UNION against same table
    if (table === "posts") {
      return { kind: "valid", isUnion: "posts" };
    }

    // 9e. users → validate column names if non-literal columns are used
    const selectBody = colMatch ? colMatch[1] : "";
    const hasOnlyLiterals = /^[\d\s,null']+$/i.test(selectBody);
    if (!hasOnlyLiterals) {
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
        return {
          kind: "error",
          message:
            `ERROR:  column "${badCol}" does not exist\n` +
            `LINE 1: ${ilikeLine} UNION SELECT ${cols} FROM ${table}\n` +
            `        ${"^".padStart(ilikeLine.length + 15 + cols.indexOf(badCol))}`,
        };
      }
    }

    // 9f. Passes all checks → valid UNION SELECT against users → leak creds
    return { kind: "valid", isUnion: "users" };
  }

  // ── Step 10: non-UNION continuation ──────────────────────────────────────
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
    return {
      kind: "error",
      message:
        `ERROR:  syntax error at or near "${firstKeyword}"\n` +
        `LINE 1: ${ilikeLine}${stripped.slice(0, 40)}\n` +
        `        ${"^".padStart(ilikeLine.length + 2)}`,
    };
  }

  // Valid non-UNION continuation (e.g. AND 1=1, OR 1=1, ORDER BY …)
  return { kind: "valid", isUnion: false };
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

  // ── No apostrophe → plain search, no injection simulation ────────────────
  if (!hasApostrophe) {
    const posts = await fetchNormalPosts(normalQuery, sort, currentPage);
    if (priv === 1) posts.push(privFlagPost);
    return posts;
  }

  // ── Apostrophe present → evaluate the injected fragment ──────────────────
  const result = evaluateInjection(normalQuery, injectedSql);

  switch (result.kind) {
    // Attacker commented out the rest of the query — run normally (no priv flag
    // because the SQL structure is broken from the DB's perspective).
    case "commented-out": {
      const posts = await fetchNormalPosts(normalQuery, sort, currentPage);
      if (priv === 1) posts.push(privFlagPost);
      return posts;
    }

    // Malformed injection → surface the simulated DB error.
    case "error":
      throw new Error(result.message);

    // Structurally valid injection.
    case "valid": {
      const posts = await fetchNormalPosts(normalQuery, sort, currentPage);

      if (result.isUnion === "users") {
        // Successful UNION SELECT against users → leak fake credentials.
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

      if (result.isUnion === "posts") {
        // UNION SELECT against posts → results appear twice, no credential leak.
        return [...posts, ...posts];
      }

      // Non-UNION valid continuation (AND/OR/ORDER BY etc.) — run normally.
      if (priv === 1) posts.push(privFlagPost);
      return posts;
    }
  }
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

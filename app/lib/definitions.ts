export type User = {
  uid: string;
  username: string;
  password: string;
  role: "admin" | "moderator" | "member";
};

export type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author_username: string;
  author_role: string;
};

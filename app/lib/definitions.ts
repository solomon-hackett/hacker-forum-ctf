export type User = {
  id: string;
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
  in_review: boolean;
  public: boolean;
  successful_xss: boolean;
};

export type SignUpState = {
  error: string | null;
  success: boolean;
};

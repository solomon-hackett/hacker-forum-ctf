export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: number;
  created_at: string;
};

export type DisplayPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_id: number;
  created_at: string;
};

export type User = {
  it: string;
  username: string;
  password: string;
};

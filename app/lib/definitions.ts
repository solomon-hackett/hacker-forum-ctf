export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
};

export type DisplayPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
};

export interface Image {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  post_id: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  post_id: string;
}

export interface Post {
  id: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  comments: Comment[];
}

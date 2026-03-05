import { Post } from "@/types";
import { apiRequest } from "./api";

export const postService = {
  getAll: () => apiRequest<Post[]>("/posts"),

  getById: (id: string) => apiRequest<Post>(`/posts/${id}`),

  create: (imageUrls: string[]) =>
    apiRequest<Post>("/posts", {
      method: "POST",
      body: JSON.stringify({ imageUrls }),
    }),
};

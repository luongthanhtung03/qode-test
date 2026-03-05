import { Comment } from "@/types";
import { apiRequest } from "./api";

export interface CreateCommentDto {
  content: string;
  post_id: string;
}

export const commentService = {
  getByPostId: (postId: string) =>
    apiRequest<Comment[]>(`/comments?post_id=${postId}`),

  create: (data: CreateCommentDto) =>
    apiRequest<Comment>("/comments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

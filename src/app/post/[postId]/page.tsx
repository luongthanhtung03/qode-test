"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Typography, Avatar, Button, Spin, Empty, Divider, Input } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Post } from "@/types";
import { postService, commentService } from "@/services";

const { Title, Text, Paragraph } = Typography;

export default function PostDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = params.postId as string;
  const initialPhotoIndex = parseInt(searchParams.get("photo") || "0", 10);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] =
    useState<number>(initialPhotoIndex);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await postService.getById(postId);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const navigatePhoto = useCallback(
    (direction: "prev" | "next") => {
      if (!post) return;

      let newIndex = currentPhotoIndex;
      if (direction === "prev") {
        newIndex =
          currentPhotoIndex > 0
            ? currentPhotoIndex - 1
            : post.images.length - 1;
      } else {
        newIndex =
          currentPhotoIndex < post.images.length - 1
            ? currentPhotoIndex + 1
            : 0;
      }

      setCurrentPhotoIndex(newIndex);
      router.replace(`/post/${postId}?photo=${newIndex}`, { scroll: false });
    },
    [currentPhotoIndex, post, postId, router]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigatePhoto("prev");
      } else if (e.key === "ArrowRight") {
        navigatePhoto("next");
      } else if (e.key === "Escape") {
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigatePhoto, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      setSubmitting(true);
      const addedComment = await commentService.create({
        content: newComment.trim(),
        post_id: postId,
      });
      setPost({
        ...post,
        comments: [...post.comments, addedComment],
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <Empty description="Post not found" />
        <Button type="primary" onClick={() => router.push("/")}>
          Go back to Home
        </Button>
      </div>
    );
  }

  const currentImage = post.images[currentPhotoIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          className="text-base"
        >
          Back to Posts
        </Button>
      </div>

      <div className="flex h-[calc(100vh-60px)] overflow-hidden max-md:flex-col max-md:h-auto">
        {/* Photo Section - Left */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#1a1a1a] relative max-md:min-h-[60vh]">
          {post.images.length > 0 ? (
            <>
              <div className="flex items-center justify-center gap-4 flex-1 w-full max-h-[70%]">
                <Button
                  shape="circle"
                  icon={<LeftOutlined />}
                  onClick={() => navigatePhoto("prev")}
                  className="shrink-0 bg-white/90! hover:bg-white!"
                  disabled={post.images.length <= 1}
                />

                <div className="flex-1 flex items-center justify-center max-h-full overflow-hidden">
                  <img
                    src={currentImage?.url}
                    alt={`Photo ${currentPhotoIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                <Button
                  shape="circle"
                  icon={<RightOutlined />}
                  onClick={() => navigatePhoto("next")}
                  className="shrink-0 bg-white/90! hover:bg-white!"
                  disabled={post.images.length <= 1}
                />
              </div>

              {/* Thumbnail strip */}
              <div className="flex gap-2 mt-4 p-2 bg-white/10 rounded-lg overflow-x-auto max-w-full">
                {post.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`w-15 h-15 shrink-0 rounded overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                      index === currentPhotoIndex
                        ? "opacity-100 border-blue-500"
                        : "opacity-60 border-transparent hover:opacity-80"
                    }`}
                    onClick={() => {
                      setCurrentPhotoIndex(index);
                      router.replace(`/post/${postId}?photo=${index}`, {
                        scroll: false,
                      });
                    }}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="text-white mt-3 text-sm">
                {currentPhotoIndex + 1} / {post.images.length}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Empty description="No photos in this post" />
            </div>
          )}
        </div>

        {/* Comments Section - Right */}
        <div className="w-100 bg-white p-6 overflow-y-auto border-l border-gray-200 max-md:w-full max-md:max-h-[40vh]">
          <Title level={4} className="m-0!">
            Comments ({post.comments.length})
          </Title>
          <Divider />

          <div className="flex flex-col gap-4">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg"
                >
                  <Avatar className="shrink-0 bg-blue-500">
                    {comment.content.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <Paragraph className="mb-1! wrap-break-word">
                      {comment.content}
                    </Paragraph>
                    <Text type="secondary" className="text-xs">
                      {formatDate(comment.createdAt)}
                    </Text>
                  </div>
                </div>
              ))
            ) : (
              <Empty description="No comments yet" />
            )}
          </div>

          {/* Add Comment Input */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input.TextArea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
                disabled={submitting}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSubmitComment}
                loading={submitting}
                disabled={!newComment.trim()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Card, Avatar, Typography, Space, Image } from "antd";
import { MessageOutlined, PictureOutlined } from "@ant-design/icons";
import { Post } from "@/types";
import { useRouter } from "next/navigation";

const { Text, Paragraph } = Typography;

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const displayedImages = post.images.slice(0, 2);
  const remainingImagesCount = post.images.length - 2;
  const displayedComments = post.comments.slice(0, 3);
  const remainingCommentsCount = post.comments.length - 3;

  const handleImageClick = (imageIndex: number) => {
    router.push(`/post/${post.id}?photo=${imageIndex}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="mb-6 rounded-xl overflow-hidden" hoverable>
      {/* Images Section */}
      <div className="flex gap-2 mb-4">
        <Image.PreviewGroup>
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              className="relative flex-1 aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(index);
              }}
            >
              <img
                src={image.url}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {remainingImagesCount > 0 && post.images[2] && (
            <div
              className="relative flex-1 aspect-square overflow-hidden rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              onClick={() => handleImageClick(2)}
            >
              <img
                src={post.images[2].url}
                alt="More images"
                className="w-full h-full object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <PictureOutlined className="text-2xl mb-1" />
                <span className="text-lg font-semibold">
                  +{remainingImagesCount}
                </span>
              </div>
            </div>
          )}
        </Image.PreviewGroup>
      </div>

      {/* Post Info */}
      <div className="mb-3">
        <Text type="secondary" className="text-xs">
          {formatDate(post.createdAt)}
        </Text>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-100 pt-3">
        <Space className="mb-3">
          <MessageOutlined />
          <Text strong>
            {post.comments.length} Comment{post.comments.length !== 1 && "s"}
          </Text>
        </Space>

        <div className="flex flex-col gap-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex gap-2 items-start">
              <Avatar size="small" className="shrink-0 bg-blue-500">
                {comment.content.charAt(0).toUpperCase()}
              </Avatar>
              <div className="flex-1 min-w-0">
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  className="mb-1!"
                >
                  {comment.content}
                </Paragraph>
                <Text type="secondary" className="text-[11px]">
                  {formatDate(comment.createdAt)}
                </Text>
              </div>
            </div>
          ))}
          {remainingCommentsCount > 0 && (
            <Text
              type="secondary"
              className="cursor-pointer italic hover:text-blue-500 hover:underline"
              onClick={() => router.push(`/post/${post.id}`)}
            >
              View {remainingCommentsCount} more comment
              {remainingCommentsCount !== 1 && "s"}...
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
}

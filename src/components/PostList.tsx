"use client";

import { List, Spin, Empty, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import PostCard from "@/components/PostCard";

const { Title } = Typography;

interface PostListProps {
  posts: Post[];
  loading?: boolean;
}

export default function PostList({ posts, loading = false }: PostListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Spin size="large" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Empty description="No posts yet">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/post/new")}
          >
            Create First Post
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="max-w-300 mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="m-0!">
          Posts
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/post/new")}
        >
          New Post
        </Button>
      </div>
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <PostCard post={post} />
          </List.Item>
        )}
      />
    </div>
  );
}

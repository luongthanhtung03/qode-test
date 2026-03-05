"use client";

import { useEffect, useState } from "react";
import PostList from "@/components/PostList";
import { Post } from "@/types";
import { postService } from "@/services";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getAll();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <PostList posts={posts} loading={loading} />
    </div>
  );
}

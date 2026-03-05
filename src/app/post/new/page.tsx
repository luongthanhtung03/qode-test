"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Button,
  Card,
  Typography,
  message,
  Space,
  Image,
} from "antd";
import {
  UploadOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { postService, cloudinaryService } from "@/services";

const { Title, Text } = Typography;

interface UploadedImage {
  publicId: string;
  url: string;
  filename: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      setUploading(true);
      const result = await cloudinaryService.uploadFile(file as File);
      const uploadedImage: UploadedImage = {
        publicId: result.public_id,
        url: result.secure_url,
        filename: result.original_filename,
      };
      setUploadedImages((prev) => [...prev, uploadedImage]);
      onSuccess?.(result);
      message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(error as Error);
      message.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setFileList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (uploadedImages.length === 0) {
      message.warning("Please upload at least one image");
      return;
    }

    try {
      setCreating(true);
      await postService.create(uploadedImages.map((img) => img.url));
      message.success("Post created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    fileList,
    customRequest: handleUpload,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    accept: "image/*",
    showUploadList: false,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 bg-white border-b border-gray-200">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          className="text-base"
        >
          Back to Posts
        </Button>
      </div>

      <Card className="max-w-200 mx-auto my-6 rounded-xl">
        <Title level={2} className="mb-6! text-center">
          Create New Post
        </Title>

        <div className="mb-6">
          <Text strong className="block mb-2 text-base">
            Upload Photos
          </Text>
          <Text type="secondary" className="block mb-4">
            You can upload multiple photos at once
          </Text>

          <Upload {...uploadProps} className="w-full">
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50">
              <PlusOutlined className="text-3xl text-blue-500 mb-2" />
              <span>Click or drag to upload</span>
            </div>
          </Upload>
        </div>

        {uploadedImages.length > 0 && (
          <div className="mb-6">
            <Text strong className="block mb-2 text-base">
              Uploaded Photos ({uploadedImages.length})
            </Text>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mt-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.publicId}
                  className="relative rounded-lg overflow-hidden border border-gray-200"
                >
                  <Image
                    src={image.url}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-37.5 object-cover"
                    width={150}
                    height={150}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="absolute! top-1 right-1 bg-white/90! rounded-full hover:bg-white!"
                    onClick={() => handleRemoveImage(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Space>
            <Button onClick={() => router.push("/")}>Cancel</Button>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleCreatePost}
              loading={creating}
              disabled={uploadedImages.length === 0}
            >
              Create Post
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}

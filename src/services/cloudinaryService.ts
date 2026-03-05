const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  original_filename: string;
  format: string;
  width: number;
  height: number;
}

export const cloudinaryService = {
  /**
   * Upload a single file to Cloudinary
   */
  uploadFile: async (file: File): Promise<CloudinaryUploadResponse> => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Upload failed");
    }

    return response.json();
  },

  /**
   * Upload multiple files to Cloudinary
   */
  uploadFiles: async (files: File[]): Promise<CloudinaryUploadResponse[]> => {
    const uploadPromises = files.map((file) => cloudinaryService.uploadFile(file));
    return Promise.all(uploadPromises);
  },
};

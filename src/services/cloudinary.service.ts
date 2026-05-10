import axios from "axios";
import { privateRequest } from "@/utils/request";
import UploadEndpoint from "@/endpoints/upload.endpoint";
import Env from "@/config/env.config";

/**
 * Fetch signed upload options from backend
 */
export const getUploadOptions = async (
  strategy: string,
  params?: Record<string, any>,
) => {
  if (!strategy) {
    throw new Error("Upload strategy is required");
  }

  const response = await privateRequest.get(UploadEndpoint.GET_UPLOAD_OPTIONS, {
    params: {
      ...params,
      strategy,
    },
  });

  return response.data;
};

export type FileRequest =
  | File
  | Blob
  | { uri: string; type?: string; name?: string };

export type ProgressCallback = (percent: number) => void;

/**
 * Upload file to Cloudinary
 */
const cldUpload = async (
  file: FileRequest,
  options: Record<string, any>,
  onProgress?: ProgressCallback,
) => {
  if (!file) {
    throw new Error("File is required for upload");
  }

  if (!options?.signature) {
    throw new Error("Missing Cloudinary signature");
  }

  if (!options?.timestamp) {
    throw new Error("Missing Cloudinary timestamp");
  }

  const formData = new FormData();

  /**
   * Web: File | Blob
   * React Native: { uri, type, name }
   */
  formData.append("file", file as any);
  formData.append("api_key", Env.CLOUDINARY_API_KEY as string);

  // Append signed options safely
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${Env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      },
    },
  );

  return response.data;
};

/**
 * Public API
 */
export const cloudinaryUpload = async (
  file: FileRequest,
  strategy: string,
  optionParams?: Record<string, any>,
  onProgress?: ProgressCallback,
) => {
  const options = await getUploadOptions(strategy, optionParams);
  try {
    const response = await cldUpload(file, options, onProgress);
    return {
      ...response,
      publicId: response.public_id,
      assetId: response.asset_id,
    };
  } catch (err: any) {
    throw err;
  }
};

export default cloudinaryUpload;

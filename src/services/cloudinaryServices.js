import axios from "axios";
import AppProperty from "@/constants/AppProperty";
import { privateRequest } from "@/utils/request";
import UploadEndpoint from "@/endpoints/UploadEndpoint";

export const getUploadOptions = async (stragegy, payload) => {
  const response = await privateRequest.get(
    UploadEndpoint.GET_UPLOAD_OPTIONS,
    {
      params: {
        stragegy,
      },
    },
    payload,
  );
  return response.data;
};

const cldUpload = async (file, params) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", AppProperty.CLOUDINARY_API_KEY);

  if (!params.signature) {
    throw new Error("Missing signature");
  } else if (!params.timestamp) {
    throw new Error("Missing timestamp");
  }

  for (var k in params) {
    formData.append(k, params[k]);
  }

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${AppProperty.CLOUDINARY_CLOUD_NAME}/auto/upload`,
    formData,
    {
      headers: {
        "Content-Type": `multipart/form-data`,
        boundary: formData._boundary,
      },
    },
  );
  return response.data;
};

const cloudinaryUpload = async (file, stragegy) => {
  const params = await getUploadOptions(stragegy);
  const response = await cldUpload(file, params);
  return response;
};

export default cloudinaryUpload;

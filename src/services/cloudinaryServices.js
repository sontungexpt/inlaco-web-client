import axios from "axios";
import AppProperty from "@/constants/AppProperty";
import { privateRequest } from "@/utils/request";
import UploadEndpoint from "@/endpoints/UploadEndpoint";

export const getUploadOptions = async (stragegy, params) => {
  const response = await privateRequest.get(
    UploadEndpoint.GET_UPLOAD_OPTIONS,
    {
      params: {
        stragegy,
        ...params,
      },
    },
    params,
  );
  return response.data;
};

const cldUpload = async (file, options) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", AppProperty.CLOUDINARY_API_KEY);

  if (!options.signature) {
    throw new Error("Missing signature");
  } else if (!options.timestamp) {
    throw new Error("Missing timestamp");
  }

  for (var k in options) {
    formData.append(k, options[k]);
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

const cloudinaryUpload = async (file, stragegy, optionParams) => {
  const options = await getUploadOptions(stragegy, optionParams);
  const response = await cldUpload(file, options);
  return response;
};

export default cloudinaryUpload;

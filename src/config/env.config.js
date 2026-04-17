export const Env = {
  BASE_API_URL:
    import.meta.env.VITE_BASE_API_URL ||
    "https://inlaco-crewmgr-service-b7btdkgsdwafb2ht.eastasia-01.azurewebsites.net/api",
  CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
};

export default Env;

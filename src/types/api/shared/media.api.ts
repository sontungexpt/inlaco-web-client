export type MediaAsset = {
  url: string;
  publicId: string;
  displayName: string;
  resourceType: "image" | string;
  format: string;
  bytes: number;
  uploadedAt: string; // ISO string
};

import { MediaAsset } from "./shared/media.api";

export interface AccountProfileResponse {
  name: string;
  avatar: MediaAsset;
  roles: string[];
}

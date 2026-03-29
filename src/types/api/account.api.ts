import { Asset } from "./shared/asset.api";

export interface AccountProfileResponse {
  name: string;
  avatar: Asset;
  roles: string[];
}

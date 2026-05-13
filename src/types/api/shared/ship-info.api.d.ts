import { Asset } from "./asset.api";

export interface ShipInfo {
  imoNumber: string;
  countryISO: string;
  name: string;
  type: string;
  description?: string;
  image?: Asset;
}

export interface ShipInfoRequest {
  imoNumber: string;
  countryISO: string;
  name: string;
  description?: string;
  image?: string;
  type?: string;
}

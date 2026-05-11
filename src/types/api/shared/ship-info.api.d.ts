import { Asset } from "./asset.api";

export interface ShipInfo {
  imoNumber: string;
  countryISO: string;
  name: string;
  description?: string;
  image?: Asset;
  type?: string;
  url?: string;
}

export interface ShipInfoRequest {
  imoNumber: string;
  countryISO: string;
  name: string;
  description?: string;
  image?: string;
  type?: string;
}

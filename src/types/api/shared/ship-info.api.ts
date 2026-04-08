import { Asset } from "./asset.api";

export interface ShipInfo {
  imoNumber: string;
  countryISO: string;
  name: string;
  description?: string;
  image?: Asset;
  type?: string;
}

export interface ShipInfoRequest {
  imoNumber: string;
  countryISO: string;
  name: string;
  description?: string;
  image?: String;
  type?: string;
}

import { Asset } from "./asset.api";

export interface ShipInfo {
  imoNumber: string;
  registrationNumber: string;
  countryISO?: string;
  name: string;
  description?: string;
  image?: Asset;
  type?: string;
}

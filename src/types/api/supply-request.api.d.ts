import { Asset } from "./shared/asset.api";
import { ShipInfo } from "./shared/ship-info.api";

export enum SupplyRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SIGNING = "SIGNING",
  CONFIRMED = "CONFIRMED",
  ACTIVE = "ACTIVE",
  DONE = "DONE",
  REJECTED = "REJECTED",
}

export interface SupplyRequest {
  id: string;

  detailFile?: Asset;

  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyRepresentor?: string;
  companyRepresentorPosition?: string;

  rentalStartDate?: string; //  ISO string
  rentalEndDate?: string; //  ISO string

  shipInfo?: ShipInfo;

  contractId?: string;

  status: SupplyRequestStatus;
}

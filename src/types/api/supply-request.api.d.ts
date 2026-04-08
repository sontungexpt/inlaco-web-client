import { Asset } from "./shared/asset.api";
import { PageParams } from "./shared/base.api";
import { ShipInfo, ShipInfoRequest } from "./shared/ship-info.api";

export type SupplyRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "SIGNING"
  | "CONFIRMED"
  | "ACTIVE"
  | "DONE"
  | "REJECTED";

export interface FetchSupplyRequestParams extends PageParams<any> {}

export interface SupplyRequest {
  id: string;

  detailFile: Asset;

  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyRepresentor: string;
  companyRepresentorPosition: string;

  rentalStartDate: string; //  ISO string
  rentalEndDate: string; //  ISO string

  shipInfo: ShipInfo;

  contractId?: string;

  status: SupplyRequestStatus;
}

export interface NewSupplyRequest {
  detailFile: String;

  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyRepresentor: string;
  companyRepresentorPosition: string;

  rentalStartDate: string; //  ISO string
  rentalEndDate: string; //  ISO string

  shipInfo: ShipInfoRequest;
}

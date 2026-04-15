import { Asset } from "./shared/asset.api";
import { PageParams } from "./shared/base.api";

export type CrewStatus =
  | "DRAFT"
  | "READY_FOR_ASSIGNMENT"
  | "ENGAGED"
  | "ON_LEAVE"
  | "INACTIVE";

export interface CrewProfileFilterCriteria {
  keyword?: string;
  workStatus?: CrewStatus;
  professionalPosition?: string;
  official?: boolean;
}

export interface CrewProfileFetchParams
  extends PageParams<CrewProfileFilterCriteria> {
  page: number;
  pageSize: number;
}

export interface CrewProfile {
  id: string;

  status: CrewStatus;

  employeeCardId: string;

  fullName: string;
  phoneNumber?: string;
  email?: string;
  address?: string;

  gender?: string;
  birthDate?: string;

  professionalPosition: string;
  // avatarUrl?: string;

  socialInsuranceCode?: string;
  socialInsuranceImages?: Asset[];
  accidentInsuranceCode?: string;
  accidentInsuranceImages?: Asset[];
}

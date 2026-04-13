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
  status: CrewStatus;

  employeeCardId: string;

  fullName: string;
  avatarUrl?: string;

  gender?: string;
  birthDate?: string;

  phoneNumber?: string;
  email?: string;
  address?: string;

  professionalPosition?: string;

  experience?: number[];
  expertiseLevels?: string[];

  socialInsuranceCode?: string;
  accidentInsuranceCode?: string;
  healthInsuranceCode?: string;

  healthInsHospital?: string;

  socialInsuranceImages?: Asset[];
  accidentInsuranceImages?: Asset[];
}

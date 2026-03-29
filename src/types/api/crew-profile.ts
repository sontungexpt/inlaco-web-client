import { Asset } from "./shared/asset.api";

export enum CrewStatus {
  DRAFT = "DRAFT",
  READY_FOR_ASSIGNMENT = "READY_FOR_ASSIGNMENT",
  ENGAGED = "ENGAGED",
  ON_LEAVE = "ON_LEAVE",
  INACTIVE = "INACTIVE",
}

export interface CrewProfileResponse {
  status: CrewStatus;

  cardId: string;

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

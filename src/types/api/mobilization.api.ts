import { PageParams } from "./shared/base.api";
import { ShipInfo, ShipInfoRequest } from "./shared/ship-info.api";

export type MobilizationScheduleStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type NewAssignedCrew = {
  id: string;
  fullName: string;
  employeeCardId: string;
  rankOnBoard: string;
  startDate: string; //  ISO string
  endDate: string; //  ISO string
};

export type NewMobilizationSchedule = {
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerAddress: string;

  shipInfo: ShipInfoRequest;
  startDate: string; //  ISO string
  endDate: string; //  ISO string

  crews: NewAssignedCrew[]; // Set -> array

  // status?: MobilizationScheduleStatus;
};

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type AssignedCrew = {
  id: string;

  employeeCardId: string;
  rankOnBoard: string;

  startDate: string; // Instant -> ISO string
  endDate: string; // Instant -> ISO string

  remark: string;

  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;

  gender: Gender;

  professionalPosition: string;
};

export type FetchMobilizationSchedulesParams = PageParams & {};

export type MobilizationSchedule = {
  id: string;

  status: MobilizationScheduleStatus;

  // Partner Information
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerAddress: string;

  shipInfo: ShipInfo;

  startDate: string; // Instant -> ISO string
  endDate: string; // Instant -> ISO string

  crews: AssignedCrew[];

  // computed fields (backend expose qua getter)
  crewNumbers: number;

  createdAt: string; // Instant -> ISO string
  updatedAt: string; // Instant -> ISO string
};

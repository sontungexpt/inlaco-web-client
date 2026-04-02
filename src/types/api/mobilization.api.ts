import { ShipInfoRequest } from "./shared/ship-info.api";

export type AssignedCrewRequest = {
  id: string;
  fullName: string;
  employeeCardId: string;
  rankOnBoard: string;
  startDate: string; //  ISO string
  endDate: string; //  ISO string
};

export enum MobilizationScheduleStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type MobilizationRequest = {
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerAddress: string;

  shipInfo: ShipInfoRequest;
  startDate: string; // Instant -> ISO string
  endDate: string;

  crews: AssignedCrewRequest[]; // Set -> array
  // status?: MobilizationScheduleStatus;
};

import { Filterable, PageParams } from "./shared/base.api";
import { ShipInfo, ShipInfoRequest } from "./shared/ship-info.api";

export type ScheduleStatus =
  | "DRAFT"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface CreateShipScheduleAssignedCrewRequest {
  employeeCardId: string;
  rankOnBoard: string;

  boardingTime: string;
  disembarkTime: string;

  boardingPort: string;
  disembarkPort: string;

  note?: string;
}

export interface CreateShipScheduleRequest {
  shipInfo: ShipInfoRequest;

  route: string;

  departureTime: string;

  arrivalTime: string;

  departurePort: string;

  arrivalPort: string;

  status?: ScheduleStatus;

  crews: CreateShipScheduleAssignedCrewRequest[];
}

export interface ShipScheduleFilter extends Filterable {}

export interface ShipSchedulePageParams
  extends PageParams<ShipScheduleFilter> {}

export interface ShipScheduleResponse {
  id: string;

  clientId?: string;

  shipInfo?: ShipInfo;

  route?: string;

  departureTime?: string;

  arrivalTime?: string;

  departurePort?: string;

  arrivalPort?: string;

  status: ScheduleStatus;

  createdBy?: string;

  createdAt?: string;

  updatedBy?: string;

  updatedAt?: string;
}

export interface ShipScheduleAssignedCrewDetail {
  profileId: string;

  employeeCardId: string;
  fullName: string;

  rankOnBoard: string;

  email?: string;
  phoneNumber?: string;

  gender?: "MALE" | "FEMALE" | "OTHER";

  address?: string;
  note?: string;
}

export interface ShipScheduleDetail {
  id: string;
  clientId: string;

  shipInfo: ShipInfo;

  route: string;

  departureTime: string;
  arrivalTime: string;

  departurePort: string;
  arrivalPort: string;

  status: ScheduleStatus;

  crews: ShipScheduleAssignedCrewDetail[];

  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

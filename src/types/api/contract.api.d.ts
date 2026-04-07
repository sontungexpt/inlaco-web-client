import { Asset } from "./shared/asset.api";
import { PageParams } from "./shared/base.api";
import { ShipInfo } from "./shared/ship-info.api";

export interface DynamicAttribute {
  key: string;
  value: string;
}

export enum PartyType {
  STATIC = "STATIC",
  LABOR = "LABOR",
}

export interface BaseParty {
  type: PartyType;
  name: string;
  representer: string;
  representerPosition: string;
  email?: string;
  phone?: string;
  address?: string;
  customAttributes?: DynamicAttribute[];
}

export interface LaborParty extends BaseParty {
  type: PartyType.LABOR;
  identificationCardId: string;
  identificationCardIssuedDate?: string;
  identificationCardIssuedPlace: string;
  bankAccount?: string;
  bankName?: string;
  birthDate?: string;
  birthPlace?: string;
  nationality?: string;
  temporaryAddress?: string;
}

export enum ContractStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  SIGNED = "SIGNED",
}

export type ContractType = "LABOR_CONTRACT" | "SUPPLY_CONTRACT";

export type FilterOptions = {
  keyword?: string;

  type?: ContractType;
  signed?: boolean;

  activationDateStart?: string;
  activationDateEnd?: string;

  expiredDateStart?: string;
  expiredDateEnd?: string;
};

export interface FetchContractParams extends PageParams<FilterOptions> {}

export interface BaseContract {
  id: string;
  type: ContractType;
  title: string;
  initiator: BaseParty;
  partners: BaseParty[];
  terms?: string[];
  contractFile?: Asset;
  attachments?: Asset[];
  customAttributes: DynamicAttribute[];
  version: number;
  status: ContractStatus;
  activationDate?: string;
  expiredDate?: string;
  draft: boolean;
  freezed: boolean;
  signed: boolean;
  active: boolean;
  expired: boolean;
  cancelled: boolean;
}

export interface LaborContract extends BaseContract {
  type: "LABOR_CONTRACT";

  employeeId?: string;
  applicationId?: string;

  position?: string;
  workingLocation?: string;

  basicSalary?: string;
  allowance?: string;

  partners: [LaborParty, ...BaseParty[]];

  receiveMethod?: string;
  payday?: string;
  salaryReviewPeriod?: string;
}

export interface CrewSupplyContract extends BaseContract {
  type: "SUPPLY_CONTRACT";
  numOfCrews: number;
  crewRentalRequestId?: string;
  shipInfo?: ShipInfo;
}

export interface NewContractBase {
  type: ContractType;
  title: string;
  initiator: BaseParty;
  partners: BaseParty[];
  contractFile: string; // assetId
  attachments?: string[];
  customAttributes?: DynamicAttribute[];
  activationDate?: string; // ISO string
  expiredDate?: string; // ISO string
  contractFreezeDelayMinutes?: number;
}

export interface NewCrewSupplyContract extends NewContractBase {
  type: "SUPPLY_CONTRACT";
  numOfCrews?: number;
  crewRentalRequestId?: string;
  shipInfo?: ShipInfo;
}

export interface NewLaborContract extends NewContractBase {
  type: "LABOR_CONTRACT";
  partners: [LaborParty, ...BaseParty[]];

  position: string;
  workingLocation: string;

  basicSalary: string;
  allowance?: string;

  receiveMethod: string;
  payday: string;
  salaryReviewPeriod: string;
}

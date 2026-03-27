import { PageParams } from "./shared/pageable.api";

export type ContractType = "LABOR_CONTRACT" | "SERVICE_CONTRACT";

export type FetchCrewContractsParams = {
  signed?: boolean;
  type?: ContractType;
} & PageParams;

export interface Contract {
  id: string;
  code: string;
  signed: boolean;
  type: ContractType;
  startDate: string;
  endDate: string;
  // thêm field theo API thật
}

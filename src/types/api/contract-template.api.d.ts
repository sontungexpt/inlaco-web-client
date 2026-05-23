import { Asset } from "./shared/asset.api";
import { PageParams } from "./shared/base.api";

export interface ContractTemplate {
  id: string;

  name: string;

  description?: string;

  /**
   * LABOR_CONTRACT
   * SUPPLY_CONTRACT
   * ...
   */
  type: string;

  metadata?: Asset;
}

export interface NewContractTemplateRequest {
  name: string;

  description?: string;

  type: string;
}

export interface ContractTemplateFilter {
  keyword?: string;

  type?: string;
}

export interface FetchContractTemplatesParams
  extends PageParams<ContractTemplateFilter> {}

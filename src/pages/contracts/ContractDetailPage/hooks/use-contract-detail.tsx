import { useApplicationContract, useContract } from "@/queries/contract.query";
import { useParams, useSearchParams } from "react-router";

export interface ContractDetailParams {
  id?: string;
  version?: number;
}

export const useContractDetailParams = (): ContractDetailParams => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const versionString = searchParams.get("version");
  const version = versionString ? Number(versionString) : undefined;
  return { id, version };
};

export const useContractDetail = () => {
  const { id, version } = useContractDetailParams();
  return useContract(id, version);
};

export const useCrewContractDetail = () => {
  const { applicationId } = useParams();
  const contractQuery = useContractDetail();
  const applicationContractQuery = useApplicationContract(applicationId);
  return applicationId ? applicationContractQuery : contractQuery;
};

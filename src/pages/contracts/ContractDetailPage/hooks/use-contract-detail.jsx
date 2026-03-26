import { useApplicationContract, useContract } from "@/queries/contract.query";
import { useParams, useSearchParams } from "react-router";

export const useContractDetailParams = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const version = searchParams.get("version") || null;
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

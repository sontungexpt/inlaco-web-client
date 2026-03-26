import { useParams, useSearchParams } from "react-router";

export const useContractFormParams = () => {
  const { candidateProfileId, contractId } = useParams();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("type") || "create";
  return { candidateProfileId, contractId, formType };
};

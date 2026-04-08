import E404Page from "@/pages/E404Page";
import { useSearchParams } from "react-router";
import CrewContractFormPage from "./CrewContractFormPage";
import SupplyContractFormPage from "./SupplyContractFormPage";
import { ContractType } from "@/types/api/contract.api";

const useContractFormPageParams = (): {
  contractType: ContractType;
} => {
  const [searchParams] = useSearchParams();
  const contractType = (searchParams.get("type") ||
    "LABOR_CONTRACT") as ContractType;

  return { contractType };
};

export default function ContractFormPage() {
  const { contractType } = useContractFormPageParams();

  switch (contractType) {
    case "LABOR_CONTRACT":
      return <CrewContractFormPage />;

    case "SUPPLY_CONTRACT":
      return <SupplyContractFormPage />;

    default:
      return <E404Page />;
  }
}

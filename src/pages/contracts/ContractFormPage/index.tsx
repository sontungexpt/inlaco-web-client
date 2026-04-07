import E404Page from "@/pages/E404Page";
import { ContractType } from "@/types/api/contract.api";
import { useSearchParams } from "react-router";
import CrewContractFormPage from "./CrewContractFormPage";
import SupplyContractFormPage from "./SupplyContractFormPage";

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

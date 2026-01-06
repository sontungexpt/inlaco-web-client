import React from "react";
import { useParams } from "react-router";
import { useContract } from "@/hooks/services/contract";

import CrewContractDetail from "./CrewContractDetail";
import SupplyContractDetail from "./SupplyContractDetail";
import E404 from "@/pages/E404";

const ContractDetailRouter = () => {
  const { id } = useParams();
  const { data: contract, isLoading } = useContract(id);
  if (isLoading) return null;

  switch (contract?.type) {
    case "CREW_CONTRACT":
      return <CrewContractDetail />;

    case "SUPPLY_CONTRACT":
      return <SupplyContractDetail />;

    default:
      return <E404 />;
  }
};

export default ContractDetailRouter;

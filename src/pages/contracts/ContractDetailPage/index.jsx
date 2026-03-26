import { CenterCircularProgress, LoadErrorState } from "@/components/common";

import CrewContractDetailPage from "./CrewContractDetailPage";
import SupplyContractDetailPage from "./SupplyContractDetailPage";
import E404Page from "@/pages/errors/E404Page";

import { useContractDetail } from "./hooks/use-contract-detail";

export default function ContractDetailPage() {
  const {
    data: contract,
    isLoading,
    isError,
    error,
    refetch,
  } = useContractDetail();

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  if (isError && error?.response?.status === 404) {
    return (
      <LoadErrorState
        title="Không thể tải hợp đồng"
        subtitle="Hợp đồng không tồn tại hoặc đã bị xoa"
        onRetry={() => refetch()}
      />
    );
  }

  switch (contract?.type) {
    case "CREW_CONTRACT":
      return <CrewContractDetailPage />;

    case "SUPPLY_CONTRACT":
      return <SupplyContractDetailPage />;

    default:
      return <E404Page />;
  }
}

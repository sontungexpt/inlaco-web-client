import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  getContractVersions,
  fetchContracts,
  fetchUniqueContract,
  fetchLaborContractByApplicationId,
  activeContract,
  createLaborContract,
  createSupplyContract,
  editContract,
} from "@/services/contract.service";
import {
  BaseContract,
  ContractType,
  FetchContractParams,
  LaborContract,
  NewContractBase,
  NewCrewSupplyContract,
  NewLaborContract,
} from "@/types/api/contract.api";
import { PageableResponse, ErrorResponse } from "@/types/api/shared/base.api";
import { AxiosError } from "axios";

export const ContractQueryKey = {
  ALL: ["contracts"],
  LIST: ({ page, pageSize, filter }: FetchContractParams) => [
    ...ContractQueryKey.ALL,
    "list",
    page,
    pageSize,
    filter,
  ],
  DETAIL: (id: string) => [...ContractQueryKey.ALL, "detail", id],
  APPLICATION: (applicationId: string) => [
    ...ContractQueryKey.ALL,
    "application-contract",
    applicationId,
  ],
  OLD_VERSIONS: (contractId: string) => [
    ...ContractQueryKey.ALL,
    "old-versions",
    contractId,
  ],
};

export function useContracts({
  page = 0,
  pageSize = 12,
  filter,
}: FetchContractParams) {
  return useQuery<PageableResponse<BaseContract>, ErrorResponse>({
    queryKey: ContractQueryKey.LIST({ page, pageSize, filter }),
    queryFn: () => fetchContracts({ page, pageSize, filter }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

export function useContract<T extends BaseContract = BaseContract>(
  id?: string,
  version?: number,
  options = {},
) {
  return useQuery<T, AxiosError<ErrorResponse>>({
    ...options,
    enabled: !!id,
    queryKey: ContractQueryKey.DETAIL(id as string),
    queryFn: () => fetchUniqueContract<T>(id as string, version),
    staleTime: 1000 * 60 * 4,
  });
}

export const useContractOldVersions = <T extends BaseContract = BaseContract>(
  contractId: string,
  options = {},
) => {
  return useQuery<T[], AxiosError<ErrorResponse>>({
    ...options,
    queryKey: ContractQueryKey.OLD_VERSIONS(contractId),
    queryFn: () => getContractVersions<T>(contractId),
    enabled: !!contractId, // Only fetch if contractID is provided
  });
};

// ----- Contract by application -----
export function useApplicationContract(applicationId?: string, props = {}) {
  return useQuery<LaborContract, AxiosError<ErrorResponse>>({
    enabled: !!applicationId,
    queryKey: ContractQueryKey.APPLICATION(applicationId as string),
    queryFn: () => fetchLaborContractByApplicationId(applicationId as string),
    staleTime: 1000 * 60 * 4,
    ...props,
  });
}

export const useActiveContract = ({
  onSuccess,
  ...options
}: UseMutationOptions<unknown, AxiosError<ErrorResponse>, string>) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError<ErrorResponse>, string>({
    ...options,
    mutationFn: (contractID) => activeContract(contractID),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(...args);
    },
  });
};

export const useCreateLaborContract = (
  options: UseMutationOptions<
    LaborContract,
    AxiosError<ErrorResponse>,
    { candidateId: string; contract: NewLaborContract }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ candidateId, contract }) =>
      createLaborContract(candidateId, contract),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      options?.onSuccess?.(...args);
    },
  });
};

export const useCreateSupplyContract = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  unknown,
  AxiosError<ErrorResponse>,
  {
    supplyRequestId: string;
    contract: NewCrewSupplyContract;
    contractFileAssetId: string;
    shipImageAssetId: string;
  }
>) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({
      supplyRequestId,
      contract,
      contractFileAssetId,
      shipImageAssetId,
    }) =>
      createSupplyContract(
        supplyRequestId,
        contract,
        contractFileAssetId,
        shipImageAssetId,
      ),

    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(...args);
    },
  });
};

export const useEditContract = <
  T extends NewContractBase = NewContractBase,
  R extends BaseContract = BaseContract,
>({
  onSuccess,
  ...options
}: UseMutationOptions<
  R,
  AxiosError<ErrorResponse>,
  {
    id: string;
    newDatas: T;
    type: ContractType;
  }
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, newDatas, type }) =>
      editContract<T, R>(id, newDatas, type),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ContractQueryKey.ALL,
      });
      onSuccess?.(...args);
    },
  });
};

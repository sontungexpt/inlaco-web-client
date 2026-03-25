import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  removeTemplate,
  uploadTemplate,
  fetchContractTemplates,
} from "@/services/contract-template.service";
import cloudinaryUpload from "@/services/cloudinary.service";
import UploadStrategy from "@/constants/UploadStrategy";

export const ContractTemplateQueryKey = {
  ALL: ["contract-templates"],
  LIST: ({ page, pageSize, sort }) => [
    ...ContractTemplateQueryKey.ALL,
    "list",
    page,
    pageSize,
    sort,
  ],
};

export function useContractTemplates({ page = 0, pageSize = 12, sort } = {}) {
  return useQuery({
    queryKey: ContractTemplateQueryKey.LIST({ page, pageSize, sort }),
    queryFn: () => fetchContractTemplates({ page, pageSize, sort }),
    staleTime: 1000 * 60 * 4, // cache 4 min
  });
}

export function useUploadContractTemplate({ onSuccess, ...options }) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async ({ name, description, file, type }) => {
      const cldResponse = await cloudinaryUpload(
        file,
        UploadStrategy.CONTRACT_TEMPLATE,
        { name },
      );
      return uploadTemplate({ name, description, type }, cldResponse.asset_id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(ContractTemplateQueryKey.ALL);
      onSuccess?.(data, variables, context);
    },
  });
}

export function useRemoveContractTemplate({ onInit, onSuccess, ...options }) {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (id) => {
      onInit(id);
      removeTemplate(id);
    },
    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries(ContractTemplateQueryKey.ALL);
      onSuccess?.(data, id, context);
    },
  });
}

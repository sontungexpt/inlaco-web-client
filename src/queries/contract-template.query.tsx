import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import UploadStrategy from "@/constants/UploadStrategy";

import cloudinaryUpload from "@/services/cloudinary.service";

import {
  fetchContractTemplates,
  removeTemplate,
  uploadTemplate,
  type FetchContractTemplatesParams,
} from "@/services/contract-template.service";

import type {
  ContractTemplate,
  NewContractTemplateRequest,
} from "@/types/api/contract-template.api";

export const ContractTemplateQueryKey = {
  ALL: ["contract-templates"] as const,
  LIST: ({ page, pageSize, sort, filter }: FetchContractTemplatesParams) =>
    [
      ...ContractTemplateQueryKey.ALL,
      "list",
      page,
      pageSize,
      sort,
      filter,
    ] as const,
};

export function useContractTemplates({
  page = 0,
  pageSize = 12,
  sort,
  filter,
}: FetchContractTemplatesParams = {}) {
  return useQuery({
    queryKey: ContractTemplateQueryKey.LIST({
      page,
      pageSize,
      sort,
      filter,
    }),

    queryFn: () =>
      fetchContractTemplates({
        page,
        pageSize,
        sort,
        filter,
      }),

    staleTime: 1000 * 60 * 4,
  });
}

export interface UploadContractTemplatePayload
  extends NewContractTemplateRequest {
  file: File;
}

interface UseUploadContractTemplateOptions {
  onSuccess?: (
    data: ContractTemplate,
    variables: UploadContractTemplatePayload,
    context: unknown,
  ) => void;
}

export function useUploadContractTemplate({
  onSuccess,
  ...options
}: UseUploadContractTemplateOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: async ({
      name,
      description,
      file,
      type,
    }: UploadContractTemplatePayload) => {
      const cldResponse = await cloudinaryUpload(
        file,
        UploadStrategy.CONTRACT_TEMPLATE,
        { name },
      );

      return uploadTemplate(
        {
          name,
          description,
          type,
        },
        cldResponse.asset_id,
      );
    },

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ContractTemplateQueryKey.ALL,
      });

      onSuccess?.(data, variables, context);
    },
  });
}

interface UseRemoveContractTemplateOptions {
  onInit?: (id: string) => void;

  onSuccess?: (data: void, id: string, context: unknown) => void;
}

export function useRemoveContractTemplate({
  onInit,
  onSuccess,
  ...options
}: UseRemoveContractTemplateOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,

    mutationFn: async (id: string) => {
      onInit?.(id);

      await removeTemplate(id);
    },

    onSuccess: (data, id, context) => {
      queryClient.invalidateQueries({
        queryKey: ContractTemplateQueryKey.ALL,
      });

      onSuccess?.(data, id, context);
    },
  });
}

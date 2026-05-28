import type {
  ContractTemplate,
  FetchContractTemplatesParams,
  NewContractTemplateRequest,
} from "@/types/api/contract-template.api";

import { privateRequest } from "@/utils/request";
import { flattenFilter } from "@/utils/filter";
import { PageableResponse } from "@/types/api/shared/base.api";
import ContractTemplateEndpoint from "@/endpoints/contract-template.endpoint";

export const fetchContractTemplates = async ({
  page,
  pageSize,
  sort,
  filter,
}: FetchContractTemplatesParams): Promise<
  PageableResponse<ContractTemplate>
> => {
  const response = await privateRequest.get<PageableResponse<ContractTemplate>>(
    ContractTemplateEndpoint.GET_ALL_TEMPLATES,
    {
      params: {
        page,
        size: pageSize,
        sort,
        ...flattenFilter(filter),
      },
    },
  );

  return response.data;
};

export const uploadTemplate = async (
  template: NewContractTemplateRequest,
  templateFileAssetId: string,
): Promise<ContractTemplate> => {
  const response = await privateRequest.post<ContractTemplate>(
    ContractTemplateEndpoint.UPLOAD_TEMPLATE,
    template,
    {
      params: {
        templateFileAssetId,
      },
    },
  );

  return response.data;
};

export const removeTemplate = async (templateId: string): Promise<void> => {
  await privateRequest.delete(
    ContractTemplateEndpoint.REMOVE_TEMPLATE(templateId),
  );
};

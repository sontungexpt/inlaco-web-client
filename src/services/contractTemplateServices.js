import { privateRequest } from "@/utils/request";
import ContractTemplateEndpoint from "@/endpoints/ContractTemplateEndpoint";

export const fetchContractTemplates = async ({ page, pageSize, sort }) => {
  const response = await privateRequest.get(
    ContractTemplateEndpoint.GET_ALL_TEMPLATES,
    {
      params: {
        page,
        size: pageSize,
        sort,
      },
    },
  );
  return response.data;
};

export const uploadTemplate = async (template, templateFileAssetId) => {
  const response = await privateRequest.post(
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

export const removeTemplate = async (templateId) => {
  const response = await privateRequest.delete(
    ContractTemplateEndpoint.REMOVE_TEMPLATE(templateId),
  );
  return response.data;
};

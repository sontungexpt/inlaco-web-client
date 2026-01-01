import { privateRequest } from "@/utils/request";
import ContractTemplateEndpoint from "@/endpoints/ContractTemplateEndpoint";

export const fetchContractTemplates = async ({ page, pageSize, sort }) => {
  try {
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
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const uploadTemplate = async (template, templateFilePubId) => {
  try {
    const response = await privateRequest.post(
      ContractTemplateEndpoint.UPLOAD_TEMPLATE,
      template,
      {
        params: {
          templateFilePubId,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const removeTemplate = async (templateId) => {
  try {
    const response = await privateRequest.delete(
      ContractTemplateEndpoint.REMOVE_TEMPLATE(templateId),
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

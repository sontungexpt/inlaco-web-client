import SupplyRequestEndpoint from "@/endpoints/SupplyRequestEndpoint";
import { flattenFilter } from "@/utils/filter";
import { privateRequest } from "@/utils/request";

export const fetchSupplyRequests = async ({ page, pageSize, filter }) => {
  const response = await privateRequest.get(
    SupplyRequestEndpoint.GET_SUPPLY_REQUESTS,
    {
      params: {
        page,
        size: pageSize,
        ...flattenFilter(filter),
      },
    },
  );
  return response.data;
};

export const fetchUniqueSupplyRequest = async (id) => {
  const response = await privateRequest.get(
    SupplyRequestEndpoint.GET_UNIQUE_SUPPLY_REQUEST(id),
  );
  return response.data;
};

export const reviewSupplyRequest = async (id, accepted) => {
  const response = await privateRequest.post(
    SupplyRequestEndpoint.REVIEW_SUPPLY_REQUEST(id),
    null,
    {
      params: {
        accepted,
      },
    },
  );
  return response.data;
};

export const createSupplyRequest = async (
  request,
  detailFileAssetId,
  shipImageAssetId,
) => {
  const response = await privateRequest.post(
    SupplyRequestEndpoint.CREATE_SUPPLY_REQUEST,
    request,
    {
      params: {
        detailFileAssetId,
        shipImageAssetId,
      },
    },
  );
  return response.data;
};

import SupplyRequestEndpoint from "@/endpoints/supply-request.endpoint";
import {
  NewSupplyRequest,
  FetchSupplyRequestParams,
} from "@/types/api/supply-request.api";
import { flattenFilter } from "@/utils/filter";
import { privateRequest } from "@/utils/request";

export const fetchSupplyRequests = async ({
  page,
  pageSize,
  filter,
}: FetchSupplyRequestParams) => {
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

export const fetchUniqueSupplyRequest = async (id: string) => {
  const response = await privateRequest.get(
    SupplyRequestEndpoint.GET_UNIQUE_SUPPLY_REQUEST(id),
  );
  return response.data;
};

export const reviewSupplyRequest = async (id: string, accepted: boolean) => {
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
  request: NewSupplyRequest,
  detailFileAssetId?: string,
  shipImageAssetId?: string,
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

import { dateTimeStringToISOString } from "../utils/converter";
import SupplyRequestEndpoint from "@/endpoints/SupplyRequestEndpoint";
import { privateRequest } from "@/utils/request";

const GENERAL = "/v1/crew-rental-requests";

export const fetchSupplyRequests = async ({ page, size, status }) => {
  try {
    const response = await privateRequest.get(
      SupplyRequestEndpoint.GET_SUPPLY_REQUESTS,
      {
        params: {
          page,
          size,
          status,
        },
      },
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const getAllSupplyRequestAPI = async (page, size, status) => {
  try {
    const response = await privateRequest.get(
      `${GENERAL}?page=${page}&size=${size}&status=${status}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getSupplyReqByID_API = async (supplyReqID) => {
  try {
    const response = await privateRequest.get(`${GENERAL}/${supplyReqID}`);
    return response;
  } catch (err) {
    return err.response;
  }
};

export const reviewSupplyReqAPI = async (supplyReqID, accepted) => {
  try {
    const response = await privateRequest.post(
      `${GENERAL}/${supplyReqID}/review?accepted=${accepted}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createSupplyRequest = async (
  request,
  detailFileAssetId,
  shipImageAssetId,
) => {
  try {
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
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

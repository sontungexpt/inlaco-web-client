import { privateRequest } from "@/utils/request";
import MobilizationEndpoint from "@/endpoints/mobilizationEndpoints";

export const fetchMobilizations = async ({ page, pageSize, status }) => {
  const response = await privateRequest.get(
    MobilizationEndpoint.GET_ALL_MOBILIZATIONS,
    {
      params: {
        page,
        size: pageSize,
        status,
      },
    },
  );
  return response.data;
};

export const fetchSpecificMobilization = async (mobilizationID) => {
  try {
    const response = await privateRequest.get(
      MobilizationEndpoint.GET_BY_ID(mobilizationID),
    );
    return response.data;
  } catch (err) {
    console.debug(err);
    throw err;
  }
};

export const getMyMobilizationAPI = async (cardID) => {
  try {
    const response = await privateRequest.get(
      `${MobilizationEndpoint.CURRENT_MOBILIZATION}/${cardID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createMobilizationAPI = async (mobilizationInfo) => {
  try {
    const response = await privateRequest.post(
      `${MobilizationEndpoint.GENERAL}`,
      mobilizationInfo,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const editMobilizationAPI = async (mobilizationID, mobilizationInfo) => {
  try {
    const response = await privateRequest.patch(
      `${MobilizationEndpoint.GENERAL}/${mobilizationID}`,
      mobilizationInfo,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

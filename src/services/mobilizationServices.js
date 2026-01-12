import { privateRequest } from "@/utils/request";
import MobilizationEndpoint from "@/endpoints/mobilizationEndpoints";
import { flattenFilter } from "@/utils/filter";

export const fetchMobilizations = async ({
  page,
  pageSize,
  filter = {
    status: null,
    startDate: null,
    endDate: null,
  },
}) => {
  const response = await privateRequest.get(
    MobilizationEndpoint.GET_ALL_MOBILIZATIONS,
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

export const fetchSpecificMobilization = async (mobilizationID) => {
  const response = await privateRequest.get(
    MobilizationEndpoint.GET_BY_ID(mobilizationID),
  );
  return response.data;
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

export const createMobilization = async (mobilizationInfo) => {
  const response = await privateRequest.post(
    MobilizationEndpoint.CREATE_MOBILIZATION,
    mobilizationInfo,
  );
  return response.data;
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

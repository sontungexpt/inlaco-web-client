import privateRequest from "../utils/privateRequest";
import MobilizationEndpoints from "../endpoints/mobilizationEndpoints";

export const getMyMobilizationAPI = async (cardID) => {
  try {
    const response = await privateRequest.get(
      `${MobilizationEndpoints.CURRENT_MOBILIZATION}/${cardID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getAllMobilizationsAPI = async (page, size, status) => {
  try {
    const response = await privateRequest.get(
      `${MobilizationEndpoints.GENERAL}/pagination?page=${page}&size=${size}&status=${status}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getMobilizationByID_API = async (mobilizationID) => {
  try {
    const response = await privateRequest.get(
      `${MobilizationEndpoints.GENERAL}/${mobilizationID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createMobilizationAPI = async (mobilizationInfo) => {
  try {
    const response = await privateRequest.post(
      `${MobilizationEndpoints.GENERAL}`,
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
      `${MobilizationEndpoints.GENERAL}/${mobilizationID}`,
      mobilizationInfo,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

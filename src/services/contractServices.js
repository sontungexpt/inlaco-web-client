import privateRequest from "../utils/privateRequest";
import ContractEndpoints from "../endpoints/contractEndpoints";

export const getCrewContractsAPI = async (page, size, signed) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoints.GENERAL}?page=${page}&size=${size}&type=LABOR_CONTRACT&signed=${signed}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getCrewContractByID_API = async (contractID) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoints.GENERAL}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getSupplyContractsAPI = async (page, size, signed) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoints.GENERAL}?page=${page}&size=${size}&type=SUPPLY_CONTRACT&signed=${signed}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getSupplyContractByID_API = async (contractID) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoints.GENERAL}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createCrewContractAPI = async (crewMemberID, crewContractInfo) => {
  try {
    const response = await privateRequest.post(
      `${ContractEndpoints.LABOR_GENERAL}/${crewMemberID}`,
      {
        title: crewContractInfo.title,
        initiator: crewContractInfo.initiator,
        signedPartners: crewContractInfo.signedPartners,
        terms: ["Terms 1"],
        activationDate: crewContractInfo.activationDate,
        expiredDate: crewContractInfo.expiredDate,
        type: "LABOR_CONTRACT",
        customAttributes: crewContractInfo.customAttributes,
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createSupplyContractAPI = async (
  supplyReqID,
  supplyContractInfo,
) => {
  try {
    const response = await privateRequest.post(
      `${ContractEndpoints.SUPPLY_GENERAL}/${supplyReqID}`,
      {
        title: supplyContractInfo.title,
        initiator: supplyContractInfo.initiator,
        signedPartners: supplyContractInfo.signedPartners,
        terms: ["Terms 1"],
        activationDate: supplyContractInfo.activationDate,
        expiredDate: supplyContractInfo.expiredDate,
        type: "SUPPLY_CONTRACT",
        customAttributes: supplyContractInfo.customAttributes,
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const editCrewContractAPI = async (contractID, contractInfo) => {
  try {
    const response = await privateRequest.patch(
      `${ContractEndpoints.GENERAL}/${contractID}`,
      {
        title: contractInfo.title,
        initiator: contractInfo.initiator,
        signedPartners: contractInfo.signedPartners,
        terms: ["Terms 1"],
        activationDate: contractInfo.activationDate,
        expiredDate: contractInfo.expiredDate,
        type: "LABOR_CONTRACT",
        customAttributes: contractInfo.customAttributes,
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const editSupplyContractAPI = async (contractID, contractInfo) => {
  try {
    const response = await privateRequest.patch(
      `${ContractEndpoints.GENERAL}/${contractID}`,
      {
        title: contractInfo.title,
        initiator: contractInfo.initiator,
        signedPartners: contractInfo.signedPartners,
        terms: [],
        activationDate: contractInfo.activationDate,
        expiredDate: contractInfo.expiredDate,
        type: "SUPPLY_CONTRACT",
        customAttributes: contractInfo.customAttributes,
      },
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const activeContractByID_API = async (contractID) => {
  try {
    const response = await privateRequest.post(
      `${ContractEndpoints.ACTIVE}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

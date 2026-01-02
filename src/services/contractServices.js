import { privateRequest } from "@/utils/request";
import ContractEndpoint from "@/endpoints/ContractEndpoint";

export const fetchCrewContracts = async ({
  page,
  size,
  signed,
  type = "LABOR_CONTRACT",
}) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_ALL_CONTRACTS,
    {
      params: {
        page,
        size,
        signed,
        type,
      },
    },
  );
  return response.data;
};

export const fetchUniqueContract = async (contractID) => {
  const response = await privateRequest.get(
    ContractEndpoint.GET_CONTRACT_BY_ID(contractID),
  );
  return response.data;
};

export const getCrewContractByID_API = async (contractID) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoint.GENERAL}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const getSupplyContractByID_API = async (contractID) => {
  try {
    const response = await privateRequest.get(
      `${ContractEndpoint.GENERAL}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

export const createLaborContract = async (
  crewMemberID,
  contract,
  contractFilePubId,
) => {
  const response = await privateRequest.post(
    ContractEndpoint.CREATE_LABOR_CONTRACT(crewMemberID),
    {
      ...contract,
      type: "LABOR_CONTRACT",
    },
    {
      params: {
        contractFilePubId,
      },
    },
  );
  return response.data;
};

export const createSupplyContract = async (supplyRequestId, contract) => {
  const response = await privateRequest.post(
    ContractEndpoint.CREATE_SUPPLY_CONTRACT(supplyRequestId),
    contract,
  );
  return response.data;
};

export const editCrewContractAPI = async (contractID, contractInfo) => {
  try {
    const response = await privateRequest.patch(
      `${ContractEndpoint.GENERAL}/${contractID}`,
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
      `${ContractEndpoint.GENERAL}/${contractID}`,
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
      `${ContractEndpoint.ACTIVE}/${contractID}`,
    );
    return response;
  } catch (err) {
    return err.response;
  }
};

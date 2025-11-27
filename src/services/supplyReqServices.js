import privateRequest from "../utils/privateRequest";
import { dateTimeStringToISOString } from "../utils/converter";

const GENERAL = "/v1/crew-rental-requests";

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

export const createSupplyRequestAPI = async (supplyReqInfo) => {
  try {
    const response = await privateRequest.post(`${GENERAL}`, {
      totalCrewNeeded: 1,
      positionDetail: {}, //
      companyName: supplyReqInfo.compInfo.compName,
      companyAddress: supplyReqInfo.compInfo.compAddress,
      companyPhone: supplyReqInfo.compInfo.compPhoneNumber,
      companyEmail: supplyReqInfo.compInfo.compEmail,
      representativeName: supplyReqInfo.compInfo.representative,
      representativeTitle: supplyReqInfo.compInfo.representativePos,

      estimatedDepartureTime: dateTimeStringToISOString(
        supplyReqInfo.requestInfo.timeOfDeparture,
      ),
      departurePoint: supplyReqInfo.requestInfo.departureLocation,
      departureUNLOCODE: supplyReqInfo.requestInfo.UN_LOCODE_DepartureLocation,

      estimatedArrivalTime: dateTimeStringToISOString(
        supplyReqInfo.requestInfo.estimatedTimeOfArrival,
      ),
      arrivalPoint: supplyReqInfo.requestInfo.arrivalLocation,
      arrivalUNLOCODE: supplyReqInfo.requestInfo.UN_LOCODE_ArrivalLocation,
      shipInfo: {
        // imageUrl: supplyReqInfo.requestInfo.shipImage, //
        imonumber: supplyReqInfo.requestInfo.shipIMO,
        countryISO: supplyReqInfo.requestInfo.shipNationality,
        name: supplyReqInfo.requestInfo.shipName,
        shipType: supplyReqInfo.requestInfo.shipType,
      },
      status: "PENDING",
    });
    return response;
  } catch (err) {
    return err.response;
  }
};

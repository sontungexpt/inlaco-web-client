// contractForm.mapper.ts
import { datetimeToISO } from "@utils/converter";

export const mapValuesToRequestBody = (values) => {
  return {
    status: "PENDING",
    partnerName: values.compName,
    partnerPhone: values.phoneNumber,
    partnerEmail: values.email,
    partnerAddress: "Temporary Address",

    startDate: datetimeToISO(values.mobilizationInfo.timeOfDeparture),
    endDate: datetimeToISO(values.mobilizationInfo.estimatedTimeOfArrival),

    shipInfo: {
      imageUrl: values.mobilizationInfo.shipImage,
      imonumber: values.mobilizationInfo.shipIMO,
      name: values.mobilizationInfo.shipName,
      countryISO: values.mobilizationInfo.shipNationality,
      shipType: values.mobilizationInfo.shipType,
    },

    crewMembers: values.mobilizedCrewMembers,
    // crewMembers: [
    //   {
    //     cardId: "202500001",
    //     professionalPosition: "Thợ máy",
    //   },
    //   {
    //     cardId: "202500002",
    //     professionalPosition: "Thuyền phó",
    //   },
    // ],
  };
};

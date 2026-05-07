import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";
import { NewMobilizationSchedule } from "@/types/api/mobilization.api";

export const mapValuesToRequestBody = (
  values: FormValues,
  contractId: string,
): NewMobilizationSchedule => {
  return {
    contractId: contractId,

    partnerName: values.partnerName,
    partnerPhone: values.partnerPhone,
    partnerEmail: values.partnerEmail,
    partnerAddress: values.partnerAddress,

    shipInfo: {
      image: values.shipInfo.image as string,
      imoNumber: values.shipInfo.imonumber,
      name: values.shipInfo.name,
      countryISO: values.shipInfo.countryISO,
      type: values.shipInfo.shipType,
    },

    startDate: datetimeToISO(values.startDate) as string,
    endDate: datetimeToISO(values.endDate) as string,
    crews: values.crews.map((crew) => ({
      fullName: crew.fullName,
      employeeCardId: crew.employeeCardId,
      rankOnBoard: crew.rankOnBoard,
      startDate: datetimeToISO(crew.startDate) as string,
      endDate: datetimeToISO(crew.endDate) as string,
    })),
  };
};

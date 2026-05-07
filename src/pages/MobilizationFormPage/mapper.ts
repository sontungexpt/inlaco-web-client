import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";
import { NewMobilizationSchedule } from "@/types/api/mobilization.api";
import { ShipInfoRequest } from "@/types/api/shared/ship-info.api";

export const mapValuesToRequestBody = (
  values: FormValues,
  contractId: string,
  shipImageAssetId?: string,
): NewMobilizationSchedule => {
  return {
    contractId: contractId,

    partnerName: values.partnerName,
    partnerPhone: values.partnerPhone,
    partnerEmail: values.partnerEmail,
    partnerAddress: values.partnerAddress,

    shipInfo: {
      image: shipImageAssetId,
      name: values.shipInfo.name,
      countryISO: values.shipInfo.countryISO,
      type: values.shipInfo.shipType,
    } as ShipInfoRequest,

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

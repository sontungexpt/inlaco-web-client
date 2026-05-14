import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";
import {
  NewAssignedCrew,
  NewMobilizationSchedule,
} from "@/types/api/mobilization.api";
import { ShipInfoRequest } from "@/types/api/shared/ship-info.api";
import { CrewSupplyContract } from "@/types/api/contract.api";

export const mapToFormValues = (
  currentFormValues: FormValues,
  contract: CrewSupplyContract,
): FormValues => {
  const laborPartner = contract.partners?.[0];

  return {
    partnerName: laborPartner?.name ?? currentFormValues.partnerName,
    partnerPhone: laborPartner?.phone ?? currentFormValues.partnerPhone,
    partnerEmail: laborPartner?.email ?? currentFormValues.partnerEmail,
    partnerAddress: laborPartner?.address ?? currentFormValues.partnerAddress,

    startDate: currentFormValues.startDate,
    endDate: currentFormValues.endDate,

    shipInfo: contract.shipInfo
      ? {
          image: contract.shipInfo.image,
          name: contract.shipInfo.name,
          countryISO: contract.shipInfo.countryISO,
          shipType: contract.shipInfo.type,
        }
      : currentFormValues.shipInfo,

    crews: currentFormValues.crews,
  };
};

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
    })) as NewAssignedCrew[],
  };
};

import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";

export interface NewShipSchedule {
  partnerName: string;
  partnerPhone: string;
  partnerEmail: string;
  partnerAddress: string;
  startDate: string;
  endDate: string;
  shipInfo: {
    image: string;
    imoNumber: string;
    name: string;
    countryISO: string;
    type: string;
  };
}

export const mapValuesToNewShipSchedule = (
  values: FormValues,
): NewShipSchedule => {
  return {
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
  };
};

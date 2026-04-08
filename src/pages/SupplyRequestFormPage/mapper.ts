import { datetimeToISO } from "@/utils/converter";
import { FormValues } from "./schema";
import { NewSupplyRequest } from "@/types/api/supply-request.api";

export const mapValuesToNewSupplyRequest = (
  values: FormValues,
  detailFileAssetId: string,
  shipImageAssetId: string,
): NewSupplyRequest => {
  return {
    companyName: values.companyName,
    companyPhone: values.companyPhone,
    companyAddress: values.companyAddress,
    companyEmail: values.companyEmail,
    companyRepresentor: values.companyRepresentor,
    companyRepresentorPosition: values.companyRepresentorPosition,
    rentalStartDate: datetimeToISO(values.rentalStartDate) as string,
    rentalEndDate: datetimeToISO(values.rentalEndDate) as string,
    detailFile: detailFileAssetId,

    shipInfo: {
      image: shipImageAssetId,
      imoNumber: values.shipInfo.IMONumber,
      name: values.shipInfo.name,
      countryISO: values.shipInfo.countryISO,
      type: values.shipInfo.type,
      description: values.shipInfo.description,
    },
  };
};

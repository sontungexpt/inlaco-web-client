import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  companyName: "",
  companyPhone: "",
  companyAddress: "",
  companyEmail: "",
  companyRepresentor: "",
  companyRepresentorPosition: "",
  rentalStartDate: null,
  rentalEndDate: null,
  detailFile: null,

  shipInfo: {
    image: null,
    IMONumber: "",
    name: "",
    countryISO: "",
    type: "",
    description: "",
  },
};

import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  partnerName: "",
  partnerPhone: "",
  partnerEmail: "",
  partnerAddress: "",

  startDate: undefined,
  endDate: undefined,

  shipInfo: {
    image: "",
    imonumber: "",
    name: "",
    countryISO: "",
    shipType: "",
  },
};

import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  partnerName: "",
  partnerPhone: "",
  partnerEmail: "",
  partnerAddress: "",

  startDate: new Date(),
  endDate: undefined,

  shipInfo: {
    image: "",
    name: "",
    countryISO: "",
    shipType: "",
  },

  crews: [],
};

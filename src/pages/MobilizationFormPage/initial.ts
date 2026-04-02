import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  status: "PENDING",

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

  crews: [],
};

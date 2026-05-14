import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  shipInfo: {
    name: "",
    imoNumber: "",
    countryISO: "",
    type: "",
    image: null,
  },

  route: "",

  departurePort: "",
  arrivalPort: "",

  departureTime: "",
  arrivalTime: "",

  crews: [],
};

import { datetimeToISO } from "@utils/converter";

export const mapValuesToRequestBody = (values) => ({
  ...values,
  startDate: datetimeToISO(values.startDate),
  endDate: datetimeToISO(values.endDate),
});

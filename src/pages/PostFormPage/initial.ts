import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  title: "",
  content: "",
  type: "",
  description: "",
  company: "",

  // Recruitment specific fields
  position: "",
  expectedSalary: "",
  workLocation: "",
  recruitmentStartDate: undefined,
  recruitmentEndDate: undefined,

  image: null,
  attachments: undefined,
};

import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  fullName: "",
  gender: "",
  phoneNumber: "",
  email: "",
  address: "",
  languageSkills: "",
  experiences: "",
  cvFile: null,
};

export const GENDERS = [
  { label: "Nam", value: "MALE" },
  { label: "Nữ", value: "FEMALE" },
  { label: "Khác", value: "OTHER" },
];

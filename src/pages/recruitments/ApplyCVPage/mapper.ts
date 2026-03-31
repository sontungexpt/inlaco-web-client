import { ApplyRecruitmentRequest } from "@/types/api/recruitment.api";
import { FormValues } from "./schema";
import { FileRequest } from "@/services/cloudinary.service";

export const mapValuesToRequestBody = (
  values: FormValues,
): ApplyRecruitmentRequest => ({
  fullName: values.fullName,
  phoneNumber: values.phoneNumber,
  email: values.email,
  gender: values.gender,
  cvFile: values.cvFile,
  address: values.address,
  languageSkills: values.languageSkills as string,
  experiences: values.experiences,
});

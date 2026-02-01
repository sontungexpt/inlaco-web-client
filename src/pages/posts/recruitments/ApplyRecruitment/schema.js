import {
  optionalString,
  requiredEmail,
  requiredFile,
  requiredString,
  requiredVnPhoneNumber,
} from "@/utils/yupHelpers";

import * as Yup from "yup";

export const FORM_SCHEMA = Yup.object().shape({
  fullName: requiredString("Họ và tên không được để trống"),
  gender: requiredString("Giới tính không được để trống"),
  phoneNumber: requiredVnPhoneNumber("Vui lòng nhập số điện thoại"),
  email: requiredEmail("Vui lòng nhập email"),
  address: requiredString("Địa chỉ không được để trống"),
  experiences: requiredString("Vui lòng nhập kinh nghiệm của bạn"),
  languageSkills: optionalString(),
  cvFile: requiredFile("Vui lòng thêm CV"),
});

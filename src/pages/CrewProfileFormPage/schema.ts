import * as Yup from "yup";
import {
  requiredString,
  dateMax,
  requiredVnPhoneNumber,
  requiredEmail,
} from "@/utils/validation/yupHelpers";

export const FORM_SCHEMA = Yup.object().shape({
  fullName: requiredString("Họ và tên không được để trống"),
  dob: dateMax(new Date(), "Ngày sinh không hợp lệ"),
  gender: requiredString("Vui lòng chọn giới tính"),
  address: requiredString("Vui lòng nhập địa chỉ"),
  phoneNumber: requiredVnPhoneNumber(),
  email: requiredEmail(),
});

export type FormValues = Yup.InferType<typeof FORM_SCHEMA>;

import * as Yup from "yup";
import { now } from "@/utils/date";
import {
  requiredString,
  dateMax,
  requiredVnPhoneNumber,
  requiredEmail,
} from "@/utils/yupHelpers";

export const FORM_SCHEMA = Yup.object().shape({
  fullName: requiredString("Họ và tên không được để trống"),
  dob: dateMax(now(), "Ngày sinh không hợp lệ"),
  gender: requiredString("Vui lòng chọn giới tính"),
  address: requiredString("Vui lòng nhập địa chỉ"),
  phoneNumber: requiredVnPhoneNumber(),
  email: requiredEmail(),
});

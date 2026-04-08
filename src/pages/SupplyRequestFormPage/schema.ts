import {
  dateAfter,
  dateBefore,
  requiredEmail,
  requiredFile,
  requiredString,
  requiredVnPhoneNumber,
} from "@/utils/validation/yupHelpers";
import * as Yup from "yup";

export const FORM_SCHEMA = Yup.object().shape({
  companyName: requiredString("Tên công ty không được để trống"),
  companyAddress: requiredString("Địa chỉ công ty không được để trống"),
  companyPhone: requiredVnPhoneNumber("Số điện thoại không hợp lệ"),
  companyEmail: requiredEmail(),
  companyRepresentor: requiredString("Tên người đại diện không được để trống"),
  companyRepresentorPosition: requiredString(
    "Chức vụ người đại diện không được để trống",
  ),

  rentalStartDate: dateBefore("rentalEndDate").required(
    "Thời gian bắt đầu thuê không được để trống",
  ),
  rentalEndDate: dateAfter("rentalStartDate").required(
    "Thời gian kết thúc thuê không được để trống",
  ),
  detailFile: requiredFile("Vui lòng tải lên tệp chi tiết"),
  shipInfo: Yup.object().shape({
    name: requiredString("Tên cửa tàu không được để trống"),
    IMONumber: requiredString("Số IMO của tàu không được để trống"),
    countryISO: requiredString("Quốc tịch không được để trống"),
    type: requiredString("Loại tàu không được để trống"),
    description: Yup.string(),
    image: requiredFile("Vui lồng tải lên hình ảnh tàu"),
  }),
});

export type FormValues = Yup.InferType<typeof FORM_SCHEMA>;

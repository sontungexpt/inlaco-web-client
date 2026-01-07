// schema.js
import * as Yup from "yup";
import Regex from "@/constants/Regex";
import {
  requiredString,
  optionalString,
  requiredNumber,
  requiredFile,
  dateBefore,
  dateAfter,
} from "@/utils/yupHelpers";

export const SCHEMA = Yup.object({
  title: requiredString("Tiêu đề không được để trống"),

  partyA: Yup.object({
    compName: requiredString("Tên công ty không được để trống"),
    compAddress: requiredString("Địa chỉ không được để trống"),
    compPhoneNumber: requiredString("SĐT không được để trống").matches(
      Regex.VN_PHONE,
      "SĐT không hợp lệ",
    ),
    representative: requiredString("Người đại diện không được để trống"),
    representativePos: requiredString("Chức vụ không được để trống"),
  }),

  partyB: Yup.object({
    compName: requiredString("Tên công ty không được để trống"),
    compAddress: requiredString("Địa chỉ không được để trống"),
    compPhoneNumber: requiredString("SĐT không được để trống").matches(
      Regex.VN_PHONE,
      "SĐT không hợp lệ",
    ),
    representative: requiredString("Người đại diện không được để trống"),
    representativePos: requiredString("Chức vụ không được để trống"),
  }),

  contractInfo: Yup.object({
    startDate: dateBefore("endDate", "Ngày bắt đầu phải trước ngày kết thúc"),
    endDate: dateAfter("startDate", "Ngày kết thúc phải sau ngày bắt đầu"),
    numOfCrewMember: requiredNumber(
      "Số thuyền viên không được để trống",
      1,
      "Phải có ít nhất 1 thuyền viên",
    ),
  }),

  shipInfo: Yup.object({
    image: requiredFile("Vui lòng tải lên hình ảnh tàu"),
    IMONumber: requiredString("Số IMO không được để trống"),
    name: requiredString("Tên tàu không được để trống"),
    countryISO: requiredString("Quốc tịch tàu không được để trống"),
    type: requiredString("Loại tàu không được để trống"),
    description: optionalString(),
  }),

  contractFile: requiredFile("Vui lòng tải lên hợp đồng bản giấy"),
});

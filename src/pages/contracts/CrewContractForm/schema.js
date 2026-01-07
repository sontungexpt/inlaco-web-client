import * as Yup from "yup";
import Regex from "@/constants/Regex";
import { now, yesterday } from "@/utils/date";
import {
  requiredString,
  optionalString,
  requiredNumber,
  optionalNumber,
  requiredFile,
  dateAfter,
  dateMax,
} from "@/utils/yupHelpers";
import { dateBefore } from "@/utils/yupHelper";

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
    fullName: requiredString("Họ và tên không được để trống"),

    dob: dateMax(now(), "Ngày sinh không hợp lệ"),

    birthPlace: requiredString("Nơi sinh không được để trống"),
    nationality: requiredString("Quốc tịch không được để trống"),

    phone: optionalString().matches(Regex.VN_PHONE, "SĐT không hợp lệ"),

    permanentAddr: requiredString("Địa chỉ thường trú không được để trống"),
    temporaryAddr: requiredString("Địa chỉ tạm trú không được để trống"),

    ciNumber: requiredString("Số CCCD không được để trống").matches(
      Regex.CI_NUMBER,
      "Số CCCD không hợp lệ",
    ),

    ciIssueDate: dateMax(now(), "Ngày cấp không hợp lệ"),

    ciIssuePlace: requiredString("Nơi cấp không được để trống"),
  }),

  jobInfo: Yup.object({
    startDate: dateBefore(
      "endDate",
      "Ngày bắt đầu phải trước ngày kết thúc",
    ).min(yesterday(), "Ngày bắt đầu không hợp lệ"),
    endDate: dateAfter("startDate", "Ngày kết thúc phải sau ngày bắt đầu"),
    workingLocation: requiredString("Địa điểm làm việc không được để trống"),
    position: requiredString("Vị trí chuyên môn không được để trống"),
    jobDescription: requiredString("Mô tả công việc không được để trống"),
  }),

  salaryInfo: Yup.object({
    basicSalary: requiredNumber(
      "Lương cơ bản không được để trống",
      0,
      "Lương cơ bản không hợp lệ",
    ),

    allowance: optionalNumber(0, "Phụ cấp không hợp lệ"),

    receiveMethod: requiredString("Hình thức trả lương không được để trống"),

    payday: requiredString("Thời hạn trả lương không được để trống"),

    salaryReviewPeriod: requiredString(
      "Thời hạn xét nâng lương không được để trống",
    ),

    bankAccount: Yup.string().when("receiveMethod", {
      is: "Chuyển khoản ngân hàng",
      then: () => requiredString("Tài khoản ngân hàng không được để trống"),
      otherwise: () => Yup.string().notRequired(),
    }),

    bankName: Yup.string().when("receiveMethod", {
      is: "Chuyển khoản ngân hàng",
      then: () => requiredString("Tên ngân hàng không được để trống"),
      otherwise: () => Yup.string().notRequired(),
    }),
  }),

  contractFile: requiredFile("Vui lòng tải lên hợp đồng bản giấy"),
});

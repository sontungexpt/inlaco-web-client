import * as Yup from "yup";
import Regex from "@/utils/validation/Regex";
import { now } from "@/utils/date";
import {
  requiredString,
  optionalString,
  dateAfter,
  dateBefore,
  dateMax,
  optionalFiles,
  optionalFile,
} from "@/utils/validation/yupHelpers";

export const SCHEMA = Yup.object({
  title: requiredString("Tiêu đề không được để trống"),

  employer: Yup.object({
    companyName: requiredString("Tên công ty không được để trống"),
    companyAddress: requiredString("Địa chỉ không được để trống"),

    companyPhone: requiredString("SĐT không được để trống").matches(
      Regex.VN_PHONE,
      "SĐT không hợp lệ",
    ),

    representativeName: requiredString("Người đại diện không được để trống"),
    representativePosition: requiredString("Chức vụ không được để trống"),
  }),

  employee: Yup.object({
    fullName: requiredString("Họ và tên không được để trống"),
    email: requiredString("Email không được để trống"),

    birthDate: dateMax(now(), "Ngày sinh không hợp lệ"),
    birthPlace: requiredString("Nơi sinh không được để trống"),
    nationality: requiredString("Quốc tịch không được để trống"),

    phoneNumber: optionalString().matches(Regex.VN_PHONE, "SĐT không hợp lệ"),

    permanentAddress: requiredString("Địa chỉ thường trú không được để trống"),
    temporaryAddress: requiredString("Địa chỉ tạm trú không được để trống"),

    idCardNumber: requiredString("Số CCCD không được để trống").matches(
      Regex.CARD_ID_NUMBER,
      "Số CCCD không hợp lệ",
    ),
    idCardIssueDate: dateMax(now(), "Ngày cấp không hợp lệ"),
    idCardIssuePlace: requiredString("Nơi cấp không được để trống"),
  }),

  jobInfo: Yup.object({
    startDate: dateBefore("endDate", "Ngày bắt đầu phải trước ngày kết thúc"),

    endDate: dateAfter("startDate", "Ngày kết thúc phải sau ngày bắt đầu"),

    position: requiredString("Vị trí chuyên môn không được để trống"),

    workLocation: requiredString("Địa điểm làm việc không được để trống"),

    jobDescription: requiredString("Mô tả công việc không được để trống"),
  }),

  salaryInfo: Yup.object({
    baseSalary: requiredString("Lương cơ bản không được để trống"),
    allowance: optionalString(),

    paymentMethod: requiredString("Hình thức trả lương không được để trống"),

    payday: requiredString("Thời hạn trả lương không được để trống"),

    salaryReviewCycle: requiredString(
      "Thời hạn xét nâng lương không được để trống",
    ),

    bankName: Yup.string().when("paymentMethod", {
      is: "Chuyển khoản ngân hàng",
      then: () => requiredString("Tên ngân hàng không được để trống"),
      otherwise: () => Yup.string().notRequired(),
    }),

    bankAccountNumber: Yup.string().when("paymentMethod", {
      is: "Chuyển khoản ngân hàng",
      then: () => requiredString("Tài khoản ngân hàng không được để trống"),
      otherwise: () => Yup.string().notRequired(),
    }),
  }),

  contractFile: optionalFile(),
  attachmentFiles: optionalFiles(),
});

export type FormValues = Yup.InferType<typeof SCHEMA>;

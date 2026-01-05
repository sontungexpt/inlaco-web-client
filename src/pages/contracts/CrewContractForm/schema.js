import * as Yup from "yup";
import Regex from "@/constants/Regex";
import { now, yesterday } from "@/utils/date";

export const SCHEMA = Yup.object().shape({
  title: Yup.string().required("Tiêu đề không được để trống"),
  partyA: Yup.object().shape({
    compName: Yup.string().required("Tên công ty không được để trống"),
    compAddress: Yup.string().required("Địa chỉ không được để trống"),
    compPhoneNumber: Yup.string()
      .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
      .required("SĐT không được để trống"),
    representative: Yup.string().required("Người đại diện không được để trống"),
    representativePos: Yup.string().required("Chức vụ không được để trống"),
  }),

  partyB: Yup.object().shape({
    fullName: Yup.string().required("Họ và tên không được để trống"),
    dob: Yup.date()
      .max(now(), "Ngày sinh không hợp lệ")
      .required("Ngày sinh không được để trống"),
    birthPlace: Yup.string().required("Nơi sinh không được để trống"),
    nationality: Yup.string().required("Quốc tịch không được để trống"),
    phone: Yup.string().matches(Regex.VN_PHONE, "SĐT không hợp lệ"),
    permanentAddr: Yup.string().required(
      "Địa chỉ thường trú không được để trống",
    ),
    temporaryAddr: Yup.string().required("Địa chỉ tạm trú không được để trống"),
    ciNumber: Yup.string()
      .matches(Regex.CI_NUMBER, "Số CCCD không hợp lệ")
      .required("Số căn cước công dân không được để trống"),
    ciIssueDate: Yup.date()
      .max(now(), "Ngày cấp không hợp lệ")
      .required("Ngày cấp không được để trống"),
    ciIssuePlace: Yup.string().required("Nơi cấp không được để trống"),
  }),

  jobInfo: Yup.object().shape({
    startDate: Yup.date()
      .min(yesterday(), "Ngày bắt đầu không hợp lệ")
      .required("Ngày bắt đầu không được để trống")
      .test(
        "is-before-end-date",
        "Ngày bắt đầu phải trước ngày kết thúc",
        function (value) {
          const { endDate } = this.parent; // Access sibling field endDate
          return !endDate || value < endDate;
        },
      ),

    endDate: Yup.date()
      .required("Ngày kết thúc không được để trống")
      .test(
        "is-after-start-date",
        "Ngày kết thúc phải sau ngày bắt đầu",
        function (value) {
          const { startDate } = this.parent; // Access sibling field startDate
          return !startDate || value > startDate;
        },
      ),
    workingLocation: Yup.string().required(
      "Địa điểm làm việc không được để trống",
    ),
    position: Yup.string().required("Vị trí chuyên môn không được để trống"),
    jobDescription: Yup.string().required(
      "Mô tả công việc không được để trống",
    ),
  }),

  salaryInfo: Yup.object().shape({
    basicSalary: Yup.number()
      .min(0, "Lương cơ bản không hợp lệ")
      .required("Lương cơ bản không được để trống"),
    allowance: Yup.number().min(0, "Phụ cấp không hợp lệ"),
    receiveMethod: Yup.string().required(
      "Hình thức trả lương không được để trống",
    ),
    payday: Yup.string().required("Thời hạn trả lương không được để trống"),
    salaryReviewPeriod: Yup.string().required(
      "Thời hạn được xét nâng lương không được để trống",
    ),
    bankAccount: Yup.string().when("receiveMethod", {
      is: "Chuyển khoản ngân hàng",
      then: (schema) =>
        Yup.string().required("Tài khoản ngân hàng không đượcể trống"),
      otherwise: (schema) => Yup.string().notRequired(),
    }),
    bankName: Yup.string().when("receiveMethod", {
      is: "Chuyển khoản ngân hàng",
      then: (schema) =>
        Yup.string().required("Tài khoản ngân hàng không được để trống"),
      otherwise: (schema) => Yup.string().notRequired(),
    }),
  }),
  contractFile: Yup.mixed().required("Vui lòng tải lên hợp đồng bản giấy"),
});

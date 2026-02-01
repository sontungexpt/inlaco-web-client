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
import { dateBefore } from "@/utils/yupHelpers";

export const FORM_SCHEMA = Yup.object({
  type: Yup.string().required("Loại bài viết là bắt buộc"),
  title: Yup.string().required("Tiêu đề của bài viết ko được bỏ trống"),
  content: Yup.string().required("Nội dung bài viết không được để trống"),
  company: Yup.string(),
  description: Yup.string(),
  image: requiredFile(),
  // image: Yup.object({
  //   url: Yup.string().url("Must be a valid URL").nullable(),
  // }),
  attachments: Yup.array().of(
    Yup.object({
      name: Yup.string().required(),
      size: Yup.number().required(),
      type: Yup.string().required(),
    }),
  ),

  // Position (for RECRUITMENT)
  position: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) => Yup.string().required("Vị trí tuyển dụng là bắt buộc"),
    otherwise: (schema) => Yup.string().notRequired(),
  }),
  workLocation: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.string().required("Vị trí làm việc không được để trống"),
    otherwise: (schema) => Yup.string().notRequired(),
  }),
  expectedSalary: Yup.string(),

  recruitmentStartDate: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.date()
        .required()
        .test(
          "is-before-recruitment-end-date",
          "Ngày mở đăng ký phải trước ngày đóng đăng ký",
          function (value) {
            const { recruitmentEndDate } = this.parent; // Access sibling field recruitmentEndDate
            return !recruitmentEndDate || value < recruitmentEndDate;
          },
        ),
    otherwise: (schema) => Yup.date().notRequired(),
  }),
  recruitmentEndDate: Yup.string().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      Yup.date()
        .required()
        .test(
          "is-after-recruiment-start-date",
          "Ngày đóng đăng ký phải sau ngày bắt đầu mở đăng ký",
          function (value) {
            const { recruitmentStartDate } = this.parent; // Access sibling field recruitmentStartDate
            return !recruitmentStartDate || value > recruitmentStartDate;
          },
        ),
    otherwise: (schema) => Yup.date().notRequired(),
  }),
});

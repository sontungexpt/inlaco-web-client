import * as Yup from "yup";
import {
  date,
  optionalFiles,
  optionalString,
  requiredFile,
  requiredString,
  string,
} from "@/utils/validation/yupHelpers";

export const FORM_SCHEMA = Yup.object({
  type: Yup.string().required("Loại bài viết là bắt buộc"),
  title: requiredString("Tiêu đề của bài viết ko được bỏ trống"),
  content: requiredString("Nội dung bài viết không được để trống"),
  company: optionalString(),
  description: optionalString(),
  image: requiredFile("Vui lòng tải lên hình ảnh bài viết"),
  attachments: optionalFiles(),
  position: string().when("type", {
    is: "RECRUITMENT",
    then: (s) => s.required("Vị trí tuyển dụng là bắt buộc"),
    otherwise: (s) => s.notRequired(),
  }),
  workLocation: string().when("type", {
    is: "RECRUITMENT",
    then: (s) => s.required("Vị trí làm việc không được để trống"),
    otherwise: (s) => s.notRequired(),
  }),
  expectedSalary: optionalString(),
  recruitmentStartDate: date().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      schema
        .required()
        .max(
          Yup.ref("recruitmentEndDate"),
          "Ngày bắt đầu mở đăng ký phải trước ngày đóng đăng ký",
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  recruitmentEndDate: date().when("type", {
    is: "RECRUITMENT",
    then: (schema) =>
      schema
        .required()
        .min(
          Yup.ref("recruitmentStartDate"),
          "Ngày đóng đăng ký phải sau ngày bắt đầu mở đăng ký",
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type FormValues = Yup.InferType<typeof FORM_SCHEMA>;

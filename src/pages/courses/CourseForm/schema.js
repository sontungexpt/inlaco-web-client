import {
  dateAfter,
  dateBefore,
  requiredNumber,
  requiredString,
} from "@/utils/yupHelpers";
import * as Yup from "yup";
export const FORM_SCHEMA = Yup.object().shape({
  instructorName: Yup.string(),
  institute: requiredString("Tên đơn vị đào tạo không được để trống"),
  instituteLogo: Yup.mixed().required(
    "Logo đơn vị đào tạo không được để trống",
  ),
  courseWallpaper: Yup.mixed().required("Hình khóa học không được để trống"),
  courseName: requiredString("Tên khóa học không được để trống"),
  startDate: dateBefore(
    "endDate",
    "Ngày bắt đầu phải trước ngày kết thúc",
  ).required("Ngày bắt đầu không được để trống"),
  endDate: dateAfter(
    "startDate",
    "Ngày kết thúc phải sau ngày bắt đàu",
  ).required("Ngày kết thúc không được để trống"),
  startRegistrationAt: dateBefore(
    "endRegistrationAt",
    "Ngày bắt đầu đăng kí khoá học phải trước ngày kết thúc đăng kí khoá học",
  )
    .required("Ngày bắt đầu đăng kí khoá học không được để trống")
    .concat(
      dateBefore(
        "startDate",
        "Ngày bắt đầu đăng kí khoá học phải trước ngày bắt đầu khoá học",
      ),
    ),
  endRegistrationAt: dateAfter(
    "startRegistrationAt",
    "Ngày kết thúc đăng kí khoá học phải sau ngày bắt đầu đăng kí khoá học",
  )
    .required("Ngày kết thúc đăng kí khoá học không được đễ trống")
    .concat(
      dateBefore(
        "startDate",
        "Ngày kết thúc đăng kí khoá học phải trước ngày bắt đầu khoá học",
      ),
    ),
  description: requiredString("Mô tả khóa học không được để trống"),
  isCertificatedCourse: requiredString("Vui lòng chọn một lựa chọn"),
  limitStudent: requiredNumber("Vui lòng nhập số người học"),
  archivedPosition: requiredString(
    "Vui lòng nhập vị trí đạt được sau khi hoàn thành khoá học",
  ),
});

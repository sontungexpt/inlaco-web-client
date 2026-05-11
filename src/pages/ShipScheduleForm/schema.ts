import {
  dateAfter,
  dateBefore,
  optionalString,
  requiredDate,
  requiredFile,
  requiredString,
} from "@/utils/validation/yupHelpers";
import * as yup from "yup";

export const FORM_SCHEMA = yup.object({
  shipInfo: yup.object({
    name: requiredString("Tên tàu là bắt buộc"),
    imoNumber: requiredString("Vui lồng nhập số IMO"),
    countryISO: requiredString("Vui lồng điền quốc tịch"),
    type: requiredString("Vui lòng điền loại tàu"),
    image: requiredFile("Vui lồng tải lên hình ảnh tàu"),
  }),

  route: requiredString("Tuyến hải trình là bắt buộc"),

  departurePort: requiredString("Cảng đi là bắt buộc"),
  arrivalPort: requiredString("Cảng đến là bắt buộc"),

  departureTime: dateBefore(
    "arrivalTime",
    "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
  ).required("Thời gian khởi hành không được để trống"),
  arrivalTime: dateAfter(
    "departureTime",
    "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
  ).required("Thời gian đến nơi dự kiến không được để trống"),

  crews: yup
    .array()
    .of(
      yup
        .object({
          employeeCardId: requiredString("Chọn thuyền viên"),
          rankOnBoard: requiredString("Chức danh là bắt buộc"),
          note: yup.string(),
        })
        .required(),
    )
    .min(1, "Phải có ít nhất một thuyền viên")
    .required(),
});

export type FormValues = yup.InferType<typeof FORM_SCHEMA>;
export type FormValuesCrews = FormValues["crews"][number];

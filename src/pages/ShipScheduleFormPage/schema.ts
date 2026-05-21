import {
  dateAfter,
  dateBefore,
  optionalString,
  requiredFile,
  requiredString,
} from "@/utils/validation/yupHelpers";
import * as Yup from "yup";

export const FORM_SCHEMA = Yup.object({
  shipInfo: Yup.object({
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

  crews: Yup.array()
    .of(
      Yup.object({
        id: Yup.string(),
        employeeCardId: requiredString("Chọn thuyền viên"),
        note: Yup.string(),
        fullName: optionalString(),
        rankOnBoard: requiredString("Chức danh chuyên môn không được để trống"),

        boardingTime: dateBefore(
          "disembarkTime",
          "Ngày bắt đầu phải trước ngày kết thúc",
        ).required("Ngày bắt đầu không được để trống"),
        disembarkTime: dateAfter(
          "boardingTime",
          "Ngày kết thúc phải sau ngày bắt đàu",
        ).required("Ngày kết thúc không được để trống"),
        isBoardingTimeManual: Yup.boolean(),
        isDisembarkTimeManual: Yup.boolean(),

        boardingPort: requiredString("Cảng bắt đầu là bắt buộc"),
        disembarkPort: requiredString("Cảng kết thúc là bắt buộc"),
        isBoardingPortManual: Yup.boolean(),
        isDisembarkPortManual: Yup.boolean(),
      }).required(),
    )
    .min(1, "Phải có ít nhất một thuyền viên")
    .required(),
});

export type FormValues = Yup.InferType<typeof FORM_SCHEMA>;
export type FormValuesCrew = FormValues["crews"][number];

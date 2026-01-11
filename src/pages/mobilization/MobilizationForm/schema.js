import * as Yup from "yup";
import {
  requiredString,
  dateBefore,
  dateAfter,
  requiredVnPhoneNumber,
  requiredEmail,
} from "@/utils/yupHelpers";

export const FORM_SCHEMA = Yup.object().shape({
  partnerName: requiredString("Tên công ty không được để trống"),
  partnerAddress: requiredString("Địa chỉ công ty không được để trống"),
  partnerPhone: requiredVnPhoneNumber("Vui lòng nhập số điện thoại công ty"),
  partnerEmail: requiredEmail("Vui lòng nhập email công ty"),
  startDate: dateBefore(
    "endDate",
    "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
  )
    .required("Thời gian khởi hành không được sé trống")
    .min(new Date(), "Thời gian khởi hành không hợp lệ"),

  endDate: dateAfter(
    "startDate",
    "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
  ).required("Thời gian đến nơi dự kiến không được để trống"),

  shipInfo: Yup.object().shape({
    imonumber: requiredString("Số IMO tàu không được để trống"),
    name: requiredString("Tên tàu không được để trống"),
    countryISO: requiredString("Quốc tịch tàu không được để trống"),
    shipType: requiredString("Loại tàu không được để trống"),
    imageUrl: Yup.string().nullable(),
  }),

  crewMembers: Yup.array()
    .of(
      Yup.object().shape({
        cardId: requiredString("Số thẻ thuyền viên không được để trống"),
        fullName: requiredString("Hoten thuyền viên không được sé trống"),
        rankOnBoard: requiredString("Chức danh chuyên môn không được để trống"),
        startDate: dateBefore(
          "endDate",
          "Ngày bắt đầu phải trước ngày kết thúc",
        ).required("Ngày bắt đầu không được để trống"),
        endDate: dateAfter(
          "startDate",
          "Ngày kết thúc phải sau ngày bắt đàu",
        ).required("Ngày kết thúc không được để trống"),
      }),
    )
    .min(1, "Phải có ít nhất một thuyền viên"),
});

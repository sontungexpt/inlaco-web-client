import * as Yup from "yup";
import { requiredString, dateBefore, dateAfter } from "@/utils/yupHelper";

export const SCHEMA = Yup.object().shape({
  partnerName: requiredString("Tên công ty không được để trống"),
  startDate: Yup.date()
    .min(new Date(), "Thời gian khởi hành không hợp lệ")
    .required("Thời gian khởi hành dự kiến không được để trống")
    .concat(
      dateBefore(
        "endDate",
        "Thời gian khởi hành phải trước thời gian đến nơi dự kiến",
      ),
    ),

  endDate: Yup.date()
    .required("Thời gian đến nơi dự kiến không được để trống")
    .concat(
      dateAfter(
        "startDate",
        "Thời gian đến nơi dự kiến phải sau thời gian khởi hành",
      ),
    ),

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
        professionalPosition: requiredString(
          "Chức danh chuyên môn không được để trống",
        ),
      }),
    )
    .min(1, "Phải có ít nhất một thuyền viên"),
});

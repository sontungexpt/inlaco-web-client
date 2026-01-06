import * as Yup from "yup";
import Regex from "@/constants/Regex";

export const SCHEMA = Yup.object({
  title: Yup.string().required("Tiêu đề không được để trống"),

  partyA: Yup.object({
    compName: Yup.string().required(),
    compAddress: Yup.string().required(),
    compPhoneNumber: Yup.string()
      .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
      .required(),
    representative: Yup.string().required(),
    representativePos: Yup.string().required(),
  }),

  partyB: Yup.object({
    compName: Yup.string().required(),
    compAddress: Yup.string().required(),
    compPhoneNumber: Yup.string()
      .matches(Regex.VN_PHONE, "SĐT không hợp lệ")
      .required(),
    representative: Yup.string().required(),
    representativePos: Yup.string().required(),
  }),

  contractInfo: Yup.object({
    startDate: Yup.date().required(),
    endDate: Yup.date()
      .required()
      .min(Yup.ref("startDate"), "Ngày kết thúc phải sau ngày bắt đầu"),
    numOfCrewMember: Yup.number().min(1).required(),
  }),

  shipInfo: Yup.object({
    image: Yup.mixed().required(),
    IMONumber: Yup.string().required(),
    name: Yup.string().required(),
    countryISO: Yup.string().required(),
    type: Yup.string().required(),
    description: Yup.string(),
  }),

  contractFile: Yup.mixed().required("Vui lòng tải lên hợp đồng bản giấy"),
});

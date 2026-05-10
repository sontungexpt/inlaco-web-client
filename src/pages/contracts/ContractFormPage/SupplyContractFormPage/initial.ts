import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  contractFile: undefined,
  attachmentFiles: undefined,
  title: "",
  activationDate: "",
  expiryDate: "",
  numOfCrewMember: 1,

  partyA: {
    compName: "Công ty INLACO Hải Phòng",
    compAddress: "",
    compPhoneNumber: "",
    representative: "",
    representativePos: "Trưởng phòng Nhân sự",
  },
  partyB: {
    compName: "",
    companyEmail: "",
    compAddress: "",
    compPhoneNumber: "",
    representative: "",
    representativePos: "",
  },
  shipInfo: {
    image: undefined,
    IMONumber: "",
    name: "",
    countryISO: "",
    type: "",
    description: "",
  },
};

export const RECEIVE_METHOD = ["Tiền mặt", "Chuyển khoản ngân hàng"];

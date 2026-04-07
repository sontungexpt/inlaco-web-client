import { FormValues } from "./schema";

export const BASE_FORM_VALUES: FormValues = {
  contractFile: undefined,
  attachmentFiles: undefined,
  title: "",
  activationDate: undefined,
  expiryDate: undefined,
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
    compAddress: "",
    compPhoneNumber: "",
    representative: "",
    representativePos: "",
  },
  shipInfo: {
    image: null,
    IMONumber: "",
    name: "",
    countryISO: "",
    type: "",
    description: "",
  },
};

export const RECEIVE_METHOD = ["Tiền mặt", "Chuyển khoản ngân hàng"];

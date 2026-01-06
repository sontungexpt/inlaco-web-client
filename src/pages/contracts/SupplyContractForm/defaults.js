// contractForm.defaults.ts
export const DEFAULT_CONTRACT_FORM_VALUES = {
  contractFile: null,
  title: "",
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
  contractInfo: {
    startDate: "",
    endDate: "",
    numOfCrewMember: "",
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

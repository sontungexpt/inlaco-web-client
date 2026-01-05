// contractForm.defaults.ts
export const DEFAULT_CONTRACT_FORM_VALUES = {
  title: "",
  contractFile: null,
  partyA: {
    cardPhoto: "",
    compName: "Công ty INLACO Hải Phòng",
    compAddress: "Công ty INLACO Hải Phòng",
    compPhoneNumber: "",
    representative: "",
    representativePos: "Trưởng phòng Nhân sự",
  },
  partyB: {
    fullName: "",
    dob: "",
    birthPlace: "",
    phone: "",
    nationality: "",
    permanentAddr: "",
    temporaryAddr: "",
    ciNumber: "",
    ciIssueDate: "",
    ciIssuePlace: "",
  },
  jobInfo: {
    startDate: "",
    endDate: "",
    workingLocation: "Địa điểm làm việc sẽ được thông báo sau",
    position: "",
    jobDescription: "",
  },
  salaryInfo: {
    basicSalary: "",
    allowance: "",
    receiveMethod: "Chuyển khoản ngân hàng",
    payday: "Ngày 5 hàng tháng",
    salaryReviewPeriod: "Mỗi 3 tháng",
    bankAccount: "",
    bankName: "",
  },
};

export const RECEIVE_METHOD = ["Tiền mặt", "Chuyển khoản ngân hàng"];

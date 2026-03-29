import { LaborContract } from "@/types/api/contract.api";
import {
  mapCandidateInfoToFormValues,
  mapContractToFormValues,
} from "./mapper";
import { FormValues } from "./schema";

export const BASE_FORM_VALUES = {
  title: "",
  contractFile: null,
  attachmentFiles: [],

  employer: {
    companyName: "Công ty INLACO Hải Phòng",
    companyAddress: "Công ty INLACO Hải Phòng",
    companyPhone: "",
    representativeName: "",
    representativePosition: "Trưởng phòng Nhân sự",
  },

  employee: {
    fullName: "",
    birthDate: undefined,
    birthPlace: "",

    phoneNumber: "",
    nationality: "",

    permanentAddress: "",
    temporaryAddress: "",

    idCardNumber: "",
    idCardIssueDate: undefined,
    idCardIssuePlace: "",
  },

  jobInfo: {
    startDate: undefined,
    endDate: undefined,

    workLocation: "Địa điểm làm việc sẽ được thông báo sau",

    position: "",
    jobDescription: "",
  },

  salaryInfo: {
    baseSalary: "",
    allowance: "",
    paymentMethod: "Chuyển khoản ngân hàng",
    payday: "Ngày 5 hàng tháng",
    salaryReviewCycle: "Mỗi 3 tháng",
    bankAccountNumber: "",
    bankName: "",
  },
};

export const RECEIVE_METHOD = ["Chuyển khoản ngân hàng", "Tiền mặt"];

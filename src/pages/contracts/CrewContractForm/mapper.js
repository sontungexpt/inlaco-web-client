// contractForm.mapper.ts
import UploadStrategy from "@/constants/UploadStrategy";
import { datetimeToISO, isoToMUIDateTime } from "@utils/converter";

export const mapContractToFormValues = (contractInfo) => {
  const partyA = contractInfo?.initiator;
  const partyB = contractInfo?.partners?.[0];

  return {
    title: contractInfo?.title || "",
    contractFile: null,
    partyA: {
      compName: partyA?.partyName || "",
      compAddress: partyA?.address || "",
      compPhoneNumber: partyA?.phone || "",
      representative: partyA?.representer || "",
      representativePos: partyA?.representerPosition || "",
    },
    partyB: {
      fullName: partyB?.partyName,
      dob: isoToMUIDateTime(partyB?.birthDate, "date"),
      birthPlace: partyB?.birthPlace || "",
      phone: partyB?.phone || "",
      nationality: partyB?.nationality || "",
      permanentAddr: partyB?.address || "",
      temporaryAddr: partyB?.temporaryAddress || "",
      ciNumber: partyB?.identificationCardId || "",
      ciIssueDate: isoToMUIDateTime(
        partyB?.identificationCardIssuedDate,
        "date",
      ),
      ciIssuePlace: partyB?.identificationCardIssuedPlace || "",
    },

    jobInfo: {
      startDate: isoToMUIDateTime(contractInfo?.activationDate),
      endDate: isoToMUIDateTime(contractInfo?.expiredDate),
      workingLocation: contractInfo?.workingLocation || "",
      position: contractInfo?.position || "",
      jobDescription: contractInfo?.customAttributes?.[0]?.value || "",
    },

    salaryInfo: {
      basicSalary: contractInfo?.basicSalary || "",
      allowance: contractInfo?.allowance || "",
      receiveMethod: contractInfo?.receiveMethod || "",
      payday: contractInfo?.payday || "",
      salaryReviewPeriod: contractInfo?.salaryReviewPeriod || "",
      bankAccount: partyB?.bankAccount || "",
      bankName: partyB?.bankName || "",
    },
  };
};

export const mapValuesToRequestBody = (values, { contractFileAssetId }) => ({
  title: values.title,
  initiator: {
    partyName: values.partyA.compName,
    address: values.partyA.compAddress,
    phone: values.partyA.compPhoneNumber,
    representer: values.partyA.representative,
    representerPosition: values.partyA.representativePos,
    email: "thong2046@gmail.com",
    type: "STATIC",
  },
  partners: [
    {
      partyName: values.partyB.fullName,
      representer: values.partyB.fullName,
      representerPosition: values.partyB.representativePos,
      address: values.partyB.permanentAddr,
      phone: values.partyB.phone,
      type: "LABOR",
      birthPlace: values.partyB.birthPlace,
      birthDate: datetimeToISO(values.partyB.dob),
      nationality: values.partyB.nationality,
      temporaryAddress: values.partyB.temporaryAddr,
      identificationCardId: values.partyB.ciNumber,
      identificationCardIssuedDate: datetimeToISO(values.partyB.ciIssueDate),
      identificationCardIssuedPlace: values.partyB.ciIssuePlace,
      bankAccount: values.salaryInfo.bankAccount,
      bankName: values.salaryInfo.bankName,
    },
  ],
  activationDate: datetimeToISO(values.jobInfo.startDate),
  expiredDate: datetimeToISO(values.jobInfo.endDate),
  position: values.jobInfo.position,
  workingLocation: values.jobInfo.workingLocation,
  basicSalary: values.salaryInfo.basicSalary,
  birthPlace: values.partyB.birthPlace,
  allowance: values.salaryInfo.allowance,
  receiveMethod: values.salaryInfo.receiveMethod,
  terms: [],
  payday: values.salaryInfo.payday,
  salaryReviewPeriod: values.salaryInfo.salaryReviewPeriod,
  customAttributes: [
    {
      key: "jobDescription",
      value: values.jobInfo.jobDescription,
    },
  ],
  contractFile: {
    assetId: contractFileAssetId,
    strategy: UploadStrategy.CONTRACT_FILE,
  },
});

// contractForm.mapper.ts
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
      compName: partyB?.partyName || "",
      compAddress: partyB?.address || "",
      compPhoneNumber: partyB?.phone || "",
      representative: partyB?.representer || "",
      representativePos: partyB?.representerPosition || "",
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

export const mapValuesToRequestBody = (values, others) => ({
  title: values.title,
  initiator: {
    partyName: values.partyA.compName,
    address: values.partyA.compAddress,
    phone: values.partyA.compPhoneNumber,
    representer: values.partyA.representative,
    representerPosition: values.partyA.representativePos,
    type: "STATIC",
  },
  signedPartners: [
    {
      partyName: values.partyB.compName,
      address: values.partyB.compAddress,
      phone: values.partyB.compPhoneNumber,
      representer: values.partyB.representative,
      representerPosition: values.partyB.representativePos,
      type: "STATIC",
    },
  ],
  activationDate: datetimeToISO(values.contractInfo.startDate),
  expiredDate: datetimeToISO(values.contractInfo.endDate),
  numOfCrews: values.contractInfo.numOfCrewMember,
  shipInfo: {
    imoNumber: values.shipInfo.IMONumber,
    name: values.shipInfo.name,
    countryISO: values.shipInfo.countryISO,
    type: values.shipInfo.type,
    description: values.shipInfo.description,
  },
  ...others,
});

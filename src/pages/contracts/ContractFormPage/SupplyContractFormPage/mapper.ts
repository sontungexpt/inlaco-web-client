import {
  CrewSupplyContract,
  LaborParty,
  PartyType,
} from "@/types/api/contract.api";
import { datetimeToISO } from "@utils/converter";
import { FormValues } from "./schema";
import { SupplyRequest } from "@/types/api/supply-request.api";

const v = (val: any, fallback = "") => val ?? fallback;

export const mapSupplyRequestToFormValues = (
  currentFormValues: FormValues,
  requestInfo?: SupplyRequest,
): FormValues => {
  if (!requestInfo) return currentFormValues;

  const shipInfo = requestInfo.shipInfo;

  return {
    ...currentFormValues,
    partyB: {
      ...currentFormValues.partyB,
      compName: requestInfo?.companyName || "",
      compAddress: requestInfo?.companyAddress || "",
      compPhoneNumber: requestInfo?.companyPhone || "",
      representative: requestInfo?.companyRepresentor || "",
      representativePos: requestInfo?.companyRepresentorPosition || "",
    },
    shipInfo: {
      ...currentFormValues.shipInfo,
      image: null,
      IMONumber: shipInfo?.imoNumber || "",
      name: shipInfo?.name || "",
      countryISO: shipInfo?.countryISO || "",
      type: shipInfo?.type || "",
      description: shipInfo?.description || "",
    },
  };
};

export const mapContractToFormValues = (
  currentFormValues: FormValues,
  contractInfo: CrewSupplyContract,
): FormValues => {
  if (!contractInfo) return currentFormValues;

  const partyA = contractInfo.initiator;
  const partyB = contractInfo.partners?.[0] as LaborParty;
  const shipInfo = contractInfo.shipInfo;

  return {
    title: contractInfo?.title || "",
    contractFile: null,
    attachmentFiles: [],
    activationDate: v(contractInfo.activationDate),
    expiryDate: v(contractInfo.expiredDate),
    numOfCrewMember: v(contractInfo.numOfCrews),

    partyA: {
      compName: v(partyA?.name),
      compAddress: v(partyA?.address),
      compPhoneNumber: v(partyA?.phone),
      representative: v(partyA?.representer),
      representativePos: v(partyA?.representerPosition),
    },

    partyB: {
      compName: v(partyB?.name),
      compAddress: v(partyB?.address),
      compPhoneNumber: v(partyB?.phone),
      representative: v(partyB?.representer),
      representativePos: v(partyB?.representerPosition),
    },

    shipInfo: {
      image: shipInfo?.image,
      IMONumber: v(shipInfo?.imoNumber),
      name: v(shipInfo?.name),
      countryISO: v(shipInfo?.countryISO),
      type: v(shipInfo?.type),
      description: v(shipInfo?.description),
    },
  };
};

export const mapValuesToRequestBody = (
  values: FormValues,
  {
    shipImageId,
    contractFileId,
    attachmentFileIds,
  }: {
    shipImageId?: string;
    contractFileId?: string;
    attachmentFileIds?: string[];
  },
) => ({
  title: values.title,
  activationDate: datetimeToISO(values.activationDate),
  expiredDate: datetimeToISO(values.expiryDate),
  numOfCrews: values.numOfCrewMember,
  attachements: attachmentFileIds,
  contractFile: contractFileId,
  type: "SUPPLY_CONTRACT",

  initiator: {
    partyName: values.partyA.compName,
    address: values.partyA.compAddress,
    phone: values.partyA.compPhoneNumber,
    representer: values.partyA.representative,
    representerPosition: values.partyA.representativePos,
    type: PartyType.STATIC,
  },

  partners: [
    {
      partyName: values.partyB.compName,
      address: values.partyB.compAddress,
      phone: values.partyB.compPhoneNumber,
      representer: values.partyB.representative,
      representerPosition: values.partyB.representativePos,
      type: PartyType.STATIC,
    },
  ],
  shipInfo: {
    imoNumber: values.shipInfo.IMONumber,
    name: values.shipInfo.name,
    countryISO: values.shipInfo.countryISO,
    type: values.shipInfo.type,
    description: values.shipInfo.description,
    image: shipImageId,
  },
});

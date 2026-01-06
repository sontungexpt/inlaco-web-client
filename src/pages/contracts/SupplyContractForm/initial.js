// contractForm.initial.ts
import { DEFAULT_CONTRACT_FORM_VALUES } from "./defaults";
import { mapContractToFormValues } from "./mapper";

export const buildInitialValues = ({
  updatingForm,
  requestInfo,
  contractInfo,
}) => {
  if (!updatingForm) {
    const shipInfo = requestInfo?.shipInfo;
    return {
      ...DEFAULT_CONTRACT_FORM_VALUES,
      partyB: {
        ...DEFAULT_CONTRACT_FORM_VALUES.partyB,
        compName: requestInfo?.companyName || "",
        compAddress: requestInfo?.companyAddress || "",
        compPhoneNumber: requestInfo?.companyPhone || "",
        representative: requestInfo?.companyRepresentor || "",
        representativePos: requestInfo?.companyRepresentorPosition || "",
      },
      shipInfo: {
        ...DEFAULT_CONTRACT_FORM_VALUES.shipInfo,
        image: null,
        IMONumber: shipInfo?.IMONumber || "",
        name: shipInfo?.name || "",
        countryISO: shipInfo?.countryISO || "",
        type: shipInfo?.type || "",
        description: shipInfo?.description || "",
      },
    };
  }
  return {
    ...DEFAULT_CONTRACT_FORM_VALUES,
    ...mapContractToFormValues(contractInfo),
  };
};

// contractForm.initial.ts
import { DEFAULT_CONTRACT_FORM_VALUES } from "./defaults";
import { mapContractToFormValues } from "./mapper";

export const buildInitialValues = ({
  updatingForm,
  candidateInfo,
  contractInfo,
}) => {
  if (!updatingForm) {
    return {
      ...DEFAULT_CONTRACT_FORM_VALUES,
      partyB: {
        ...DEFAULT_CONTRACT_FORM_VALUES.partyB,
        fullName: candidateInfo?.fullName || "",
        phone: candidateInfo?.phoneNumber || "",
        permanentAddr: candidateInfo?.address || "",
        temporaryAddr: candidateInfo?.address || "",
      },
    };
  }

  return {
    ...DEFAULT_CONTRACT_FORM_VALUES,
    ...mapContractToFormValues(contractInfo),
  };
};

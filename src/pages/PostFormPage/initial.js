import FormMode from "@/constants/FormMode";
import { DEFAULT_INITIAL_VALUES } from "./defaults";
import { mapPostToFormValues } from "./mapper";

export const buildInitialValues = ({ mode, post, fixedType }) => {
  if (mode !== FormMode.EDIT) {
    return { ...DEFAULT_INITIAL_VALUES, type: fixedType };
  }
  return {
    ...DEFAULT_INITIAL_VALUES,
    ...mapPostToFormValues(post),
  };
};

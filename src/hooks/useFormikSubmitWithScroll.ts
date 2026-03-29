import { FormikProps } from "formik";

type AnyObject = Record<string, any>;

const getFirstErrorPath = (obj: AnyObject, parent = ""): string | null => {
  for (const key in obj) {
    const path = parent ? `${parent}.${key}` : key;

    if (typeof obj[key] === "string") return path;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const nested = getFirstErrorPath(obj[key], path);
      if (nested) return nested;
    }
  }
  return null;
};

const markAllTouched = (obj: AnyObject): AnyObject => {
  if (typeof obj !== "object" || obj === null) return true;

  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = markAllTouched(obj[key]);
    return acc;
  }, {} as AnyObject);
};

export function useFormikSubmitWithScroll<T>(formik: FormikProps<T>) {
  const handleSubmitWithScroll = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      // 1. mark all touched
      formik.setTouched(markAllTouched(errors) as any);

      // 2. find first error field
      const firstErrorField = getFirstErrorPath(errors);

      if (firstErrorField) {
        const el = document.querySelector(
          `[name="${firstErrorField}"]`,
        ) as HTMLElement | null;

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          el.focus();
        }
      }

      return;
    }

    // 3. submit nếu valid
    await formik.submitForm();
  };

  return handleSubmitWithScroll;
}

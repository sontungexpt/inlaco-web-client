import { useField, useFormikContext } from "formik";
import ImageUploadField from "./ImageUploadField";

const ImageUploadFieldFormik = ({ name, disabled, ...props }) => {
  const { setFieldValue, isSubmitting, setFieldTouched, setFieldError } =
    useFormikContext();
  const [field, meta] = useField(name);

  return (
    <ImageUploadField
      {...props}
      disabled={disabled || isSubmitting}
      value={field.value}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      onChange={(val, { error }) => {
        setFieldTouched(name, true, false);
        setFieldError(name, error);
        setFieldValue(name, val, !error);
      }}
    />
  );
};

export default ImageUploadFieldFormik;

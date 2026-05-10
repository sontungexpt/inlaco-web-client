import { useField, useFormikContext } from "formik";
import FileUploadField from "./FileUploadField";

const FileUploadFieldFormik = ({ name, disabled, ...props }) => {
  const { isSubmitting, setFieldValue, setFieldTouched, setFieldError } =
    useFormikContext();

  const [field, meta] = useField(name);

  return (
    <FileUploadField
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

export default FileUploadFieldFormik;

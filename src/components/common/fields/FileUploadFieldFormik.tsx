import { useField, useFormikContext } from "formik";

import FileUploadField from "./FileUploadField";

type ChangeMeta = {
  error?: string;
};

type FileUploadFieldFormikProps = {
  name: string;
  disabled?: boolean;
  [key: string]: unknown;
};

const FileUploadFieldFormik = ({
  name,
  disabled,
  ...props
}: FileUploadFieldFormikProps) => {
  const { isSubmitting, setFieldValue, setFieldTouched, setFieldError } =
    useFormikContext<any>();

  const [field, meta] = useField(name);

  return (
    <FileUploadField
      {...props}
      disabled={disabled || isSubmitting}
      value={field.value}
      error={meta.touched && Boolean(meta.error)}
      helperText={
        meta.touched
          ? typeof meta.error === "string"
            ? meta.error
            : undefined
          : undefined
      }
      onChange={(val, { error }: ChangeMeta) => {
        setFieldTouched(name, true, false);

        if (error) {
          setFieldError(name, error);
        } else {
          setFieldError(name, undefined);
        }

        setFieldValue(name, val, !error);
      }}
    />
  );
};

export default FileUploadFieldFormik;

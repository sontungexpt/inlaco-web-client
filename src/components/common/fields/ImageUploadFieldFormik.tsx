import { useField, useFormikContext } from "formik";
import ImageUploadField, { ImageUploadFieldProps } from "./ImageUploadField";

export type ImageUploadFieldFormikProps = Omit<
  ImageUploadFieldProps,
  "value" | "onChange" | "error" | "helperText"
> & {
  name: string;
};

const ImageUploadFieldFormik = ({
  name,
  disabled,
  ...props
}: ImageUploadFieldFormikProps) => {
  const { setFieldValue, isSubmitting, setFieldTouched, setFieldError } =
    useFormikContext();
  const [field, meta] = useField(name);

  return (
    <ImageUploadField
      {...props}
      disabled={disabled || isSubmitting}
      value={field.value}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched ? meta.error : undefined}
      onChange={(val, { error }) => {
        setFieldTouched(name, true, false);
        setFieldError(name, error);
        setFieldValue(name, val, !error);
      }}
    />
  );
};

export default ImageUploadFieldFormik;

import { FieldHookConfig, useField, useFormikContext } from "formik";
import InfoTextField, { InfoTextFieldProps } from "./InfoTextField";

export type InfoTextFieldFormikProps = InfoTextFieldProps & {
  name: string | FieldHookConfig<any>;
};

const InfoTextFieldFormik = ({
  onChange,
  required = true,
  disabled,
  name,
  ...props
}: InfoTextFieldFormikProps) => {
  const [field, meta] = useField(name);
  const { isSubmitting } = useFormikContext();
  return (
    <InfoTextField
      {...props}
      {...field}
      disabled={disabled || isSubmitting}
      onChange={onChange ?? field.onChange}
      required={required}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default InfoTextFieldFormik;

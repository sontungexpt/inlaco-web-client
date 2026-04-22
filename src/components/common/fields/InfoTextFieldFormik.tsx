import { FieldHookConfig, useField } from "formik";
import InfoTextField, { InfoTextFieldProps } from "./InfoTextField";

export type InfoTextFieldFormikProps = InfoTextFieldProps & {
  name: string | FieldHookConfig<any>;
};

const InfoTextFieldFormik = ({
  onChange,
  required = true,
  name,
  ...props
}: InfoTextFieldFormikProps) => {
  const [field, meta] = useField(name);
  return (
    <InfoTextField
      {...props}
      {...field}
      onChange={onChange ?? field.onChange}
      required={required}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default InfoTextFieldFormik;

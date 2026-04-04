import { FieldHookConfig, useField } from "formik";
import InfoTextField, { InfoTextFieldProps } from "./InfoTextField";

export type InfoTextFieldFormikProps = InfoTextFieldProps & {
  name: string | FieldHookConfig<any>;
};

const InfoTextFieldFormik = ({
  required = true,
  name,
  ...props
}: InfoTextFieldFormikProps) => {
  const [field, meta] = useField(name);
  return (
    <InfoTextField
      {...props}
      {...field}
      required={required}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default InfoTextFieldFormik;

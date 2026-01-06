import React from "react";
import { useField, useFormikContext } from "formik";
import InfoTextField from "./InfoTextField";

const InfoTextFieldFormik = ({ required = true, name, onChange, ...props }) => {
  const { handleChange, handleBlur } = useFormikContext();
  const [field, meta] = useField(name);

  return (
    <InfoTextField
      {...props}
      required={required}
      name={name}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      value={field.value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default InfoTextFieldFormik;

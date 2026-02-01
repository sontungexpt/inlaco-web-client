import React from "react";
import { useField } from "formik";
import InfoTextField from "./InfoTextField";

const InfoTextFieldFormik = ({ required = true, name, ...props }) => {
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

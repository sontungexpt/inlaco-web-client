import React from "react";
import { MenuItem } from "@mui/material";
import { InfoTextField } from ".";
import CountryCodes from "@/constants/CountryCodes";

const NationalityTextField = ({
  sx,
  slotProps,
  multiline,
  minRow,
  value,
  maxRow,
  rows,
  component = InfoTextField,
  ...props
}) => {
  const TextField = component;
  return (
    <TextField
      {...props}
      value={value || ""}
      multiline={multiline}
      rows={rows}
      select
    >
      {CountryCodes.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          {`${country.code} - ${country.name}`}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default NationalityTextField;

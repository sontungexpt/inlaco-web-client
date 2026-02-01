import React from "react";
import { MenuItem } from "@mui/material";
import { InfoTextField } from ".";
import CountryCodes from "@/constants/CountryCodes";

const NationalityTextField = ({
  component: TextField = InfoTextField,
  ...props
}) => {
  return (
    <TextField {...props} select>
      {CountryCodes.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          {`${country.code} - ${country.name}`}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default NationalityTextField;

import React from "react";
import { MenuItem } from "@mui/material";
import { InfoTextField } from ".";

import CountryCodes from "@/constants/CountryCodes";

const NationalityTextField = ({
  sx,
  slotProps,
  multiline,
  minRow,
  maxRow,
  rows,
  ...props
}) => {
  return (
    <InfoTextField {...props} multiline={multiline} rows={rows} select>
      {CountryCodes.map((country) => (
        <MenuItem key={country.code} value={country.code}>
          {`${country.code} - ${country.name}`}
        </MenuItem>
      ))}
    </InfoTextField>
  );
};

export default NationalityTextField;

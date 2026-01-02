import React from "react";
import { TextField, MenuItem } from "@mui/material";
import Color from "@constants/Color";
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
    <TextField
      {...props}
      multiline={multiline}
      rows={rows}
      select
      sx={[
        { backgroundColor: "#FFF", marginBottom: 1 },
        ...(Array.isArray(sx) ? sx : [sx]),
        {
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: Color.PrimaryBlack,
          },
          "& .MuiOutlinedInput-root.Mui-disabled": {
            WebkitTextFillColor: Color.PrimaryBlack,
          },
          "& .MuiInputLabel-root.Mui-disabled": {
            WebkitTextFillColor: Color.PrimaryBlack,
          },
        },
      ]} // Merging styles with spread operator
      slotProps={{
        formHelperText: {
          sx: {
            margin: 0,
            paddingRight: 1,
            paddingLeft: 1,
            backgroundColor: Color.PrimaryWhite,
          },
        },
        ...slotProps, // Merging slotProps with spread operator
      }}
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

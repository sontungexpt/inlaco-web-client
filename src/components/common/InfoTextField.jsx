import React from "react";
import { TextField } from "@mui/material";
import Color from "@constants/Color";

const InfoTextField = ({
  sx,
  disabled,
  fullWidth = true,
  slotProps,
  multiline,
  minRow,
  maxRow,
  rows,
  ...props
}) => {
  return (
    <TextField
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      sx={[
        { backgroundColor: "#FFF", marginBottom: 1 },
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
        ...(Array.isArray(sx) ? sx : [sx]),
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
      {...props}
    />
  );
};

export default InfoTextField;

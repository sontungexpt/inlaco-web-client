import React from "react";
import { TextField } from "@mui/material";
import Color from "@constants/Color";

const InfoTextField = ({ sx, fullWidth = true, slotProps, ...props }) => {
  return (
    <TextField
      fullWidth={fullWidth}
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

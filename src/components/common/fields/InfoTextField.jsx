import React, {} from "react";
import { TextField } from "@mui/material";
import Regex from "@/constants/Regex";
import { dateToMUIDatetime, isoToMUIDateTime } from "@/utils/converter";
import Color from "@/constants/Color";

const formatDisplayValue = (value, type) => {
  if (
    (type === "date" || type === "datetime-local" || type === "time") &&
    typeof value === "string" &&
    Regex.ISO_REGEX.test(value)
  ) {
    return isoToMUIDateTime(value, type);
  } else if (value instanceof Date) {
    return dateToMUIDatetime(value, type);
  }

  return value ?? "";
};

const InfoTextField = ({
  type,
  value,
  sx,
  fullWidth = true,
  slotProps,
  ...props
}) => {
  return (
    <TextField
      {...props}
      value={formatDisplayValue(value, type)}
      fullWidth={fullWidth}
      sx={[
        {
          backgroundColor: "#FFF",
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
      slotProps={
        slotProps // Merging slotProps with spread operator
      }
      type={type}
    />
  );
};

export default InfoTextField;

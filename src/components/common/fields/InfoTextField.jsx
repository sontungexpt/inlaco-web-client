import React, { useMemo } from "react";
import { TextField } from "@mui/material";
import Color from "@constants/Color";
import Regex from "@/constants/Regex";
import { isoToMUIDateTime } from "@/utils/converter";

const InfoTextField = ({
  type,
  value,
  sx,
  fullWidth = true,
  slotProps,
  ...props
}) => {
  const displayValue = useMemo(() => {
    if (
      (type === "date" || type === "datetime-local" || type === "time") &&
      typeof value === "string" &&
      Regex.ISO_REGEX.test(value)
    ) {
      return isoToMUIDateTime(value);
    }
    return value;
  }, [value, type]);

  return (
    <TextField
      {...props}
      value={displayValue}
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

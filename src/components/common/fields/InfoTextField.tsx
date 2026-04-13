import { TextField, TextFieldProps } from "@mui/material";
import Regex from "@/utils/validation/Regex";
import { dateToMUIDatetime, MUIType } from "@/utils/converter";
import Color from "@/constants/Color";
import { useMemo } from "react";

const formatDisplayValue = (
  value: any,
  type: React.InputHTMLAttributes<unknown>["type"] | undefined,
) => {
  if (type === "date" || type === "datetime-local" || type === "time") {
    if (typeof value === "string" && Regex.ISO_REGEX.test(value)) {
      return dateToMUIDatetime(value, type as MUIType);
    } else if (value instanceof Date) {
      return dateToMUIDatetime(value, type as MUIType);
    }
  }
  return value ?? "";
};

export type InfoTextFieldProps = TextFieldProps & {};

export default function InfoTextField({
  type,
  value,
  sx,
  fullWidth = true,
  ...props
}: InfoTextFieldProps) {
  const displayValue = useMemo(
    () => formatDisplayValue(value, type),
    [value, type],
  );

  return (
    <TextField
      {...props}
      value={displayValue}
      fullWidth={fullWidth}
      type={type}
      sx={[
        {
          // root input
          "& .MuiInputBase-root": {
            height: "100%",
            fontSize: "inherit",
          },

          // "& .MuiInputBase-input.Mui-disabled": {
          //   WebkitTextFillColor: Color.PrimaryBlack,
          // },

          // "& .MuiOutlinedInput-root.Mui-disabled": {
          //   WebkitTextFillColor: Color.PrimaryBlack,
          // },

          // "& .MuiInputLabel-root.Mui-disabled": {
          //   WebkitTextFillColor: Color.PrimaryBlack,
          // },

          "& input::-webkit-calendar-picker-indicator": {
            display: "block",
            cursor: "pointer",
            filter: "brightness(0) saturate(100%)",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

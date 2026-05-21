import { TextField, TextFieldProps } from "@mui/material";
import { dateToMUIDatetime, MUIType } from "@/utils/converter";
import { useMemo } from "react";

const formatDisplayValue = (
  value: any,
  type: React.InputHTMLAttributes<unknown>["type"] | undefined,
) => {
  if (type === "date" || type === "datetime-local" || type === "time") {
    return dateToMUIDatetime(value, type as MUIType);
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
  const convertedType = type === "datetime" ? "datetime-local" : type;

  const displayValue = useMemo(
    () => formatDisplayValue(value, convertedType),
    [value, type],
  );

  return (
    <TextField
      {...props}
      value={displayValue}
      fullWidth={fullWidth}
      type={convertedType}
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
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

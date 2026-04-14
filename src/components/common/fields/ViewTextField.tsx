import { TextField, TextFieldProps } from "@mui/material";
import Color from "@constants/Color";

export type ViewTextFieldProps = TextFieldProps & {};

export default function ViewTextField({
  fullWidth = true,
  sx,
  slotProps,
  ...props
}: ViewTextFieldProps) {
  return (
    <TextField
      {...props}
      fullWidth={fullWidth}
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
        ...slotProps,
        formHelperText: {
          ...slotProps?.formHelperText,
          sx: {
            ...slotProps?.formHelperText?.sx,
            margin: 0,
            paddingRight: 1,
            paddingLeft: 1,
            backgroundColor: Color.PrimaryWhite,
          },
        },
        input: {
          readOnly: true,
        },
      }}
    />
  );
}

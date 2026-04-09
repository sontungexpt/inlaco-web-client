import { MenuItem } from "@mui/material";
import { InfoTextField } from ".";
import CountryCodes from "@/constants/CountryCodes";
import { InfoTextFieldProps } from "./InfoTextField";
import { ElementType } from "react";

export type NationalityTextFieldProps = {
  component?: ElementType;
} & InfoTextFieldProps;

const NationalityTextField = ({
  component: TextField = InfoTextField,
  ...props
}: NationalityTextFieldProps) => {
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

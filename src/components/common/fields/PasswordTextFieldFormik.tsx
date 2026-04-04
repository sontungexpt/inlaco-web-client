import { useState } from "react";
import InfoTextFieldFormik, {
  InfoTextFieldFormikProps,
} from "./InfoTextFieldFormik";
import { IconButton, InputAdornment } from "@mui/material";

import VpnKeyIcon from "@mui/icons-material/VpnKey";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export type PasswordTextFieldFormikProps = InfoTextFieldFormikProps & {};

export default function PasswordTextFieldFormik({
  label = "Password",
  ...props
}: PasswordTextFieldFormikProps) {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible((v) => !v);

  return (
    <InfoTextFieldFormik
      {...props}
      label="Mật khẩu"
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <IconButton onClick={toggleVisibility} edge="end">
              {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          ),
        },
      }}
    />
  );
}

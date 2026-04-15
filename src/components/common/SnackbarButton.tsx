import { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";

export type SnackbarButtonProps = {
  buttonText?: string;
  message?: string;
  severity?: "success" | "info" | "warning" | "error";
  autoHideDuration?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  snackbarProps?: any;
};

export default function SnackbarButton({
  buttonText = "Show Snackbar",
  message = "Action completed",
  severity = "success",
  autoHideDuration = 3000,
  onClick,
  snackbarProps,
  ...buttonProps
}: SnackbarButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    setOpen(true);
  };

  const handleClose = (_: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        {buttonText}
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        {...snackbarProps}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

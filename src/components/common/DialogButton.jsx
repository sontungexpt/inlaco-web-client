import { useState } from "react";
import { Button, Dialog } from "@mui/material";

const DialogButton = ({ children, dialog = Dialog, ...buttonProps }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const InternalDialog = dialog;

  return (
    <>
      <Button {...buttonProps} onClick={handleOpen}>
        {children}
      </Button>

      <InternalDialog open={open} onClose={handleClose} />
    </>
  );
};

export default DialogButton;

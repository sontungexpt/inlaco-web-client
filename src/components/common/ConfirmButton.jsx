import { useState } from "react";
import { Button } from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";

const ConfirmButton = ({
  children,

  // Confirm dialog props
  confirmTitle = "Xác nhận",
  confirmDescription,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmColor = "primary",
  confirmVariant = "contained",
  disableBackdropClose = false,

  // Logic
  loading = false,
  dialog = ConfirmDialog,
  onConfirm,
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const Dialog = dialog;

  const handleConfirm = async () => {
    await onConfirm?.();
    setOpen(false);
  };

  return (
    <>
      <Button {...props} onClick={handleOpen}>
        {children}
      </Button>

      <Dialog
        open={open}
        title={confirmTitle}
        description={confirmDescription}
        confirmText={confirmText}
        cancelText={cancelText}
        confirmColor={confirmColor}
        confirmVariant={confirmVariant}
        loading={loading}
        disableBackdropClose={disableBackdropClose}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </>
  );
};

export default ConfirmButton;

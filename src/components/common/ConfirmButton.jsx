import ConfirmDialog from "./ConfirmDialog";
import { DialogButton } from ".";

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
  const handleConfirm = async (e, close) => {
    await onConfirm?.();
    close();
  };

  return (
    <DialogButton
      {...props}
      dialog={({ open, onClose }) => (
        <ConfirmDialog
          open={open}
          onClose={onClose}
          title={confirmTitle}
          description={confirmDescription}
          confirmText={confirmText}
          cancelText={cancelText}
          confirmColor={confirmColor}
          confirmVariant={confirmVariant}
          loading={loading}
          disableBackdropClose={disableBackdropClose}
          onConfirm={handleConfirm}
        />
      )}
    >
      {children}
    </DialogButton>
  );
};

export default ConfirmButton;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  title = "Xác nhận",
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  confirmColor = "primary",
  confirmVariant = "contained",
  loading = false,
  disableBackdropClose = false,
  maxWidth = "xs",
  fullWidth = true,
  onConfirm,
  onClose,
}) => {
  const handleClose = (_, reason) => {
    if (disableBackdropClose && reason === "backdropClick") return;
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          onClick={(e) => onConfirm(e, handleClose)}
          color={confirmColor}
          variant={confirmVariant}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : null
          }
          autoFocus={confirmColor !== "error"} // danger → focus cancel
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

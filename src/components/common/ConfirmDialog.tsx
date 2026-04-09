import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  ButtonProps,
  DialogProps,
} from "@mui/material";
import { ReactNode, useState } from "react";

export type ConfirmDialogProps = {
  open: boolean;
  closeDialog: () => void;

  title?: ReactNode;
  description?: ReactNode;

  confirmText?: ReactNode;
  confirmColor?: ButtonProps["color"];
  confirmVariant?: ButtonProps["variant"];
  confirmLoading?: boolean;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;

  cancelText?: ReactNode;
  cancelLoading?: boolean;
  onCancel?: (event?: object) => void | Promise<void>;

  disableBackdropClose?: boolean;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
};

const ConfirmDialog = ({
  open,
  closeDialog,
  disableBackdropClose = false,

  title = "Xác nhận",
  description,

  cancelText = "Hủy",
  cancelLoading: externalCancelLoading = false,
  onCancel,

  confirmText = "Xác nhận",
  confirmColor = "primary",
  confirmVariant = "contained",
  confirmLoading: externalConfirmLoading = false,
  onConfirm,

  maxWidth = "xs",
  fullWidth = true,
}: ConfirmDialogProps) => {
  const [internalConfirmLoading, setInternalConfirmLoading] = useState(false);
  const confirmLoading = externalConfirmLoading || internalConfirmLoading;
  const [internalCancelLoading, setInternalCancelLoading] = useState(false);
  const cancelLoading = externalCancelLoading || internalCancelLoading;
  const loading = confirmLoading || cancelLoading;

  const handleClose = async (
    event?: object,
    reason?: "backdropClick" | "escapeKeyDown",
  ) => {
    if (disableBackdropClose && reason === "backdropClick") return;
    try {
      setInternalCancelLoading(true);
      await onCancel?.(event);
      closeDialog();
    } catch (err) {
      console.error(err);
    } finally {
      setInternalCancelLoading(false);
    }
  };

  const handleConfirmClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      setInternalConfirmLoading(true);
      await onConfirm(e);
      closeDialog();
    } catch (err) {
      console.error(err);
    } finally {
      setInternalConfirmLoading(false);
    }
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
        {cancelText && (
          <Button
            onClick={(e) => handleClose(e, "escapeKeyDown")}
            disabled={loading}
            loading={cancelLoading}
            loadingIndicator={<CircularProgress size={16} color="inherit" />}
          >
            {cancelText}
          </Button>
        )}

        <Button
          onClick={handleConfirmClick}
          color={confirmColor}
          variant={confirmVariant}
          disabled={loading}
          loadingIndicator={<CircularProgress size={16} color="inherit" />}
          autoFocus={confirmColor !== "error"}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

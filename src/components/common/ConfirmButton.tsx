import ConfirmDialog, { ConfirmDialogProps } from "./ConfirmDialog";
import DialogButton from "./DialogButton";
import { ReactNode } from "react";
import { ButtonProps } from "@mui/material";

export type ConfirmButtonProps = ButtonProps & {
  children: ReactNode;

  cancelText?: ReactNode;
  cancelLoading?: boolean;
  onCancel?: ConfirmDialogProps["onCancel"];
  disableBackdropClose?: boolean;

  confirmTitle?: ReactNode;
  confirmDescription?: ReactNode;
  confirmText?: ReactNode;
  confirmColor?: ButtonProps["color"];
  confirmVariant?: ButtonProps["variant"];
  confirmLoading?: boolean;
  onConfirm: ConfirmDialogProps["onConfirm"];
};

const ConfirmButton = ({
  children,

  cancelText = "Hủy",
  cancelLoading = false,
  onCancel,
  disableBackdropClose = false,

  confirmTitle = "Xác nhận",
  confirmDescription,
  confirmText = "Xác nhận",
  confirmColor = "primary",
  confirmLoading = false,
  confirmVariant = "contained",
  onConfirm,

  ...props
}: ConfirmButtonProps) => {
  return (
    <DialogButton
      {...props}
      dialog={({ open, closeDialog }) => (
        <ConfirmDialog
          open={open}
          closeDialog={closeDialog}
          cancelText={cancelText}
          cancelLoading={cancelLoading}
          onCancel={onCancel}
          disableBackdropClose={disableBackdropClose}
          title={confirmTitle}
          description={confirmDescription}
          confirmText={confirmText}
          confirmColor={confirmColor}
          confirmVariant={confirmVariant}
          confirmLoading={confirmLoading}
          onConfirm={onConfirm}
        />
      )}
    >
      {children}
    </DialogButton>
  );
};

export default ConfirmButton;

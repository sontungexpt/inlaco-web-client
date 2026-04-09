import { ReactNode, useState } from "react";
import { Button, ButtonProps, Dialog } from "@mui/material";

export type DialogButtonProps = ButtonProps & {
  children: ReactNode;
  dialog?: (props: { open: boolean; closeDialog: () => void }) => ReactNode;
};

export default function DialogButton({
  children,
  dialog: InternalDialog = Dialog,
  ...buttonProps
}: DialogButtonProps) {
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <>
      <Button {...buttonProps} onClick={openDialog}>
        {children}
      </Button>
      <InternalDialog open={open} closeDialog={closeDialog} />
    </>
  );
}

import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material";
import { Typography, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TemplateContractList from "./TemplateContractList";
import TemplateContractCard from "./TemplateContractCard";
import { ContractType } from "@/types/api/contract.api";

export type TemplateDialogProps = DialogProps & {
  type?: ContractType;
  initialData: (() => any) | any;
  title: string;
  render?: (item: any) => React.ReactNode;
};

export default function TemplateDialog({
  open,
  onClose,
  type,
  initialData,
  title,
  sx,
  render = (item) => (
    <TemplateContractCard
      key={item.id}
      url={item.metadata?.url}
      title={item.name}
      type={item.type}
      dowloadFileName={item.name}
      initialData={initialData}
    />
  ),
  ...props
}: TemplateDialogProps) {
  return (
    <Dialog
      {...props}
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      open={open}
      onClose={onClose as DialogProps["onClose"]}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={700} fontSize={18}>
          {title}
        </Typography>

        <IconButton onClick={(e) => onClose?.(e, "backdropClick")}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TemplateContractList type={type} render={render} />
      </DialogContent>
    </Dialog>
  );
}

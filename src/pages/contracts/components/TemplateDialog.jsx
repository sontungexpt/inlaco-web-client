import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Typography, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TemplateContractList from "./TemplateContractList";
import TemplateContractCard from "./TemplateContractCard";

export default function TemplateDialog({
  open,
  type,
  initialData,
  onClose,
  title,
  render,
  sx,
  ...props
}) {
  return (
    <Dialog
      sx={[
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      open={open}
      onClose={onClose}
      {...props}
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

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TemplateContractList
          render={(item) => (
            <TemplateContractCard
              key={item.id}
              url={item.metadata?.url}
              title={item.name}
              type={item.type}
              dowloadFileName={item.name}
              initialData={initialData}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  );
}

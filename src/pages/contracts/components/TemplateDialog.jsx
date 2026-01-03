import { Dialog } from "@mui/material";
import { Box, Grid, Typography, IconButton } from "@mui/material";
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
  ...props
}) {
  return (
    <Dialog {...props} open={open} onClose={onClose}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={700} fontSize={18}>
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <TemplateContractList
        p={3}
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
    </Dialog>
  );
}

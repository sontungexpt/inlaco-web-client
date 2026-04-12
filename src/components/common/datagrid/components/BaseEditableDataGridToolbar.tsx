import { Box, BoxProps, Button, ButtonProps } from "@mui/material";

export type BaseEditableDataGridToolbarProps = BoxProps & {
  onNewRowClick: ButtonProps["onClick"];
};

export default function BaseEditableDataGridToolbar({
  onNewRowClick,
}: BaseEditableDataGridToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 1,
      }}
    >
      <Button variant="outlined" size="small" onClick={onNewRowClick}>
        + Thêm hàng mới
      </Button>
    </Box>
  );
}

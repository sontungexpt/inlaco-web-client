import { Box, BoxProps, Button, ButtonProps } from "@mui/material";

export type BaseEditableDataGridToolbarProps = BoxProps & {
  onNewRowClick: ButtonProps["onClick"];
  newRowDisabled?: boolean;
};

export default function BaseEditableDataGridToolbar({
  onNewRowClick,
  newRowDisabled = false,
  ...boxProps
}: BaseEditableDataGridToolbarProps) {
  return (
    <Box
      {...boxProps}
      sx={[
        {
          display: "flex",
          mb: 1,
        },
        ...(Array.isArray(boxProps.sx) ? boxProps.sx : [boxProps.sx]),
      ]}
    >
      <Button
        variant="outlined"
        size="small"
        onClick={onNewRowClick}
        disabled={newRowDisabled}
      >
        + Thêm hàng mới
      </Button>
    </Box>
  );
}

import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  FormHelperText,
} from "@mui/material";

export type BaseEditableDataGridToolbarProps = BoxProps & {
  onNewRowClick: ButtonProps["onClick"];
  newRowDisabled?: boolean;

  error?: boolean;
  helperText?: React.ReactNode;
};

export default function BaseEditableDataGridToolbar({
  onNewRowClick,
  newRowDisabled = false,
  error = false,
  helperText,
  ...boxProps
}: BaseEditableDataGridToolbarProps) {
  return (
    <Box
      {...boxProps}
      sx={[
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
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
        color={error ? "error" : "primary"}
      >
        + Thêm hàng mới
      </Button>

      {helperText && (
        <FormHelperText
          error={error}
          sx={{
            ml: 0,
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

import React from "react";
import { Box, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PageTitle from "../PageTitle";

export default function LoadErrorState({
  title = "Không thể tải dữ liệu",
  subtitle = "Dữ liệu không tồn tại hoặc đã bị xóa",
  onBack,
  onRetry,
  minHeight = 300,
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
      textAlign="center"
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />

      <PageTitle title={title} subtitle={subtitle} />

      <Box mt={3} display="flex" gap={2}>
        {onBack && (
          <Button variant="outlined" onClick={onBack}>
            Quay lại
          </Button>
        )}

        {onRetry && (
          <Button variant="contained" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </Box>
    </Box>
  );
}

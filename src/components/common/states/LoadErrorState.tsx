import { Box, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PageTitle from "../PageTitle";
import { useNavigate } from "react-router";

export type LoadErrorStateProps = {
  title?: string;
  subtitle?: string;

  showBack?: boolean;
  onBack?: () => void;
  showRetry?: boolean;
  onRetry?: () => void;

  minHeight?: number;
};

export default function LoadErrorState({
  title = "Không thể tải dữ liệu",
  subtitle = "Dữ liệu không tồn tại hoặc đã bị xóa",
  showBack = true,
  onBack,

  showRetry = true,
  onRetry,

  minHeight = 300,
}: LoadErrorStateProps) {
  const navigate = useNavigate();

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
        {showBack && (
          <Button variant="outlined" onClick={onBack || (() => navigate(-1))}>
            Quay lại
          </Button>
        )}

        {showRetry && (
          <Button variant="contained" onClick={onRetry}>
            Thử lại
          </Button>
        )}
      </Box>
    </Box>
  );
}

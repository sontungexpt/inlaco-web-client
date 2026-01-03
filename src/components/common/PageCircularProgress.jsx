import { Box, CircularProgress, Typography } from "@mui/material";
import Color from "@constants/Color";

export default function PageCircularProgress({
  text = "Đang tải...",
  fullHeight = true,
}) {
  return (
    <Box
      sx={{
        minHeight: fullHeight ? "100vh" : "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        backgroundColor: "#f9fafb",
      }}
    >
      <CircularProgress
        size={48}
        thickness={4}
        sx={{ color: Color.PrimaryBlue }}
      />

      {text && (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          {text}
        </Typography>
      )}
    </Box>
  );
}

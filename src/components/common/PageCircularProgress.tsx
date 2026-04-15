import { Box, CircularProgress, Typography } from "@mui/material";
import Color from "@constants/Color";

export type PageCircularProgressProps = {
  text?: string;
  fullHeight?: boolean;
};

export default function PageCircularProgress({
  text = "Đang tải...",
  fullHeight = true,
}: PageCircularProgressProps) {
  return (
    <Box
      sx={{
        backgroundColor: Color.PrimaryWhite,
        minHeight: fullHeight ? "100vh" : "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
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

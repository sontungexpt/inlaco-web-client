import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function E404() {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 5,
      }}
    >
      {/* Header */}
      <Typography
        variant="h2"
        sx={{ fontWeight: 800, mb: 2, color: "error.main" }}
      >
        404 - Not Found
      </Typography>

      {/* GIF */}
      <Box
        component="img"
        src={require("@assets/gifs/404.gif")}
        alt="404 animation"
        sx={{
          width: "100%",
          maxWidth: 400,
          mb: 4,
          borderRadius: 2,
        }}
      />

      {/* Message */}
      <Typography variant="h5" fontWeight={600}>
        Có vẻ như bạn đang bị lạc 👀
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Trang bạn truy cập hiện không tồn tại hoặc đã bị di chuyển!
      </Typography>

      {/* Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
        to="/"
        sx={{ textTransform: "none", borderRadius: 2, px: 4, py: 1.4 }}
      >
        Về trang chủ
      </Button>
    </Container>
  );
}

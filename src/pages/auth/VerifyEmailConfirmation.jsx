import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link } from "react-router";
import EmailIcon from "@mui/icons-material/Email";
import Color from "@constants/Color";

const RESEND_TIMEOUT = 30;

const VerifyEmailConfirmation = () => {
  const [cooldown, setCooldown] = useState(RESEND_TIMEOUT);

  const isDisabled = cooldown > 0;

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendVerifyLink = async () => {
    if (isDisabled) return;

    setCooldown(RESEND_TIMEOUT);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Color.PrimaryBlue,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 520,
          p: 5,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <EmailIcon sx={{ fontSize: 56, color: Color.PrimaryBlue, mb: 2 }} />

        <Typography fontSize={22} fontWeight={700} mb={2}>
          Xác minh email
        </Typography>

        <Typography fontSize={14} color="text.secondary" mb={4}>
          Chúng tôi đã gửi cho bạn một email chứa liên kết xác minh.
          <br />
          Vui lòng kiểm tra hộp thư và bấm vào đường link để kích hoạt tài
          khoản.
        </Typography>

        <Stack spacing={2}>
          <Button component={Link} to="/login" variant="contained" fullWidth>
            Tôi đã xác minh, quay lại đăng nhập
          </Button>

          <Button
            variant="text"
            disabled={isDisabled}
            onClick={handleResendVerifyLink}
          >
            {isDisabled ? `Gửi lại sau ${cooldown}s` : "Gửi lại email xác minh"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default VerifyEmailConfirmation;

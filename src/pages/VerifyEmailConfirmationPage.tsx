import { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { Link, useLocation } from "react-router";
import EmailIcon from "@mui/icons-material/Email";
import Color from "@constants/Color";
import toast from "react-hot-toast";
import { resendTwoStepVerification } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

const RESEND_INTERVAL = 30;

const VerifyEmailConfirmationPage = () => {
  const { username } = useLocation().state || {};

  const [deadline, setDeadline] = useState(Date.now() + RESEND_INTERVAL * 1000);
  const [counter, setCounter] = useState(RESEND_INTERVAL);

  const resendMutation = useMutation({
    mutationFn: async () => {
      if (!username) {
        throw new Error("Thiếu thông tin email để gửi lại xác thực");
      }
      await resendTwoStepVerification({ username });
    },
    onSuccess: () => {
      setDeadline(Date.now() + RESEND_INTERVAL * 1000);
    },
    onError: (error: unknown) => {
      toast.error("Gửi lại email xác thực thất bại vui lòng thử lại sau!");
    },
  });

  // Countdown
  useEffect(() => {
    if (deadline <= Date.now()) {
      setCounter(0);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setCounter(remaining);
      if (remaining > 0) {
        timeout = setTimeout(tick, 1000);
      }
    };

    timeout = setTimeout(tick, 1000);

    return () => clearTimeout(timeout);
  }, [deadline]);

  const handleResendVerifyLink = async () => {
    try {
      await resendTwoStepVerification({ username });
    } catch (error) {}
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
            disabled={counter > 0 || resendMutation.isPending || !username}
            onClick={handleResendVerifyLink}
          >
            {counter > 0 ? `Gửi lại sau ${counter}s` : "Gửi lại email xác thực"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default VerifyEmailConfirmationPage;

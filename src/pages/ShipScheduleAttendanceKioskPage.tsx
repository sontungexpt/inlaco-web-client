import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import {
  Box,
  Stack,
  Typography,
  LinearProgress,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Fade,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import { QRCodeSVG } from "qrcode.react";

import { useGenerateAttendanceQR } from "@/queries/attendance.query";
import { useShipScheduleDetail } from "@/queries/ship-schedule.query";

import type { CheckType, AttendanceMethod } from "@/types/api/attendance.api";

import { ImageAssets } from "@/constants/Asset";

const QR_REFRESH_SECONDS = 60;

const KIOSK_PASSWORD = "123456";

const SECRET_TAP_COUNT = 5;

export const useShipScheduleAttendanceKioskPageParams = (): {
  type: CheckType;
  method: AttendanceMethod;
} => {
  const [searchParams] = useSearchParams();

  return {
    type: (searchParams.get("type") || "IN") as CheckType,
    method: (searchParams.get("method") || "QR_CODE") as AttendanceMethod,
  };
};

export default function ShipScheduleAttendanceKioskPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { type: checkType } = useShipScheduleAttendanceKioskPageParams();

  const { data: shipSchedule } = useShipScheduleDetail(id);

  const { mutateAsync: generateQrCode, isPending: isGenerating } =
    useGenerateAttendanceQR();

  const [qrToken, setQrToken] = useState("");

  const [countdown, setCountdown] = useState(QR_REFRESH_SECONDS);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [showControls, setShowControls] = useState(false);

  const [showExitDialog, setShowExitDialog] = useState(false);

  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [now, setNow] = useState(new Date());

  const [logoUnlocked, setLogoUnlocked] = useState(false);

  const logoTapCountRef = useRef(0);

  const logoTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ================= QR SIZE =================
  const qrSize = useMemo(() => {
    const sizeFromHeight = window.innerHeight * 0.4;

    const sizeFromWidth = window.innerWidth * 0.38;

    return Math.min(sizeFromHeight, sizeFromWidth, 420);
  }, []);

  // ================= CLOCK =================
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= FULLSCREEN =================
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // ================= GENERATE QR =================
  const generateNewQr = async () => {
    if (!id) return;

    const data = await generateQrCode({
      shipScheduleId: id,
      checkType,
    });

    setQrToken(data.token);

    setCountdown(QR_REFRESH_SECONDS);
  };

  useEffect(() => {
    generateNewQr();
  }, [checkType]);

  useEffect(() => {
    const interval = setInterval(() => {
      generateNewQr();
    }, QR_REFRESH_SECONDS * 1000);

    return () => clearInterval(interval);
  }, [checkType]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return QR_REFRESH_SECONDS;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= FULLSCREEN =================
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();

        return;
      }

      setShowExitDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnterKiosk = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= EXIT =================
  const handleVerifyExit = async () => {
    if (password !== KIOSK_PASSWORD) {
      setPasswordError("Sai mật khẩu");

      return;
    }

    await document.exitFullscreen();

    setShowExitDialog(false);

    setPassword("");

    setPasswordError("");
  };

  // ================= SWITCH MODE =================
  const handleSwitchMode = () => {
    navigate(
      `/ship-schedules/${id}/attendance/qr?type=${
        checkType === "IN" ? "OUT" : "IN"
      }`,
    );
  };

  // ================= SECRET TAP =================
  const handleLogoTap = () => {
    logoTapCountRef.current += 1;

    if (logoTapTimeoutRef.current) {
      clearTimeout(logoTapTimeoutRef.current);
    }

    logoTapTimeoutRef.current = setTimeout(() => {
      logoTapCountRef.current = 0;
    }, 1800);

    if (logoTapCountRef.current < SECRET_TAP_COUNT) {
      return;
    }

    logoTapCountRef.current = 0;

    setShowControls((prev) => !prev);

    setLogoUnlocked(true);

    setTimeout(() => {
      setLogoUnlocked(false);
    }, 1200);
  };

  const progressValue = (countdown / QR_REFRESH_SECONDS) * 100;

  const modeColor = checkType === "IN" ? "#22c55e" : "#ef4444";

  return (
    <>
      <Box
        sx={{
          height: "100vh",

          overflow: "hidden",

          position: "relative",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          px: 3,

          py: 2,

          color: "#ffffff",

          background: `
            radial-gradient(circle at top left, rgba(59,130,246,0.22), transparent 28%),
            radial-gradient(circle at top right, rgba(168,85,247,0.18), transparent 30%),
            radial-gradient(circle at bottom, rgba(34,197,94,0.12), transparent 35%),
            linear-gradient(180deg, #020617 0%, #0f172a 100%)
          `,
        }}
      >
        {/* TOP BAR */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: "absolute",

            top: 18,

            left: 22,

            right: 22,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,

              fontWeight: 700,

              letterSpacing: 1.5,

              color: "rgba(255,255,255,0.8)",
            }}
          >
            {now.toLocaleTimeString()}
          </Typography>

          <Fade in={showControls}>
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={handleSwitchMode}
                sx={{
                  color: "#fff",

                  bgcolor: "rgba(255,255,255,0.08)",

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.14)",
                  },
                }}
              >
                <SwapHorizRoundedIcon />
              </IconButton>

              <IconButton
                onClick={generateNewQr}
                sx={{
                  color: "#fff",

                  bgcolor: "rgba(255,255,255,0.08)",

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.14)",
                  },
                }}
              >
                <RefreshRoundedIcon />
              </IconButton>

              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  color: "#fff",

                  bgcolor: "rgba(255,255,255,0.08)",

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.14)",
                  },
                }}
              >
                {isFullscreen ? (
                  <FullscreenExitRoundedIcon />
                ) : (
                  <FullscreenRoundedIcon />
                )}
              </IconButton>
            </Stack>
          </Fade>
        </Stack>

        {/* CONTENT */}
        <Stack alignItems="center">
          <Typography
            sx={{
              mb: 1,

              fontSize: 15,

              letterSpacing: 4,

              color: "rgba(255,255,255,0.7)",
            }}
          >
            CREW ATTENDANCE KIOSK
          </Typography>

          {!isFullscreen && (
            <Button
              variant="contained"
              startIcon={<LockRoundedIcon />}
              onClick={handleEnterKiosk}
              sx={{
                mt: 2,

                mb: 4,

                px: 4,

                py: 1.1,

                borderRadius: 999,

                fontWeight: 800,

                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",

                boxShadow: "0 10px 30px rgba(37,99,235,0.35)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
                },
              }}
            >
              ENTER KIOSK MODE
            </Button>
          )}

          {/* MODE */}
          <Box
            sx={{
              mb: 4,

              px: 4,

              py: 1.1,

              borderRadius: 999,

              bgcolor:
                checkType === "IN"
                  ? "rgba(34,197,94,0.14)"
                  : "rgba(239,68,68,0.14)",

              border: `1px solid ${modeColor}66`,

              boxShadow: `0 0 40px ${modeColor}22`,
            }}
          >
            <Typography
              sx={{
                fontSize: 24,

                fontWeight: 900,

                letterSpacing: 1,

                color: modeColor,
              }}
            >
              {checkType === "IN" ? "CHECK-IN" : "CHECK-OUT"}
            </Typography>
          </Box>

          {/* QR CARD */}
          <Box
            sx={{
              position: "relative",

              p: 2,

              borderRadius: 5,

              bgcolor: "#ffffff",

              boxShadow: `
                0 25px 80px rgba(0,0,0,0.45),
                0 0 80px rgba(255,255,255,0.08)
              `,
            }}
          >
            <QRCodeSVG value={qrToken} size={qrSize} level="H" includeMargin />

            {isGenerating && (
              <Box
                sx={{
                  position: "absolute",

                  inset: 0,

                  borderRadius: 5,

                  bgcolor: "rgba(255,255,255,0.72)",

                  backdropFilter: "blur(2px)",
                }}
              />
            )}
          </Box>

          {/* COUNTDOWN */}
          <Typography
            sx={{
              mt: 3,

              mb: 1.2,

              fontSize: 14,

              color: "rgba(255,255,255,0.72)",
            }}
          >
            QR refreshes in {countdown}s
          </Typography>

          <Box width="100%" maxWidth={420}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 7,

                borderRadius: 999,

                bgcolor: "rgba(255,255,255,0.08)",

                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,

                  background: `linear-gradient(90deg, ${modeColor}, ${modeColor}aa)`,
                },
              }}
            />
          </Box>

          {/* SHIP */}
          <Typography
            sx={{
              mt: 3,

              fontSize: 13,

              letterSpacing: 1.2,

              color: "rgba(255,255,255,0.45)",
            }}
          >
            {shipSchedule?.shipInfo?.name || "UNKNOWN"} • IMO{" "}
            {shipSchedule?.shipInfo?.imoNumber || "--"}
          </Typography>
        </Stack>

        {/* SECRET LOGO */}
        <Box
          onClick={handleLogoTap}
          sx={{
            position: "absolute",

            right: 20,

            bottom: 18,

            opacity: logoUnlocked ? 0.9 : 0.28,

            transition: "all 0.25s ease",

            transform: logoUnlocked ? "scale(1.08)" : "scale(1)",

            filter: logoUnlocked
              ? "drop-shadow(0 0 18px rgba(255,255,255,0.35))"
              : "drop-shadow(0 0 10px rgba(255,255,255,0.08))",

            userSelect: "none",

            WebkitTapHighlightColor: "transparent",
          }}
        >
          <Box
            component="img"
            src={ImageAssets.InlacoLogo}
            alt="INLACO"
            sx={{
              height: 44,

              width: "auto",

              objectFit: "contain",

              pointerEvents: "none",
            }}
          />
        </Box>
      </Box>

      {/* EXIT DIALOG */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={800} mb={2}>
            Exit kiosk mode
          </Typography>

          <TextField
            fullWidth
            autoFocus
            type="password"
            label="Password"
            value={password}
            error={Boolean(passwordError)}
            helperText={passwordError}
            onChange={(e) => {
              setPassword(e.target.value);

              setPasswordError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleVerifyExit();
              }
            }}
          />

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setShowExitDialog(false)}
            >
              Cancel
            </Button>

            <Button fullWidth variant="contained" onClick={handleVerifyExit}>
              Confirm
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

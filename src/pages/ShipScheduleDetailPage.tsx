import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Chip,
  Paper,
  Divider,
} from "@mui/material";

import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import DirectionsBoatRoundedIcon from "@mui/icons-material/DirectionsBoatRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import {
  SectionWrapper,
  PageTitle,
  InfoItem,
  BaseDataGrid,
} from "@/components/common";

import { useShipScheduleDetail } from "@/queries/ship-schedule.query";

export default function ShipScheduleDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: shipSchedule, isLoading } = useShipScheduleDetail(id);

  // ================= CREW TABLE =================
  const columns = useMemo(
    () => [
      {
        key: "employeeCardId",
        name: "Mã thẻ",
      },
      {
        key: "fullName",
        name: "Họ tên",
      },
      {
        key: "rankOnBoard",
        name: "Chức danh",
      },
      {
        key: "phoneNumber",
        name: "SĐT",
      },
      {
        key: "gender",
        name: "Giới tính",
      },
    ],
    [],
  );

  // ================= OPEN KIOSK =================
  const openKiosk = (type: "IN" | "OUT") => {
    const base = window.location.href.split("#")[0];

    const url = `${base}#/ship-schedules/${id}/attendance/qr?type=${type}`;
    // Open kiosk in the new tab
    window.open(url, "_blank", "noopener,noreferrer");

    // navigate(`/ship-schedules/${id}/attendance/qr?type=${type}`);
  };

  return (
    <Box p={3}>
      {/* ================= HERO ================= */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          mb: 4,

          background:
            "linear-gradient(135deg, #020617 0%, #0f172a 45%, #111827 100%)",

          color: "#fff",
        }}
      >
        {/* background glow */}
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.04)",
          }}
        />

        <Box p={{ xs: 3, md: 5 }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            justifyContent="space-between"
            spacing={5}
          >
            {/* ================= LEFT ================= */}
            <Box flex={1}>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <DirectionsBoatRoundedIcon sx={{ fontSize: 36 }} />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={900} letterSpacing={1}>
                    SHIP ATTENDANCE
                  </Typography>

                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    QR Kiosk Management System
                  </Typography>
                </Box>
              </Stack>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 16,
                  lineHeight: 1.9,
                  maxWidth: 760,
                }}
              >
                Quản lý check-in/check-out thuyền viên bằng QR realtime.
                Attendance QR sẽ tự động rotate định kỳ để tăng bảo mật và chống
                reuse token.
              </Typography>

              {/* ship chips */}
              <Stack
                direction="row"
                spacing={1.5}
                mt={4}
                flexWrap="wrap"
                useFlexGap
              >
                <Chip
                  label={shipSchedule?.shipInfo?.name || "Unknown Ship"}
                  sx={chipStyle}
                />

                <Chip
                  label={`IMO ${shipSchedule?.shipInfo?.imoNumber || "--"}`}
                  sx={chipStyle}
                />

                <Chip
                  label={`${shipSchedule?.departurePort || "--"} → ${
                    shipSchedule?.arrivalPort || "--"
                  }`}
                  sx={chipStyle}
                />
              </Stack>
            </Box>

            {/* ================= RIGHT ================= */}
            <Stack
              spacing={2}
              width={{ xs: "100%", lg: 340 }}
              justifyContent="center"
            >
              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<LoginRoundedIcon />}
                onClick={() => openKiosk("IN")}
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  fontWeight: 800,
                  fontSize: 16,

                  background:
                    "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",

                  boxShadow: "0 12px 30px rgba(34,197,94,0.25)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                  },
                }}
              >
                OPEN CHECK-IN KIOSK
              </Button>

              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<LogoutRoundedIcon />}
                onClick={() => openKiosk("OUT")}
                sx={{
                  py: 1.8,
                  borderRadius: 4,
                  fontWeight: 800,
                  fontSize: 16,

                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",

                  boxShadow: "0 12px 30px rgba(239,68,68,0.25)",

                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                  },
                }}
              >
                OPEN CHECK-OUT KIOSK
              </Button>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                startIcon={<OpenInFullRoundedIcon />}
                onClick={() =>
                  window.open(
                    `/ship-schedules/${id}/attendance/qr?type=IN`,
                    "_blank",
                  )
                }
                sx={{
                  py: 1.6,
                  borderRadius: 4,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.18)",

                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                OPEN FULLSCREEN MODE
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* ================= PAGE TITLE ================= */}
      <SectionWrapper>
        <PageTitle
          title="CHI TIẾT LỊCH TÀU"
          subtitle="Thông tin hành trình và danh sách thuyền viên"
        />
      </SectionWrapper>

      {/* ================= QUICK STATS ================= */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickCard
            icon={<GroupsRoundedIcon />}
            title="Tổng thuyền viên"
            value={shipSchedule?.crews?.length || 0}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <QuickCard
            icon={<RouteRoundedIcon />}
            title="Tuyến hành trình"
            value={shipSchedule?.route || "--"}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <QuickCard
            icon={<AccessTimeRoundedIcon />}
            title="QR Rotation"
            value="20s"
          />
        </Grid>
      </Grid>

      {/* ================= SHIP INFO ================= */}
      <SectionWrapper title="Thông tin tàu">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Tên tàu" value={shipSchedule?.shipInfo?.name} />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <InfoItem label="IMO" value={shipSchedule?.shipInfo?.imoNumber} />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem label="Cảng đi" value={shipSchedule?.departurePort} />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem label="Cảng đến" value={shipSchedule?.arrivalPort} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Tuyến" value={shipSchedule?.route} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Khởi hành"
              value={shipSchedule?.departureTime}
              type="datetime-local"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Cập cảng"
              value={shipSchedule?.arrivalTime}
              type="datetime-local"
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      <Divider sx={{ my: 3 }} />

      {/* ================= CREW ================= */}
      <SectionWrapper title="Danh sách thuyền viên">
        <BaseDataGrid
          loading={isLoading}
          rows={shipSchedule?.crews || []}
          columns={columns}
          globalTooltip="Double click để xem hồ sơ"
          onCellDoubleClick={({ row }) => {
            navigate(`/crews/${row.profileId}`);
          }}
        />
      </SectionWrapper>
    </Box>
  );
}

// ================= SHARED =================

const chipStyle = {
  bgcolor: "rgba(255,255,255,0.1)",
  color: "#fff",
  borderRadius: 999,
  backdropFilter: "blur(12px)",
};

function QuickCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: "rgba(59,130,246,0.08)",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

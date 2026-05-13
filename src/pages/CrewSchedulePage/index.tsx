import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DirectionsBoatRoundedIcon from "@mui/icons-material/DirectionsBoatRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import PageTitle from "@/components/common/PageTitle";
import { fetchMyMobilizations } from "@/services/mobilization.service";
import { MobilizationSchedule, MobilizationScheduleStatus } from "@/types/api/mobilization.api";
import { dateToLocaleString } from "@/utils/converter/datetime";

const STATUS_CONFIG: Record<
  MobilizationScheduleStatus,
  { label: string; color: string; bg: string }
> = {
  DRAFT: { label: "Nháp", color: "#fff", bg: "#9E9E9E" },
  SCHEDULED: { label: "Đã lên lịch", color: "#fff", bg: "#195CAC" },
  IN_PROGRESS: { label: "Đang thực hiện", color: "#fff", bg: "#2E7D32" },
  COMPLETED: { label: "Hoàn thành", color: "#fff", bg: "#546E7A" },
  CANCELLED: { label: "Đã huỷ", color: "#fff", bg: "#C62828" },
};

const toCalendarEvent = (m: MobilizationSchedule) => {
  const cfg = STATUS_CONFIG[m.status] ?? STATUS_CONFIG.DRAFT;
  // FullCalendar end is exclusive — add 1 day so last day is included visually
  const endExclusive = new Date(m.endDate);
  endExclusive.setDate(endExclusive.getDate() + 1);

  return {
    id: m.id,
    title: m.shipInfo?.name ?? "Chuyến tàu",
    start: m.startDate,
    end: endExclusive.toISOString(),
    backgroundColor: cfg.bg,
    borderColor: cfg.bg,
    textColor: cfg.color,
    extendedProps: { mobilization: m },
  };
};

export default function CrewSchedulePage() {
  const [events, setEvents] = useState<ReturnType<typeof toCalendarEvent>[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<MobilizationSchedule | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMyMobilizations();
        setEvents(data.map(toCalendarEvent));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleEventClick = (info: any) => {
    setSelected(info.event.extendedProps.mobilization as MobilizationSchedule);
  };

  const mob = selected;
  const statusCfg = mob ? (STATUS_CONFIG[mob.status] ?? STATUS_CONFIG.DRAFT) : null;

  return (
    <Box m="20px">
      <PageTitle title="Lịch tàu" subtitle="Lịch trình điều động của bạn" />

      <Box mt={3} sx={{ opacity: loading ? 0.5 : 1, transition: "opacity 0.2s" }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale="vi"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth",
          }}
          buttonText={{ today: "Hôm nay", month: "Tháng", list: "Danh sách" }}
          events={events}
          eventClick={handleEventClick}
          eventDisplay="block"
          dayMaxEvents={3}
          height="auto"
          eventClassNames="fc-event-pointer"
        />
      </Box>

      {/* Legend */}
      <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
        {(Object.entries(STATUS_CONFIG) as [MobilizationScheduleStatus, typeof STATUS_CONFIG[MobilizationScheduleStatus]][]).map(
          ([, cfg]) => (
            <Chip
              key={cfg.label}
              label={cfg.label}
              size="small"
              sx={{ backgroundColor: cfg.bg, color: cfg.color, fontWeight: 600 }}
            />
          ),
        )}
      </Stack>

      {/* Detail dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Typography fontWeight={700} fontSize={17}>
            Chi tiết chuyến tàu
          </Typography>
          <IconButton onClick={() => setSelected(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        {mob && (
          <DialogContent dividers>
            <Stack spacing={2}>
              {statusCfg && (
                <Chip
                  label={statusCfg.label}
                  sx={{ backgroundColor: statusCfg.bg, color: statusCfg.color, fontWeight: 700, alignSelf: "flex-start" }}
                />
              )}

              <Stack direction="row" alignItems="center" spacing={1}>
                <DirectionsBoatRoundedIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tàu
                  </Typography>
                  <Typography fontWeight={600}>
                    {mob.shipInfo?.name ?? "—"}
                    {mob.shipInfo?.imoNumber ? ` (IMO: ${mob.shipInfo.imoNumber})` : ""}
                  </Typography>
                  {mob.shipInfo?.type && (
                    <Typography variant="body2" color="text.secondary">
                      {mob.shipInfo.type}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarMonthRoundedIcon color="primary" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Thời gian
                  </Typography>
                  <Typography fontWeight={600}>
                    {dateToLocaleString(mob.startDate, "date")} → {dateToLocaleString(mob.endDate, "date")}
                  </Typography>
                </Box>
              </Stack>

              {mob.partnerName && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnRoundedIcon color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Đối tác
                    </Typography>
                    <Typography fontWeight={600}>{mob.partnerName}</Typography>
                    {mob.partnerPhone && (
                      <Typography variant="body2" color="text.secondary">
                        {mob.partnerPhone}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              )}

              {mob.crews?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" mb={0.5} display="block">
                    Thuyền viên trên chuyến ({mob.crews.length})
                  </Typography>
                  <Stack spacing={0.5}>
                    {mob.crews.map((c) => (
                      <Typography key={c.id} variant="body2">
                        • {c.fullName} — {c.rankOnBoard}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </DialogContent>
        )}
      </Dialog>

      <style>{`.fc-event-pointer { cursor: pointer; }`}</style>
    </Box>
  );
}

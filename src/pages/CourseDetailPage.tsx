import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  AppRegistrationRounded,
  SchoolRounded,
  PersonRounded,
  CalendarMonthRounded,
  DescriptionRounded,
  CheckCircleRounded,
  HourglassBottomRounded,
  CancelRounded,
} from "@mui/icons-material";
import { useParams } from "react-router";

import {
  PageTitle,
  SectionWrapper,
  CloudinaryImage,
  InfoItem,
  CenterCircularProgress,
} from "@components/common";
import Color from "@constants/Color";
import { useCourse } from "@/queries/course.query";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";
import { dateToLocaleString } from "@/utils/converter";
import { enrollCourse, cancelCourse } from "@/services/course.service";
import toast from "react-hot-toast";

/* ================= Utils ================= */
const formatDate = (value: any) => (value ? dateToLocaleString(value) : "--");

/* ================= Status Chip ================= */
type EnrollmentStatus = "CANCELLED" | "ENROLLED" | "FORCIBLY_FINISHED";

const STATUS_CONFIG: Record<
  EnrollmentStatus,
  {
    label: string;
    color: "error" | "warning" | "info";
    icon: React.ReactElement;
  }
> = {
  CANCELLED: {
    label: "Đã hủy",
    color: "error",
    icon: <CancelRounded fontSize="small" />,
  },

  FORCIBLY_FINISHED: {
    label: "Kết thúc cưỡng chế",
    color: "warning",
    icon: <CheckCircleRounded fontSize="small" />,
  },

  ENROLLED: {
    label: "Đang tham gia",
    color: "info",
    icon: <HourglassBottomRounded fontSize="small" />,
  },
};

export const StatusChip = ({ status }: { status?: EnrollmentStatus }) => {
  const config = status ? STATUS_CONFIG[status] : null;

  if (!config) {
    return (
      <Chip
        size="small"
        label="Chưa đăng ký"
        variant="outlined"
        sx={{
          fontWeight: 600,
        }}
      />
    );
  }

  return (
    <Chip
      size="small"
      variant="filled"
      icon={config.icon}
      label={config.label}
      color={config.color}
      sx={{
        fontWeight: 600,
        borderRadius: 2,
        "& .MuiChip-icon": {
          ml: 0.5,
        },
      }}
    />
  );
};

/* ================= Main Page ================= */
export default function CourseDetailPage() {
  const { id } = useParams();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: { course, ...userCourseState } = {},
    isLoading,
    refetch,
  } = useCourse(id);
  const progress = course?.completionProgress ?? 0;

  const [enrollLoading, setEnrollLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const handleToggleRegistration = async () => {
    try {
      setToggleLoading(true);
      await cancelCourse(course.id);
      await refetch();
      toast.success(
        course.canceled ? "Đã mở đăng ký khoá học" : "Đã đóng đăng ký khoá học",
      );
    } catch {
      toast.error("Thao tác thất bại, vui lòng thử lại.");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrollLoading(true);
      await enrollCourse(course.id);
      await refetch();
    } catch (error) {
      toast.error("Ký kết thất bại");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  return (
    <Box p={3}>
      <PageTitle
        title="CHI TIẾT KHÓA ĐÀO TẠO"
        subtitle={`Mã khóa học: ${course.id}`}
      />

      {/* ================= HERO ================= */}
      {course.wallpaper && (
        <CloudinaryImage
          publicId={course.wallpaper.publicId}
          sx={{
            width: "100%",
            height: 260,
            my: 3,
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
      )}

      {/* ================= ACTION BAR ================= */}
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        {!isAdmin && (
          <StatusChip
            status={
              course.forciblyFinished
                ? "FORCIBLY_FINISHED"
                : userCourseState.enrolled
                  ? "ENROLLED"
                  : "CANCELLED"
            }
          />
        )}

        <Box display="flex" gap={2}>
          {/* ===== USER REGISTER ===== */}
          {!isAdmin && !userCourseState.enrolled && (
            <Button
              variant="contained"
              onClick={handleEnroll}
              disabled={enrollLoading}
              sx={{
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
                minWidth: 160,
              }}
              startIcon={
                enrollLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <AppRegistrationRounded />
                )
              }
            >
              Đăng ký
            </Button>
          )}

          {/* ===== ADMIN TOGGLE REGISTER ===== */}
          {isAdmin && (
            <Button
              variant="contained"
              onClick={handleToggleRegistration}
              disabled={toggleLoading}
              sx={{
                minWidth: 180,
                backgroundColor: course.canceled
                  ? Color.PrimaryBlue
                  : Color.PrimaryOrgange,
              }}
              startIcon={
                toggleLoading ? (
                  <CircularProgress size={20} />
                ) : course.canceled ? (
                  <CheckCircleRounded />
                ) : (
                  <CancelRounded />
                )
              }
            >
              {course.canceled ? "Mở đăng ký" : "Đóng đăng ký"}
            </Button>
          )}
        </Box>
      </Box>

      {/* ================= COURSE INFO ================= */}
      <SectionWrapper title="Thông tin khóa học">
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem
                  icon={<SchoolRounded color="primary" />}
                  label="Tên khóa học"
                  value={course.name}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <InfoItem
                  icon={<CalendarMonthRounded color="primary" />}
                  label="Ngày bắt đầu"
                  value={formatDate(course.startDate)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <InfoItem
                  icon={<CalendarMonthRounded color="primary" />}
                  label="Ngày kết thúc"
                  value={formatDate(course.endDate)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InfoItem
                  icon={<DescriptionRounded color="primary" />}
                  label="Mô tả"
                  value={course.description}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* ================= TRAINING PROVIDER ================= */}
      <SectionWrapper title="Đơn vị đào tạo">
        <Card>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }} textAlign="center">
                {course.trainingProviderLogo && (
                  <CloudinaryImage
                    publicId={course.trainingProviderLogo.publicId}
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      mx: "auto",
                    }}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 9 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoItem
                      icon={<SchoolRounded color="primary" />}
                      label="Đơn vị đào tạo"
                      value={course.trainingProviderName}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoItem
                      icon={<PersonRounded color="primary" />}
                      label="Giảng viên"
                      value={course.teacherName}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </SectionWrapper>

      {/* ================= USER PROGRESS ================= */}
      {userCourseState.enrolled && (
        <SectionWrapper title="Tiến độ học viên">
          <Card>
            <CardContent>
              <Box mb={2}>
                <Typography fontWeight={600}>
                  Hoàn thành: {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              {userCourseState.certificate && (
                <Button
                  variant="outlined"
                  href={userCourseState.certificate.url}
                  target="_blank"
                >
                  Xem chứng chỉ
                </Button>
              )}
            </CardContent>
          </Card>
        </SectionWrapper>
      )}
    </Box>
  );
}

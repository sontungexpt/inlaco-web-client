import React, { useState } from "react";
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
import { useNavigate, useParams } from "react-router";

import { PageTitle, SectionWrapper, CloudinaryImage } from "@components/common";
import Color from "@constants/Color";
import { useCourse } from "@/hooks/services/course";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";
import { isoToLocaleString } from "@/utils/converter";

/* ================= Utils ================= */
const formatDate = (value) => (value ? isoToLocaleString(value) : "--");

/* ================= Small UI Item ================= */
const InfoItem = ({ icon, label, value }) => {
  if (!value) return null;

  return (
    <Box display="flex" gap={2} alignItems="flex-start">
      {icon}
      <Box>
        <Typography fontSize={12} color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={600}>{value}</Typography>
      </Box>
    </Box>
  );
};

/* ================= Status Chip ================= */
const StatusChip = ({ course }) => {
  if (course.canceled)
    return <Chip icon={<CancelRounded />} label="Đã hủy" color="error" />;
  if (course.forciblyFinished)
    return (
      <Chip
        icon={<CheckCircleRounded />}
        label="Kết thúc cưỡng chế"
        color="warning"
      />
    );
  if (course.enrolled)
    return (
      <Chip
        icon={<HourglassBottomRounded />}
        label="Đang tham gia"
        color="info"
      />
    );

  return <Chip label="Chưa đăng ký" />;
};

/* ================= Main Page ================= */
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const { data: course, isLoading } = useCourse(id);
  const progress = course?.completionProgress ?? 0;

  const [enrollLoading, setEnrollLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const handleToggleRegister = async () => {
    setToggleLoading(true);

    // await toggleCourseRegister(course.id);

    await new Promise((r) => setTimeout(r, 1000));
    setToggleLoading(false);
  };

  const handleEnroll = async () => {
    setEnrollLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setEnrollLoading(false);
  };

  if (isLoading) {
    return (
      <Box
        height="80vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
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
        {!isAdmin && <StatusChip course={course} />}

        <Box display="flex" gap={2}>
          {/* ===== USER REGISTER ===== */}
          {!isAdmin && !course.enrolled && (
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
              onClick={handleToggleRegister}
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
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<SchoolRounded color="primary" />}
                  label="Tên khóa học"
                  value={course.name}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <InfoItem
                  icon={<CalendarMonthRounded color="primary" />}
                  label="Ngày bắt đầu"
                  value={formatDate(course.startDate)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <InfoItem
                  icon={<CalendarMonthRounded color="primary" />}
                  label="Ngày kết thúc"
                  value={formatDate(course.endDate)}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
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
              <Grid item xs={12} md={3} textAlign="center">
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

              <Grid item xs={12} md={9}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem
                      icon={<SchoolRounded color="primary" />}
                      label="Đơn vị đào tạo"
                      value={course.trainingProviderName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
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
      {course.enrolled && (
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

              {course.certificateUrl && (
                <Button
                  variant="outlined"
                  href={course.certificateUrl}
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

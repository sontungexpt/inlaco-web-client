import React from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  Chip,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Color from "@constants/Color";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePost } from "@/hooks/services/post";
import { useMutation } from "@tanstack/react-query";
import { changeRegistrationRecruitmentPostStatus } from "@/services/postServices";
import { dateToLocaleString } from "@/utils/converter";
import {
  CenterCircularProgress,
  InfoItem,
  MarkdownPreview,
} from "@/components/common";

const RecruitmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { roles } = useAuthContext();
  const isAdmin = roles.includes("ADMIN");

  const { data: post, isLoading, refetch: refetchPost } = usePost(id);
  const active = Boolean(post?.active);

  const {
    mutate: toggleRegistrationStatus,
    isPending: isTogglingRegistrationStatus,
  } = useMutation({
    mutationFn: () => changeRegistrationRecruitmentPostStatus(id, !active),
    onSuccess: () => {
      refetchPost();
    },
    onError: () => {
      toast.error("Thay đổi trạng thái thất bại!");
    },
  });

  if (isLoading) {
    return <CenterCircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ======================= HEADER ======================= */}
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          {post?.title}
        </Typography>

        <Typography variant="subtitle1" fontWeight={500} color="text.secondary">
          {post?.description}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {post.workLocation}
        </Typography>

        {/* ======= DÒNG CHIP + BUTTON ======= */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Chip
            label={active ? "Đang tuyển" : "Đã đóng"}
            color={active ? "success" : "error"}
            sx={{ fontSize: 14, px: 2 }}
          />

          {isAdmin && (
            <Button
              variant="contained"
              disabled={isTogglingRegistrationStatus}
              onClick={toggleRegistrationStatus}
              startIcon={
                isTogglingRegistrationStatus ? (
                  <CircularProgress size={22} />
                ) : !active ? (
                  <CheckCircleRoundedIcon />
                ) : (
                  <EventBusyRoundedIcon />
                )
              }
              sx={{
                py: 1.1,
                borderRadius: 2,
                backgroundColor: !active
                  ? Color.PrimaryBlue
                  : Color.PrimaryOrgange,
                minWidth: 180,
              }}
            >
              {active ? "Đóng tuyển dụng" : "Mở tuyển dụng"}
            </Button>
          )}
        </Box>
      </Card>

      {/* ======================= BODY ======================= */}
      <Grid container spacing={3}>
        {/* LEFT: JOB DESCRIPTION */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Mô tả công việc
            </Typography>

            <MarkdownPreview>{post.content}</MarkdownPreview>
          </Card>
        </Grid>

        {/* RIGHT: SUMMARY BOX / SIDEBAR */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, spacing: 2 }}>
            <Typography mb={2} variant="h6" fontWeight={700}>
              Thông tin chung
            </Typography>

            <Stack spacing={2}>
              <InfoItem
                icon={WorkOutlineIcon}
                label="Vị trí đang tuyển dụng"
                value={post?.position}
                bold
              />

              <InfoItem
                icon={PaidOutlinedIcon}
                label="Mức lương"
                value={`${post?.expectedSalary} vnđ`}
                bold
              />

              <InfoItem
                icon={EventAvailableOutlinedIcon}
                label="Ngày mở"
                value={dateToLocaleString(post?.recruitmentStartDate)}
                bold
              />

              <InfoItem
                icon={EventBusyOutlinedIcon}
                label="Ngày đóng"
                value={dateToLocaleString(post?.recruitmentEndDate)}
                bold
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={700}>
              Kỹ năng yêu cầu
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {(post.skills || ["Cẩn thận", "Siêng năng"]).map((s) => (
                <Chip key={s} label={s} />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={700}>
              Thông tin liên hệ
            </Typography>
            <Stack mt={2} spacing={2}>
              <InfoItem
                icon={BusinessOutlinedIcon}
                label="Tên công ty"
                value={post.company}
              />

              <InfoItem
                icon={EmailOutlinedIcon}
                label="Email"
                value={post.contactEmail}
              />

              <InfoItem
                icon={PhoneOutlinedIcon}
                label="Số điện thoại"
                value={post.contactPhone}
                bold
              />
            </Stack>

            {/* ===== BUTTONS ===== */}
            <Stack mt={3} spacing={1.5}>
              {!isAdmin && (
                <Button
                  fullWidth
                  disabled={!isAdmin && !active}
                  variant="contained"
                  color="primary"
                  sx={{ py: 1.2, borderRadius: 2 }}
                  onClick={() => navigate(`/recruitments/apply/${id}`)}
                >
                  Ứng tuyển ngay
                </Button>
              )}

              {/* ADMIN BUTTONS */}
              {isAdmin && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      backgroundColor: Color.PrimaryBlue,
                      "&:hover": { backgroundColor: Color.PrimaryHoverBlue },
                    }}
                    onClick={() =>
                      navigate("/recruitments", {
                        state: {
                          tab: "CANDIDATE",
                          candidate: {
                            recruitmentPostId: id,
                            status: "APPLIED",
                          },
                        },
                      })
                    }
                  >
                    Xem hồ sơ ứng tuyển
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ py: 1.2, borderRadius: 2 }}
                    onClick={() => navigate(`/posts/edit/${id}`)}
                  >
                    Chỉnh sửa bài tuyển dụng
                  </Button>
                </>
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruitmentDetail;

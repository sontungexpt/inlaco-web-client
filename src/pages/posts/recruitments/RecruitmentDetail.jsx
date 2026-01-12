import React from "react";
import {
  Box,
  Card,
  Grid,
  Chip,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Color from "@constants/Color";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { usePost } from "@/hooks/services/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeRegistrationRecruitmentPostStatus } from "@/services/postServices";
import { isoToLocaleString } from "@/utils/converter";
import { CenterCircularProgress } from "@/components/common";

const RecruitmentDetail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { roles } = useAuthContext();
  const isAdmin = roles.includes("ADMIN");

  const { data: post, isLoading } = usePost(id);
  const active = Boolean(post?.active);

  const {
    mutateAsync: changeRegistrationStatus,
    isPending: isTogglingOpenStatus,
  } = useMutation({
    throwOnError: false,
    mutationFn: (active) => changeRegistrationRecruitmentPostStatus(id, active),
    onSuccess: () => {
      queryClient.setQueryData(["post", id], (oldValue) => {
        return {
          ...oldValue,
          active: !active,
        };
      });
    },
  });

  const toggleRecruitmentClosingStatus = async () => {
    try {
      await changeRegistrationStatus(active);
    } catch (err) {
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const handleUserApplicationClick = () => {
    navigate(`/recruitment/apply/${id}`);
  };

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
          📍 {post.workLocation}
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
              disabled={isTogglingOpenStatus}
              onClick={toggleRecruitmentClosingStatus}
              sx={{
                py: 1.1,
                borderRadius: 2,
                backgroundColor: !active
                  ? Color.PrimaryBlue
                  : Color.PrimaryOrgange,
                minWidth: 180,
              }}
            >
              {isTogglingOpenStatus ? (
                <CircularProgress size={22} />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {!active ? (
                    <CheckCircleRoundedIcon sx={{ mr: 1 }} />
                  ) : (
                    <EventBusyRoundedIcon sx={{ mr: 1 }} />
                  )}
                  {active ? "Đóng tuyển dụng" : "Mở tuyển dụng"}
                </Box>
              )}
            </Button>
          )}
        </Box>
      </Card>

      {/* ======================= BODY ======================= */}
      <Grid container spacing={3}>
        {/* LEFT: JOB DESCRIPTION */}
        <Grid item size={8}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>
              Mô tả công việc
            </Typography>

            <Typography sx={{ whiteSpace: "pre-line" }}>
              {post.content}
            </Typography>
          </Card>
        </Grid>

        {/* RIGHT: SUMMARY BOX / SIDEBAR */}
        <Grid item size={4}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            {/* THÔNG TIN CHUNG */}
            <Typography variant="h6" fontWeight={700}>
              Thông tin chung
            </Typography>

            <Box my={1}>
              <Typography fontWeight={600} color="text.secondary">
                📝 Vị trí đang tuyển dụng
              </Typography>
              <Typography>{post?.position}</Typography>
            </Box>

            <Box my={1}>
              <Typography fontWeight={600} color="text.secondary">
                💰 Mức lương
              </Typography>
              <Typography>{post?.expectedSalary} vnđ</Typography>
            </Box>

            <Box my={1}>
              <Typography fontWeight={600} color="text.secondary">
                📅 Ngày mở
              </Typography>
              <Typography>
                {isoToLocaleString(post.recruitmentStartDate)}
              </Typography>
            </Box>

            <Box my={1}>
              <Typography fontWeight={600} color="text.secondary">
                📅 Ngày đóng
              </Typography>
              <Typography>
                {isoToLocaleString(post.recruitmentEndDate)}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Skills */}
            <Typography variant="subtitle1" fontWeight={700}>
              Kỹ năng yêu cầu
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {(post.skills || ["Cẩn thận", "Siêng năng"]).map((s) => (
                <Chip key={s} label={s} />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* THÔNG TIN LIÊN HỆ */}
            <Typography variant="subtitle1" fontWeight={700}>
              Thông tin liên hệ
            </Typography>
            <Box mt={1}>
              <Typography fontWeight={600} color="text.secondary">
                👤 Tên công ty
              </Typography>
              <Typography>{post.company || "—"}</Typography>

              <Typography fontWeight={600} mt={1} color="text.secondary">
                📧 Email
              </Typography>
              <Typography>{post.contactEmail || "—"}</Typography>

              <Typography mt={1} color="text.secondary">
                📞 Số điện thoại
              </Typography>
              <Typography fontWeight={600}>
                {post.contactPhone || "—"}
              </Typography>
            </Box>

            {/* ===== BUTTONS ===== */}
            <Box mt={3} display="flex" flexDirection="column" gap={1.5}>
              {/* USER BUTTON */}
              {!isAdmin && (
                <Button
                  fullWidth
                  disabled={!isAdmin && !active}
                  variant="contained"
                  color="primary"
                  sx={{ py: 1.2, borderRadius: 2 }}
                  onClick={handleUserApplicationClick}
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
                      "&:hover": { backgroundColor: Color.PrimaryBlueDark },
                    }}
                    onClick={() =>
                      navigate("/recruitment", {
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
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecruitmentDetail;

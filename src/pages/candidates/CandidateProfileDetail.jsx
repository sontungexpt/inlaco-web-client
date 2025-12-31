import React from "react";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { InfoTextField, StatusLabel } from "@components/global";
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useNavigate, useParams } from "react-router";
import Color from "@constants/Color";
import { reviewCandidateApplication } from "@/services/postServices";
import { useCandidate } from "@/hooks/services/posts";
import { useMutation } from "@tanstack/react-query";
import CandidateStatus from "@/constants/CandidateStatus";
import toast from "react-hot-toast";
import { isoToLocalDatetime } from "@/utils/converter";

const getFileIcon = (url) => {
  if (!url) return <DescriptionRoundedIcon />;
  if (url.endsWith(".pdf")) return <PictureAsPdfRoundedIcon />;
  return <DescriptionRoundedIcon />;
};

const CandidateProfileDetail = () => {
  const navigate = useNavigate();
  const { candidateID } = useParams();

  const {
    data: candidateInfo,
    isLoading,
    refetch: refetchCandidateInfo,
  } = useCandidate(candidateID);

  const { mutateAsync, isPending: isReviewing } = useMutation({
    mutationFn: (status) => reviewCandidateApplication(candidateID, status),
    onSuccess: () => {
      // // Refetch lại profile ngay lập tức
      refetchCandidateInfo();
      // queryClient.invalidateQueries({
      //   queryKey: ["candidate-profile", candidateID],
      // });
    },
  });
  const resume = candidateInfo?.resume;

  const reviewCandidateAsync = async (status) => {
    try {
      await mutateAsync(status);
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const GENDERS = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const STATUS_MAP = {
    [CandidateStatus.APPLIED]: "Đã nộp",
    [CandidateStatus.WAIT_FOR_INTERVIEW]: "Đang đợi phỏng vấn",
    [CandidateStatus.REJECTED]: "Từ chối",
    [CandidateStatus.CONTRACT_NOT_YET_IN_FORCE]:
      "Đã ký hợp đồng (chưa có hiệu lực)",
    [CandidateStatus.HIRED]: "Hợp đồng đã có hiệu lực",
  };
  const status = candidateInfo?.status;

  const handleApproveClick = async () => {
    if (status === CandidateStatus.REJECTED) {
      await reviewCandidateAsync(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.APPLIED) {
      await reviewCandidateAsync(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.WAIT_FOR_INTERVIEW) {
      navigate(`/crew-contracts/create/${candidateID}`, {
        state: candidateInfo,
      });
    } else if (
      status === CandidateStatus.CONTRACT_NOT_YET_IN_FORCE ||
      status === CandidateStatus.HIRED
    ) {
      navigate(`/crew-contracts/${candidateID}`);
    }
  };

  const handleDeclineClick = async () => {
    await reviewCandidateAsync(CandidateStatus.REJECTED);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Chi tiết ứng viên
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {candidateInfo?.fullName}
          </Typography>
        </Box>

        <StatusLabel
          label={STATUS_MAP[candidateInfo?.status] || "Lỗi"}
          color={
            status === CandidateStatus.APPLIED
              ? Color.PrimaryBlackPlaceHolder
              : status === CandidateStatus.REJECTED
                ? Color.PrimaryOrgange
                : status === CandidateStatus.WAIT_FOR_INTERVIEW
                  ? Color.PrimaryGreen
                  : Color.SecondaryGold
          }
        />
      </Box>

      {/* ACTION BUTTONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 3,
          gap: 2,
        }}
      >
        {isReviewing ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 220, // chiều rộng tương đương 2 nút → spinner vào giữa
              height: 40,
            }}
          >
            <CircularProgress size={24} sx={{ color: Color.PrimaryBlue }} />
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={handleApproveClick}
              disabled={isReviewing}
              sx={{
                px: 3,
                py: 1,
                bgcolor: Color.PrimaryBlue,
                color: "#fff",
                borderRadius: 2,
                boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                textTransform: "none",
                fontWeight: 600,
                ":hover": { opacity: 0.9, bgcolor: Color.PrimaryBlue },
              }}
            >
              <CheckCircleRoundedIcon sx={{ mr: 1 }} />
              {status === CandidateStatus.HIRED ||
              status === CandidateStatus.CONTRACT_NOT_YET_IN_FORCE
                ? "Xem hợp đồng"
                : status === CandidateStatus.WAIT_FOR_INTERVIEW
                  ? "Tạo hợp đồng"
                  : "Chấp nhận"}
            </Button>

            {status !== CandidateStatus.HIRED &&
              status !== CandidateStatus.REJECTED && (
                <Button
                  variant="contained"
                  onClick={handleDeclineClick}
                  disabled={isReviewing}
                  sx={{
                    px: 3,
                    py: 1,
                    bgcolor: Color.PrimaryOrgange,
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                    textTransform: "none",
                    fontWeight: 600,
                    ":hover": { opacity: 0.9, bgcolor: Color.PrimaryOrgange },
                  }}
                >
                  <CancelRoundedIcon sx={{ mr: 1 }} /> Từ chối
                </Button>
              )}
          </>
        )}
      </Box>

      {/* FORM */}
      <Box component="form">
        {/* CARD: Thông tin ứng viên */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "#fff",
            mb: 4,
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={2}>
            Thông tin ứng viên
          </Typography>

          <Grid container spacing={2}>
            <Grid item size={4}>
              <InfoTextField
                label="Họ và tên"
                fullWidth
                disabled
                name="fullName"
                value={candidateInfo?.fullName}
              />
            </Grid>
            <Grid item size={5}>
              <InfoTextField
                label="Email"
                fullWidth
                disabled
                name="email"
                value={candidateInfo?.email}
              />
            </Grid>

            <Grid item size={3}>
              <InfoTextField
                label="Số điện thoại"
                fullWidth
                name="phoneNumber"
                disabled
                value={candidateInfo?.phoneNumber}
              />
            </Grid>

            <Grid item size={12}>
              <InfoTextField
                label="Địa chỉ"
                fullWidth
                name="address"
                disabled
                value={candidateInfo?.address}
              />
            </Grid>
            <Grid item size={12}>
              <InfoTextField
                label="Trình độ ngoại ngữ"
                fullWidth
                name="languageSkills"
                disabled
                value={candidateInfo?.languageSkills}
              />
            </Grid>
          </Grid>
        </Box>

        {!resume?.url ? (
          <Typography color="text.secondary">Không có CV đính kèm</Typography>
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderStyle: "dashed",
            }}
          >
            <Box sx={{ color: Color.PrimaryBlue }}>
              {getFileIcon(resume.url)}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={600} noWrap>
                {resume.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                CV ứng viên
              </Typography>
            </Box>

            <Button
              size="small"
              startIcon={<OpenInNewRoundedIcon />}
              onClick={() => window.open(resume.url, "_blank")}
            >
              Xem
            </Button>

            <Button
              size="small"
              startIcon={<DownloadRoundedIcon />}
              component="a"
              href={resume.url}
              download
            >
              Tải
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default CandidateProfileDetail;

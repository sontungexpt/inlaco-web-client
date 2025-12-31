import React from "react";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { InfoTextField, StatusLabel } from "@components/global";
import { FileUploadField } from "@components/contract";
import {
  Box,
  Button,
  Paper,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import Color from "@constants/Color";
import { reviewCandidateApplication } from "@/services/postServices";
import { isoStringToDateString } from "@utils/converter";
import { useCandidate } from "@/hooks/services/posts";
import { useMutation } from "@tanstack/react-query";
import CandidateStatus from "@/constants/CandidateStatus";
import toast from "react-hot-toast";

const getFileIcon = (url) => {
  if (!url) return <DescriptionRoundedIcon />;
  if (url.endsWith(".pdf")) return <PictureAsPdfRoundedIcon />;
  return <DescriptionRoundedIcon />;
};

const AdminCandidateDetail = () => {
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
    [CandidateStatus.HIRED]: "Đã ký hợp đồng",
  };
  const status = candidateInfo?.status;

  const initialValues = {
    fullName: candidateInfo?.fullName || "",
    dob: candidateInfo?.birthDate
      ? isoStringToDateString(candidateInfo.birthDate)
      : "",
    phoneNumber: candidateInfo?.phoneNumber || "",
    address: candidateInfo?.address || "",
    gender: candidateInfo?.gender ? candidateInfo.gender : "OTHER",
    email: candidateInfo?.email || "",
    languageSkills: candidateInfo?.languageSkills || "",
    resume: "",
  };

  const handleApproveClick = async () => {
    if (status === CandidateStatus.REJECTED) {
      await reviewCandidateAsync(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.APPLIED) {
      await reviewCandidateAsync(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.WAIT_FOR_INTERVIEW) {
      await reviewCandidateAsync(CandidateStatus.HIRED);
    } else if (status === CandidateStatus.HIRED) {
      navigate(`/crew-contracts/create/${candidateID}`);
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
              {status === CandidateStatus.WAIT_FOR_INTERVIEW
                ? "Thuê"
                : status === CandidateStatus.HIRED
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
      <Formik validateOnChange={false} initialValues={initialValues}>
        {({ values, errors, touched, handleBlur, handleChange }) => (
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
                <Grid item xs={12} md={6}>
                  <InfoTextField
                    label="Họ và tên"
                    size="small"
                    fullWidth
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <InfoTextField
                    type="date"
                    label="Ngày sinh"
                    size="small"
                    fullWidth
                    name="dob"
                    value={values.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <InfoTextField
                    label="Số điện thoại"
                    size="small"
                    fullWidth
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoTextField
                    label="Địa chỉ"
                    size="small"
                    fullWidth
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <InfoTextField
                    select
                    label="Giới tính"
                    name="gender"
                    size="small"
                    fullWidth
                    value={values.gender}
                    onChange={handleChange}
                  >
                    {GENDERS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </InfoTextField>
                </Grid>

                <Grid item xs={12} md={3}>
                  <InfoTextField
                    label="Email"
                    size="small"
                    fullWidth
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoTextField
                    label="Trình độ ngoại ngữ"
                    size="small"
                    fullWidth
                    name="languageSkills"
                    value={values.languageSkills}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            {!resume?.url ? (
              <Typography color="text.secondary">
                Không có CV đính kèm
              </Typography>
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
        )}
      </Formik>
    </Box>
  );
};

export default AdminCandidateDetail;

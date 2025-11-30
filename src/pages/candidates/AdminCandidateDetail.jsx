import React from "react";
import { InfoTextField, StatusLabel } from "@components/global";
import { FileUploadField } from "@components/contract";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Formik } from "formik";
import { useParams } from "react-router";
import Color from "@constants/Color";
import { reviewCandidateApplication } from "@/services/postServices";
import { isoStringToDateString } from "@utils/converter";
import { useCandidate } from "@/hooks/services/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CandidateStatus from "@/constants/CandidateStatus";
import toast from "react-hot-toast";

const AdminCandidateDetail = () => {
  const { candidateID } = useParams();
  const queryClient = useQueryClient();

  const { data: candidateInfo, isLoading } = useCandidate(candidateID);
  const { mutateAsync: reviewCandidate, isPending: isReviewing } = useMutation({
    mutationFn: (status) => reviewCandidateApplication(candidateID, status),
    onSuccess: () => {
      // Refetch lại profile ngay lập tức
      queryClient.invalidateQueries({
        queryKey: ["candidate-profile", candidateID],
      });
    },
  });

  const GENDERS = [
    { label: "Nam", value: "MALE" },
    { label: "Nữ", value: "FEMALE" },
    { label: "Khác", value: "OTHER" },
  ];

  const STATUS_MAP = {
    APPLIED: "Đã nộp",
    WAIT_FOR_INTERVIEW: "Đã qua vòng phỏng vấn",
    REJECTED: "Từ chối",
    HIRED: "Đã ký hợp đồng",
  };
  const status = STATUS_MAP[candidateInfo?.status] || "Lỗi";

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
    try {
      await reviewCandidate(CandidateStatus.WAIT_FOR_INTERVIEW);
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
  };

  const handleDeclineClick = async () => {
    try {
      await reviewCandidate(CandidateStatus.REJECTED);
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
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
          label={status}
          color={
            status === "Đã nộp"
              ? Color.PrimaryBlackPlaceHolder
              : status === "Từ chối"
                ? Color.PrimaryOrgange
                : status === "Đã qua vòng phỏng vấn"
                  ? Color.PrimaryGreen
                  : Color.SecondaryGold
          }
        />
      </Box>

      {/* ACTION BUTTONS */}
      {status === "Đã nộp" && (
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
                <CheckCircleRoundedIcon sx={{ mr: 1 }} /> Chấp nhận
              </Button>

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
            </>
          )}
        </Box>
      )}

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

            {/* CARD: CV đính kèm */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2}>
                CV đính kèm
              </Typography>
              <FileUploadField label="CV đính kèm" name="resume" disabled />
            </Box>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default AdminCandidateDetail;

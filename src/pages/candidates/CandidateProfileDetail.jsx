import React, { useState } from "react";
import {
  InfoTextField,
  PageTitle,
  SectionWrapper,
  StatusLabel,
} from "@components/global";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useNavigate, useParams } from "react-router";
import Color from "@constants/Color";
import { reviewCandidateApplication } from "@/services/postServices";
import { useCandidate } from "@/hooks/services/post";
import CandidateStatus from "@/constants/CandidateStatus";
import toast from "react-hot-toast";
import { FilePreviewCard } from "@/components/common";

const CandidateProfileDetail = () => {
  const navigate = useNavigate();
  const { candidateID } = useParams();

  const {
    data: candidateInfo,
    isLoading,
    refetch: refetchCandidateInfo,
  } = useCandidate(candidateID);
  const [isReviewing, setIsReviewing] = useState(false);
  const resume = candidateInfo?.resume;

  const reviewCandidate = async (status) => {
    setIsReviewing(true);
    try {
      await reviewCandidateApplication(candidateID, status);
      refetchCandidateInfo();
      toast.success("Thay đổi trạng thái thành công!");
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
    setIsReviewing(false);
  };

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
      await reviewCandidate(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.APPLIED) {
      await reviewCandidate(CandidateStatus.WAIT_FOR_INTERVIEW);
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
    await reviewCandidate(CandidateStatus.REJECTED);
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
      <SectionWrapper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <PageTitle
            title="Chi tiết ứng viên"
            subtitle={candidateInfo?.fullName}
          />

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
            gap: 2,
            mt: 3,
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
              Đang thực hiện
              <CircularProgress
                size={24}
                sx={{
                  ml: 2,
                  color: Color.PrimaryBlue,
                }}
              />
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={handleApproveClick}
                disabled={isReviewing}
                sx={{
                  color: Color.PrimaryWhite,
                  bgcolor: Color.PrimaryBlue,
                  borderRadius: 2,
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
                      bgcolor: Color.PrimaryOrgange,
                      color: Color.PrimaryWhite,
                      borderRadius: 2,
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
      </SectionWrapper>

      {/* CARD: Thông tin ứng viên */}
      <SectionWrapper title="Thông tin ứng viên">
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
      </SectionWrapper>
      <SectionWrapper>
        <FilePreviewCard
          url={resume?.url}
          emptyText="Không có CV đính kèm"
          name={resume?.name}
          label="CV ứng viên"
        />
      </SectionWrapper>
    </Box>
  );
};

export default CandidateProfileDetail;

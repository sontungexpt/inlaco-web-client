import React, { useState } from "react";
import { PageTitle, SectionWrapper, StatusLabel } from "@components/common";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useNavigate, useParams } from "react-router";
import Color from "@constants/Color";
import { reviewCandidateApplication } from "@/services/postServices";
import { useCandidate } from "@/hooks/services/post";
import CandidateStatus from "@/constants/CandidateStatus";
import toast from "react-hot-toast";
import { FilePreviewCard, InfoItem } from "@/components/common";
import CenterCircularProgress from "@/components/common/CenterCircularProgress";
import useAllowedRole from "@/hooks/useAllowedRole";
import UserRole from "@/constants/UserRole";

const CandidateProfileDetail = () => {
  const navigate = useNavigate();
  const { candidateID } = useParams();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const {
    data: candidateInfo,
    isLoading,
    refetch: refetchCandidateInfo,
  } = useCandidate(candidateID);

  const resume = candidateInfo?.resume;
  const status = candidateInfo?.status;

  // accept || reject
  const [reviewingButtonId, setReviewingButtonId] = useState(null);

  const reviewCandidate = async (status) => {
    setReviewingButtonId(status);
    try {
      await reviewCandidateApplication(candidateID, status);
      refetchCandidateInfo();
      toast.success("Thay đổi trạng thái thành công!");
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
    setReviewingButtonId(null);
  };

  const STATUS_MAP = {
    [CandidateStatus.APPLIED]: "Đã nộp",
    [CandidateStatus.WAIT_FOR_INTERVIEW]: "Đang đợi phỏng vấn",
    [CandidateStatus.REJECTED]: "Từ chối",
    [CandidateStatus.HIRED]: "Ứng cử viên đã được thuê",
  };

  const handleApproveClick = async () => {
    if (status === CandidateStatus.REJECTED) {
      await reviewCandidate(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.APPLIED) {
      await reviewCandidate(CandidateStatus.WAIT_FOR_INTERVIEW);
    } else if (status === CandidateStatus.WAIT_FOR_INTERVIEW) {
      navigate(`/crew-contracts/form`, {
        state: {
          candidateProfileId: candidateID,
          type: "create",
        },
      });
    } else if (status === CandidateStatus.HIRED) {
      navigate(`/crew-contracts/${candidateID}`);
    }
  };

  const handleDeclineClick = async () => {
    await reviewCandidate(CandidateStatus.REJECTED);
  };

  if (isLoading) {
    return <CenterCircularProgress />;
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
        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={handleApproveClick}
              disabled={reviewingButtonId}
              sx={{
                color: Color.PrimaryWhite,
                bgcolor: Color.PrimaryBlue,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                ":hover": { opacity: 0.9, bgcolor: Color.PrimaryBlue },
              }}
              startIcon={
                reviewingButtonId &&
                reviewingButtonId !== CandidateStatus.REJECTED ? (
                  <CircularProgress size={24} />
                ) : (
                  <CheckCircleRoundedIcon />
                )
              }
            >
              {status === CandidateStatus.HIRED
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
                  disabled={reviewingButtonId}
                  sx={{
                    bgcolor: Color.PrimaryOrgange,
                    color: Color.PrimaryWhite,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    ":hover": { opacity: 0.9, bgcolor: Color.PrimaryOrgange },
                  }}
                  startIcon={
                    reviewingButtonId === CandidateStatus.REJECTED ? (
                      <CircularProgress size={24} />
                    ) : (
                      <CancelRoundedIcon />
                    )
                  }
                >
                  Từ chối
                </Button>
              )}
          </Box>
        )}
      </SectionWrapper>

      <SectionWrapper title="Thông tin ứng viên">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <InfoItem
              label="Họ và tên"
              value={candidateInfo?.fullName}
              highlight
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
            <InfoItem
              label="Email"
              value={candidateInfo?.email}
              clickable
              color="primary.main"
              onClick={() => window.open(`mailto:${candidateInfo?.email}`)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <InfoItem
              label="Số điện thoại"
              value={candidateInfo?.phoneNumber}
              clickable
              onClick={() => window.open(`tel:${candidateInfo?.phoneNumber}`)}
            />
          </Grid>

          <Grid size={12}>
            <InfoItem label="Địa chỉ" value={candidateInfo?.address} />
          </Grid>

          <Grid size={12}>
            <InfoItem
              label="Trình độ ngoại ngữ"
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

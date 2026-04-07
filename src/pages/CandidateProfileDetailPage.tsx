import toast from "react-hot-toast";

import {
  FilePreviewCard,
  InfoItem,
  PageTitle,
  SectionWrapper,
  StatusLabel,
  CenterCircularProgress,
} from "@components/common";
import {
  Box,
  Button,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import { useNavigate, useParams } from "react-router";
import { useCandidate, useReviewCandidate } from "@/queries/post.query";

import Color from "@constants/Color";
import CandidateStatus from "@/constants/CandidateStatus";
import UserRole from "@/constants/UserRole";
import { useAllowedRole } from "@/contexts/auth.context";

const STATUS_CONFIG: Record<
  CandidateStatus,
  {
    label: string;
    color: string;
    next: CandidateStatus[];
  }
> = {
  [CandidateStatus.APPLIED]: {
    label: "Đã nộp hồ sơ",
    color: Color.PrimaryBlackPlaceHolder,
    next: [
      CandidateStatus.SCREENING,
      CandidateStatus.REJECTED,
      CandidateStatus.WITHDRAWN,
    ],
  },
  [CandidateStatus.SCREENING]: {
    label: "Đang duyệt",
    color: Color.PrimaryBlue,
    next: [CandidateStatus.INTERVIEW_SCHEDULED, CandidateStatus.REJECTED],
  },
  [CandidateStatus.INTERVIEW_SCHEDULED]: {
    label: "Đã lên lịch phỏng vấn",
    color: Color.PrimaryGreen,
    next: [CandidateStatus.INTERVIEWED, CandidateStatus.REJECTED],
  },
  [CandidateStatus.INTERVIEWED]: {
    label: "Đã phỏng vấn",
    color: Color.SecondaryGold,
    next: [CandidateStatus.OFFERED, CandidateStatus.REJECTED],
  },
  [CandidateStatus.OFFERED]: {
    label: "Đã gửi offer",
    color: Color.PrimaryBlue,
    next: [CandidateStatus.CONFIRMED, CandidateStatus.REJECTED],
  },
  [CandidateStatus.CONFIRMED]: {
    label: "Ứng viên xác nhận",
    color: Color.PrimaryGreen,
    next: [],
  },
  [CandidateStatus.CONTRACT_PENDING_SIGNATURE]: {
    label: "Hợp đồng đang chờ kí kết",
    color: Color.PrimaryGreen,
    next: [],
  },
  [CandidateStatus.CONTRACT_SIGNED]: {
    label: "Hợp đồng đang đã kí",
    color: Color.PrimaryGreen,
    next: [],
  },
  [CandidateStatus.HIRED]: {
    label: "Hợp đồng có hiệu lực",
    color: Color.PrimaryGreen,
    next: [],
  },
  [CandidateStatus.REJECTED]: {
    label: "Từ chối",
    color: Color.PrimaryOrgange,
    next: [],
  },
  [CandidateStatus.WITHDRAWN]: {
    label: "Ứng viên rút hồ sơ",
    color: Color.PrimaryBlackPlaceHolder,
    next: [],
  },
};

const CandidateProfileDetailPage = () => {
  const navigate = useNavigate();
  const { candidateID } = useParams();
  const isAdmin = useAllowedRole(UserRole.ADMIN);

  const { data: candidateInfo, isLoading } = useCandidate(candidateID);

  const resume = candidateInfo?.resume;
  const status = candidateInfo?.status as CandidateStatus;

  const { mutateAsync: reviewCandidate, isPending: isReviewing } =
    useReviewCandidate({
      candidateId: candidateID,
      onSuccess: () => toast.success("Cập nhật trạng thái thành công!"),
      onError: () => toast.error("Cập nhật thất bại!"),
    });

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
            label={STATUS_CONFIG[status]?.label}
            color={STATUS_CONFIG[status]?.color}
          />
        </Box>

        {/* ACTION SECTION */}
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            {STATUS_CONFIG[status]?.next?.length > 0 && (
              <>
                <Select
                  value=""
                  displayEmpty
                  disabled={!!isReviewing}
                  size="small"
                  sx={{ minWidth: 240, borderRadius: 2 }}
                  renderValue={() =>
                    STATUS_CONFIG[status]?.label ?? "Chuyển trạng thái"
                  }
                  onChange={(e) => reviewCandidate(e.target.value)}
                >
                  {STATUS_CONFIG[status].next.map((nextStatus) => (
                    <MenuItem key={nextStatus} value={nextStatus}>
                      {STATUS_CONFIG[nextStatus].label}
                    </MenuItem>
                  ))}
                </Select>
                {isReviewing && <CircularProgress size={24} />}
              </>
            )}

            {/* CREATE CONTRACT */}
            {status === CandidateStatus.CONFIRMED && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: Color.SecondaryGold,
                  color: Color.PrimaryWhite,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  ":hover": { opacity: 0.9, bgcolor: Color.SecondaryGold },
                }}
                onClick={() =>
                  navigate(
                    `/contracts/form?type=LABOR_CONTRACT&formType=create&candidateId=${candidateID}`,
                  )
                }
              >
                Tạo hợp đồng
              </Button>
            )}

            {/* VIEW CONTRACT */}
            {(status === CandidateStatus.CONTRACT_PENDING_SIGNATURE ||
              status === CandidateStatus.HIRED ||
              status === CandidateStatus.CONTRACT_SIGNED) && (
              <Button
                variant="outlined"
                sx={{ borderRadius: 2 }}
                onClick={() =>
                  navigate(`/crew-contracts/application/${candidateID}`, {})
                }
              >
                Xem hợp đồng
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
              color="primary.main"
              onClick={() => window.open(`mailto:${candidateInfo?.email}`)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <InfoItem
              label="Số điện thoại"
              value={candidateInfo?.phoneNumber}
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

export default CandidateProfileDetailPage;

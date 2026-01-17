import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import { reviewSupplyRequest } from "@/services/supplyReqServices";
import { useSupplyRequest } from "@/hooks/services/supplyRequest";
import { isoToLocalDatetime, dateToLocaleString } from "@/utils/converter";

import Color from "@constants/Color";
import {
  PageTitle,
  SectionWrapper,
  StatusLabel,
  CloudinaryImage,
  FilePreviewCard,
  CenterCircularProgress,
} from "@components/common";

import InfoItem from "@/components/common/InfoItem";

import { Box, Button, CircularProgress, Grid, Stack } from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";

export default function SupplyRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: requestInfo,
    isLoading,
    refetch: refetchRequestInfo,
  } = useSupplyRequest(id);

  const [buttonLoading, setButtonLoading] = useState(false);

  const reviewRequest = async (status) => {
    const buttonId = status ? "approve" : "decline";
    setButtonLoading(buttonId);
    try {
      await reviewSupplyRequest(id, status);
      await refetchRequestInfo();
    } catch {
      toast.error("Thay đổi trạng thái thất bại!");
    }
    setButtonLoading(false);
  };

  if (isLoading) return <CenterCircularProgress />;

  const STATUS_MAP = {
    PENDING: {
      label: "Đang chờ xác nhận",
      color: Color.PrimaryBlue,
    },
    APPROVED: {
      label: "Chấp thuận",
      color: Color.PrimaryGreen,
    },
    REJECTED: {
      label: "Từ chối",
      color: Color.PrimaryOrgange,
    },
    ACTIVE: {
      label: "Đã kí hợp đồng",
      color: Color.PrimaryBlackPlaceHolder,
    },
    SIGNING: {
      label: "Đang đợi kí hợp đồng",
      color: Color.PrimaryBlue,
    },
    DONE: {
      label: "Hợp đồng kết thúc",
      color: Color.Success,
    },
  };

  const status = requestInfo?.status;

  return (
    <Box sx={{ m: 3 }}>
      {/* ================= HEADER ================= */}
      <SectionWrapper
        sx={{
          background: "linear-gradient(135deg, #E3F2FD 0%, #F5F9FC 100%)",
          borderRadius: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <PageTitle
            title="CHI TIẾT YÊU CẦU CUNG ỨNG"
            subtitle={`Yêu cầu cung ứng với id: ${id}`}
          />
          <StatusLabel
            label={STATUS_MAP[status]?.label || "Lỗi"}
            color={STATUS_MAP[status]?.color}
          />
        </Box>

        {/* ================= ACTIONS ================= */}
        {(status === "PENDING" || status === "APPROVED") && (
          <Stack direction="row" spacing={2} mt={4}>
            {status === "PENDING" && (
              <>
                <Button
                  variant="contained"
                  onClick={() => reviewRequest(true)}
                  disabled={buttonLoading}
                  startIcon={
                    buttonLoading === "approve" ? (
                      <CircularProgress size={18} />
                    ) : (
                      <CheckCircleRoundedIcon />
                    )
                  }
                  sx={{
                    minWidth: 160,
                    borderRadius: 2,
                    backgroundColor: Color.PrimaryBlue,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Chấp thuận
                </Button>

                <Button
                  variant="contained"
                  onClick={() => reviewRequest(false)}
                  disabled={buttonLoading}
                  startIcon={
                    buttonLoading === "decline" ? (
                      <CircularProgress size={18} />
                    ) : (
                      <CancelRoundedIcon />
                    )
                  }
                  sx={{
                    minWidth: 160,
                    borderRadius: 2,
                    backgroundColor: Color.PrimaryOrgange,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Từ chối
                </Button>
              </>
            )}

            {status === "APPROVED" && (
              <Button
                variant="contained"
                onClick={() => navigate(`/supply-contracts/create/${id}`)}
                startIcon={<NoteAddRoundedIcon />}
                sx={{
                  minWidth: 200,
                  borderRadius: 2,
                  backgroundColor: Color.PrimaryGold,
                  color: Color.PrimaryBlack,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Tạo hợp đồng
              </Button>
            )}
          </Stack>
        )}
      </SectionWrapper>

      {/* ================= COMPANY INFO ================= */}
      <SectionWrapper title="Thông tin công ty">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem
              label="Tên công ty"
              value={requestInfo.companyName}
              bold
            />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <InfoItem label="Địa chỉ" value={requestInfo.companyAddress} />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem label="Số điện thoại" value={requestInfo.companyPhone} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InfoItem label="Email" value={requestInfo.companyEmail} />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <InfoItem
              label="Người đại diện"
              value={requestInfo.companyRepresentor}
              highlight
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <InfoItem
              label="Chức vụ"
              value={requestInfo.companyRepresentorPosition}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ================= REQUEST INFO ================= */}
      <SectionWrapper title="Thông tin yêu cầu">
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <InfoItem
                label="Thời gian bắt đầu thuê"
                value={dateToLocaleString(requestInfo.rentalStartDate)}
                highlight
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <InfoItem
                label="Thời gian kết thúc thuê"
                value={dateToLocaleString(requestInfo.rentalEndDate)}
                highlight
              />
            </Grid>
          </Grid>

          <FilePreviewCard
            url={requestInfo.detailFile?.url}
            name="Danh sách số lượng cần cung ứng"
          />
        </Stack>
      </SectionWrapper>

      {/* ================= SHIP INFO ================= */}
      <SectionWrapper title="Thông tin tàu">
        <Stack spacing={3}>
          <Box display="flex" justifyContent="center">
            <CloudinaryImage
              publicId={requestInfo.shipInfo?.image?.publicId}
              sx={{
                borderRadius: 2,
                maxHeight: 220,
                objectFit: "cover",
              }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem
                label="Tên tàu"
                value={requestInfo.shipInfo?.name}
                bold
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem label="IMO" value={requestInfo.shipInfo?.IMONumber} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem
                label="Quốc tịch"
                value={requestInfo.shipInfo?.countryISO}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <InfoItem label="Loại tàu" value={requestInfo.shipInfo?.type} />
            </Grid>
          </Grid>
        </Stack>
      </SectionWrapper>
    </Box>
  );
}

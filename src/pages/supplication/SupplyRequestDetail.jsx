import React, { useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import Color from "@constants/Color";
import { PageTitle, SectionWrapper, StatusLabel } from "@components/global";
import {
  CloudinaryImage,
  FilePreviewCard,
  ViewTextField,
} from "@components/common";
import { Box, Button, Grid, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { reviewSupplyRequest } from "@/services/supplyReqServices";
import { useSupplyRequest } from "@/hooks/services/supplyRequest";
import toast from "react-hot-toast";
import { isoToLocalDatetime } from "@/utils/converter";

const SupplyRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: requestInfo,
    isLoading,
    refetch: refetchRequestInfo,
  } = useSupplyRequest(id);
  const [buttonLoading, setButtonLoading] = useState(false);

  const reviewRequest = async (status) => {
    setButtonLoading(true);
    try {
      const response = await reviewSupplyRequest(id, status);
      await refetchRequestInfo();
    } catch (err) {
      toast.error("Thay đổi trạng thái thất bại!");
    }
    setButtonLoading(false);
  };

  const approveRequest = async () => {
    await reviewRequest(true);
  };

  const declineRequest = async () => {
    await reviewRequest(false);
  };

  const createContract = () => {
    navigate(`/supply-contracts/create/${id}`, {
      state: requestInfo,
    });
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

  /* ===== COMMON DISABLED FIELD STYLE ===== */
  const disabledFieldSx = {
    "& .MuiInputBase-input.Mui-disabled": {
      color: Color.PrimaryBlack,
      WebkitTextFillColor: Color.PrimaryBlack,
    },
    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
      borderColor: Color.PrimaryBlack,
    },
  };

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
  };
  const status = requestInfo?.status;

  return (
    <Box sx={{ m: 3 }}>
      {/* ===== HEADER ===== */}
      <SectionWrapper
        sx={{
          background: "linear-gradient(135deg, #E3F2FD 0%, #F5F9FC 100%)",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <PageTitle
            title="CHI TIẾT YÊU CẦU CUNG ỨNG"
            subtitle={`Yêu cầu cung ứng của công ty: ${id}`}
          />

          <StatusLabel
            label={STATUS_MAP[status].label || "Lỗi"}
            color={STATUS_MAP[status]?.color}
          />
        </Box>

        {/* ===== ACTIONS ===== */}
        {status === "PENDING" ||
          (status === "APPROVED" && (
            <Box mt={4} display="flex" gap={2}>
              {status === "PENDING" && (
                <>
                  <Button
                    variant="contained"
                    onClick={approveRequest}
                    disabled={buttonLoading}
                    sx={{ minWidth: 150, backgroundColor: Color.PrimaryBlue }}
                  >
                    {buttonLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <>
                        <CheckCircleRoundedIcon sx={{ mr: 1 }} />
                        Chấp thuận
                      </>
                    )}
                  </Button>

                  <Button
                    variant="contained"
                    onClick={declineRequest}
                    disabled={buttonLoading}
                    sx={{
                      minWidth: 150,
                      backgroundColor: Color.PrimaryOrgange,
                    }}
                  >
                    <CancelRoundedIcon sx={{ mr: 1 }} />
                    Từ chối
                  </Button>
                </>
              )}
              {status === "APPROVED" && (
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 180,
                    backgroundColor: Color.PrimaryGold,
                    color: Color.PrimaryBlack,
                  }}
                  onClick={createContract}
                >
                  <NoteAddRoundedIcon sx={{ mr: 1 }} />
                  Tạo hợp đồng
                </Button>
              )}
            </Box>
          ))}
      </SectionWrapper>

      {/* ===== COMPANY INFO ===== */}
      <SectionWrapper title="Thông tin công ty">
        <Grid container spacing={2}>
          <Grid size={4}>
            <ViewTextField
              label="Tên công ty"
              value={requestInfo.companyName}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={5}>
            <ViewTextField
              label="Địa chỉ"
              value={requestInfo.companyAddress}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={3}>
            <ViewTextField
              label="Số điện thoại"
              value={requestInfo.companyPhone}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={4}>
            <ViewTextField
              label="Email"
              value={requestInfo.companyEmail}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={5}>
            <ViewTextField
              label="Người đại diện"
              value={requestInfo.companyRepresentor}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={3}>
            <ViewTextField
              label="Chức vụ"
              value={requestInfo.companyRepresentorPosition}
              sx={disabledFieldSx}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ===== SCHEDULE ===== */}
      <SectionWrapper title="Thông tin yêu cầu">
        <Grid container spacing={2}>
          <Grid size={12}>
            <ViewTextField
              label="Thời gian bắt đầu thuê"
              value={
                requestInfo.rentalStartDate &&
                isoToLocalDatetime(requestInfo.rentalStartDate)
              }
              sx={disabledFieldSx}
            />
          </Grid>
          <Grid size={12}>
            <ViewTextField
              label="Thời gian kết thúc thuê"
              value={
                requestInfo.rentalEndDate &&
                isoToLocalDatetime(requestInfo.rentalEndDate)
              }
              sx={disabledFieldSx}
            />
          </Grid>
          <Grid size={12}>
            <FilePreviewCard
              url={requestInfo.detailFile?.url}
              name="Danh sách số lượng cần cung ứng"
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ===== SHIP INFO ===== */}
      <SectionWrapper title="Thông tin tàu">
        <Grid container spacing={2}>
          <Grid
            item
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CloudinaryImage publicId={requestInfo.shipInfo?.image?.publicId} />
          </Grid>

          <Grid item size={6}>
            <ViewTextField
              label="Tên tàu"
              value={requestInfo.shipInfo?.name}
              sx={disabledFieldSx}
            />
          </Grid>
          <Grid item size={6}>
            <ViewTextField
              label="IMO"
              value={requestInfo.shipInfo?.IMONumber}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid item size={6}>
            <ViewTextField
              label="Quốc tịch"
              value={requestInfo.shipInfo?.countryISO}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid item size={6}>
            <ViewTextField
              label="Loại tàu"
              value={requestInfo.shipInfo?.type}
              sx={disabledFieldSx}
            />
          </Grid>
        </Grid>
      </SectionWrapper>
    </Box>
  );
};
export default SupplyRequestDetail;

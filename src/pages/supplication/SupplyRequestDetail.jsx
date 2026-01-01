import React, { useState, useEffect } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import Color from "@constants/Color";
import {
  PageTitle,
  SectionWrapper,
  InfoTextField,
  ImageUploadField,
  StatusLabel,
} from "@components/global";
import { NationalityTextField } from "@components/mobilization";
import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import HttpStatusCode from "../../constants/HttpStatusCode";
import {
  getSupplyReqByID_API,
  reviewSupplyReqAPI,
} from "@/services/supplyReqServices";
import { isoStringToMUIDateTime } from "@utils/converter";
import { FileUploadField } from "@/components/contract";

const SupplyRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [requestInfo, setRequestInfos] = useState({});

  const fetchRequestInfos = async (supplyReqID) => {
    setLoading(true);
    try {
      const response = await getSupplyReqByID_API(supplyReqID);
      await new Promise((resolve) => setTimeout(resolve, 200)); // delay UI for 200ms

      if (response.status === HttpStatusCode.OK) {
        setRequestInfos(response.data);
      } else {
        console.log("Error fetching request infos");
      }
    } catch (err) {
      console.log("Error fetching request infos: ", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequestInfos(id);
  }, []);

  const statusMap = {
    PENDING: "Đang chờ xác nhận",
    APPROVED: "Chấp thuận",
    REJECTED: "Từ chối",
    ACTIVE: "Đã ký hợp đồng",
  };

  const status = statusMap[requestInfo?.status] || "Lỗi";

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleApproveClick = async () => {
    setButtonLoading(true);
    try {
      const response = await reviewSupplyReqAPI(id, true);

      if (response.status === HttpStatusCode.NO_CONTENT) {
        console.log("Successfully approved request");
        await fetchRequestInfos(id);
      } else {
        console.log("Error when approving request");
      }
    } catch (err) {
      console.log("Error when approving request: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDeclineClick = async () => {
    setButtonLoading(true);
    try {
      const response = await reviewSupplyReqAPI(id, false);

      if (response.status === HttpStatusCode.NO_CONTENT) {
        console.log("Successfully declined request");
        await fetchRequestInfos(id);
      } else {
        console.log("Error when declining request");
      }
    } catch (err) {
      console.log("Error when declining request: ", err);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleCreateSupplyContractClick = () => {
    navigate(`/supply-contracts/create/${id}`);
  };

  if (loading) {
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

          {status === "Chấp thuận" && (
            <StatusLabel label="Chấp thuận" color={Color.PrimaryGreen} />
          )}
          {status === "Từ chối" && (
            <StatusLabel label="Từ chối" color={Color.PrimaryOrgange} />
          )}
          {status === "Đang chờ xác nhận" && (
            <StatusLabel
              label="Đang chờ xác nhận"
              color={Color.PrimaryBlackPlaceHolder}
            />
          )}
          {status === "Đã ký hợp đồng" && (
            <StatusLabel label="Đã ký hợp đồng" color={Color.SecondaryGold} />
          )}
        </Box>
      </SectionWrapper>

      {/* ===== ACTIONS ===== */}
      {status === "Đang chờ xác nhận" && (
        <SectionWrapper>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={handleApproveClick}
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
              onClick={handleDeclineClick}
              disabled={buttonLoading}
              sx={{
                minWidth: 150,
                backgroundColor: Color.PrimaryOrgange,
              }}
            >
              <CancelRoundedIcon sx={{ mr: 1 }} />
              Từ chối
            </Button>
          </Box>
        </SectionWrapper>
      )}

      {status === "Chấp thuận" && (
        <SectionWrapper>
          <Box display="flex" gap={3} alignItems="center">
            <Button
              variant="contained"
              sx={{
                minWidth: 180,
                backgroundColor: Color.PrimaryGold,
                color: Color.PrimaryBlack,
              }}
              onClick={handleCreateSupplyContractClick}
            >
              <NoteAddRoundedIcon sx={{ mr: 1 }} />
              Tạo hợp đồng
            </Button>

            <FileUploadField
              label="Danh sách số lượng cần cung ứng"
              disabled
              name="requestListFileLink"
            />
          </Box>
        </SectionWrapper>
      )}

      {/* ===== COMPANY INFO ===== */}
      <SectionWrapper title="Thông tin công ty">
        <Grid container spacing={2}>
          <Grid size={4}>
            <InfoTextField
              label="Tên công ty"
              disabled
              fullWidth
              name="companyName"
              value={requestInfo.companyName}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={5}>
            <InfoTextField
              label="Địa chỉ"
              disabled
              fullWidth
              name="companyAddress"
              value={requestInfo.companyAddress}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              label="Số điện thoại"
              disabled
              fullWidth
              name="companyPhone"
              value={requestInfo.companyPhone}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={4}>
            <InfoTextField
              label="Email"
              disabled
              fullWidth
              name="companyEmail"
              value={requestInfo.companyEmail}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={5}>
            <InfoTextField
              label="Người đại diện"
              disabled
              fullWidth
              name="companyRepresentor"
              value={requestInfo.companyRepresentor}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={3}>
            <InfoTextField
              label="Chức vụ"
              disabled
              fullWidth
              name="companyRepresentorPosition"
              value={requestInfo.companyRepresentorPosition}
              sx={disabledFieldSx}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ===== SCHEDULE ===== */}
      <SectionWrapper
        title="Lịch trình dự kiến"
        sx={{ backgroundColor: "#F8FAFC" }}
      >
        <Grid container spacing={2}>
          <Grid xs={4}>
            <InfoTextField
              type="datetime-local"
              label="Thời gian khởi hành"
              disabled
              fullWidth
              name="requestInfo.timeOfDeparture"
              value={requestInfo.requestInfo?.timeOfDeparture}
              sx={disabledFieldSx}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
      </SectionWrapper>

      {/* ===== SHIP INFO ===== */}
      <SectionWrapper title="Thông tin tàu">
        <Grid container spacing={2}>
          <Grid size={12} display="flex" justifyContent="center">
            {/* <ImageUploadField */}
            {/*   disabled */}
            {/*   width={320} */}
            {/*   height={180} */}
            {/*   name="requestInfo.shipImage" */}
            {/*   sx={{ */}
            {/*     borderRadius: 3, */}
            {/*     boxShadow: "0 8px 24px rgba(0,0,0,0.12)", */}
            {/*   }} */}
            {/* /> */}
          </Grid>

          <Grid size={2}>
            <InfoTextField
              label="IMO"
              disabled
              fullWidth
              name="shipInfo.IMONumber"
              value={requestInfo.shipInfo?.IMONumber}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={4}>
            <InfoTextField
              label="Tên tàu"
              disabled
              fullWidth
              name="shipInfo.name"
              value={requestInfo.shipInfo?.name}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={2}>
            <NationalityTextField
              label="Quốc tịch"
              disabled
              fullWidth
              name="shipInfo.countryISO"
              value={requestInfo.shipInfo?.countryISO}
              sx={disabledFieldSx}
            />
          </Grid>

          <Grid size={4}>
            <InfoTextField
              label="Loại tàu"
              disabled
              fullWidth
              name="shipInfo.type"
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

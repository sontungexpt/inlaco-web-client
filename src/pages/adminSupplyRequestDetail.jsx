import React, { useState, useEffect } from "react";
import {
  PageTitle,
  SectionDivider,
  InfoTextField,
  HorizontalImageInput,
  ReqEditableDataGrid,
  StatusLabel,
} from "../components/global";
import { NationalityTextField } from "../components/mobilization";
import { FileUploadField } from "../components/contract";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { COLOR } from "../assets/Color";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router";
import HttpStatusCode from "../constants/HttpStatusCode";
import {
  getSupplyReqByID_API,
  reviewSupplyReqAPI,
} from "../services/supplyReqServices";
import { isoStringToMUIDateTime } from "../utils/converter";

const AdminSupplyRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [requestInfos, setRequestInfos] = useState({});

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

  const status = statusMap[requestInfos?.status] || "Lỗi";
  // const status = "Từ chối";

  const initialValues = {
    requestListFileLink: "",
    compInfo: {
      compName: requestInfos?.companyName,
      compAddress: requestInfos?.companyAddress,
      compPhoneNumber: requestInfos?.companyPhone,
      compEmail: requestInfos?.companyEmail,
      representative: requestInfos?.representativeName,
      representativePos: requestInfos?.representativeTitle,
    },

    requestInfo: {
      timeOfDeparture: requestInfos?.estimatedDepartureTime
        ? isoStringToMUIDateTime(requestInfos?.estimatedDepartureTime)
        : "",
      departureLocation: requestInfos?.departurePoint,
      UN_LOCODE_DepartureLocation: requestInfos?.departureUNLOCODE,

      estimatedTimeOfArrival: requestInfos?.estimatedArrivalTime
        ? isoStringToMUIDateTime(requestInfos?.estimatedArrivalTime)
        : "",
      arrivalLocation: requestInfos?.arrivalPoint,
      UN_LOCODE_ArrivalLocation: requestInfos?.arrivalUNLOCODE,

      shipImage: "",
      shipIMO: requestInfos?.shipInfo?.imonumber,
      shipName: requestInfos?.shipInfo?.name,
      shipNationality: requestInfos.shipInfo?.nationality
        ? requestInfos?.shipInfo?.countryISO
        : "",
      shipType: requestInfos?.shipInfo?.shipType,
    },
  };

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleApproveClick = async () => {
    setButtonLoading(true);
    try {
      const response = await reviewSupplyReqAPI(id, true);
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay for 200ms

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
      await new Promise((resolve) => setTimeout(resolve, 200)); //Delay for 200ms

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

  return (
    <div>
      <Formik
        validateOnChange={false}
        initialValues={initialValues}
        // validationSchema={mobilizationSchema}
        // onSubmit={handleSaveMobilizationSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <Box m="20px" component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <PageTitle
                    title="CHI TIẾT YÊU CẦU CUNG ỨNG"
                    subtitle={`Yêu cầu cung ứng của công ty: ${id}`} //Change this to the companyName of them company that made the request
                  />
                  {status === "Chấp thuận" ? (
                    <StatusLabel
                      label="Chấp thuận"
                      color={COLOR.PrimaryGreen}
                    />
                  ) : status === "Từ chối" ? (
                    <StatusLabel label="Từ chối" color={COLOR.PrimaryOrgange} />
                  ) : status === "Đang chờ xác nhận" ? (
                    <StatusLabel
                      label="Đang chờ xác nhận"
                      color={COLOR.primary_black_placeholder}
                    />
                  ) : (
                    <StatusLabel
                      label="Đã ký hợp đồng"
                      color={COLOR.SecondaryGold}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      status === "Đang chờ xác nhận" || "Chấp thuận"
                        ? "space-between"
                        : "end",
                    alignItems: "center",
                  }}
                >
                  {status === "Đang chờ xác nhận" ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        marginRight: 2,
                        width: "50%",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleApproveClick()}
                        disabled={buttonLoading}
                        sx={{
                          width: "30%",
                          padding: 1,
                          color: COLOR.PrimaryWhite,
                          backgroundColor: COLOR.PrimaryBlue,
                          minWidth: 130,
                          marginRight: 2,
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      >
                        {buttonLoading ? (
                          <CircularProgress
                            size={24}
                            color={COLOR.PrimaryBlack}
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <CheckCircleRoundedIcon
                              sx={{ marginRight: "5px", marginBottom: "1px" }}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              Chấp thuận
                            </Typography>
                          </Box>
                        )}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDeclineClick()}
                        disabled={buttonLoading}
                        sx={{
                          width: "30%",
                          padding: 1,
                          color: COLOR.PrimaryWhite,
                          backgroundColor: COLOR.PrimaryOrgange,
                          minWidth: 130,
                          marginTop: 2,
                          marginBottom: 2,
                        }}
                      >
                        {buttonLoading ? (
                          <CircularProgress
                            size={24}
                            color={COLOR.PrimaryBlack}
                          />
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "end" }}>
                            <CancelRoundedIcon
                              sx={{ marginRight: "5px", marginBottom: "1px" }}
                            />
                            <Typography sx={{ fontWeight: 700 }}>
                              Từ chối
                            </Typography>
                          </Box>
                        )}
                      </Button>
                    </Box>
                  ) : status === "Chấp thuận" ? (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          width: "16%",
                          padding: 1,
                          color: COLOR.PrimaryBlack,
                          backgroundColor: COLOR.PrimaryGold,
                          minWidth: 130,
                        }}
                        onClick={() => handleCreateSupplyContractClick()}
                      >
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          <NoteAddRoundedIcon
                            sx={{ marginRight: "5px", marginBottom: "1px" }}
                          />
                          <Typography sx={{ fontWeight: 700 }}>
                            Tạo hợp đồng
                          </Typography>
                        </Box>
                      </Button>
                      <FileUploadField
                        label="Danh sách số lượng cần cung ứng"
                        disabled={true}
                        name="requestListFileLink"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
            </Box>
            <SectionDivider sectionName="Thông tin công ty: " />
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="company-name"
                  label="Tên công ty"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.compName"
                  value={values.compInfo?.compName}
                  error={
                    !!touched.compInfo?.compName && !!errors.compInfo?.compName
                  }
                  helperText={
                    touched.compInfo?.compName && errors.compInfo?.compName
                      ? errors.compInfo?.compName
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="company-address"
                  label="Địa chỉ"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.compAddress"
                  value={values.compInfo?.compAddress}
                  error={
                    !!touched.compInfo?.compAddress &&
                    !!errors.compInfo?.compAddress
                  }
                  helperText={
                    touched.compInfo?.compAddress &&
                    errors.compInfo?.compAddress
                      ? errors.compInfo?.compAddress
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="company-phone-number"
                  label="Số điện thoại"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.compPhoneNumber"
                  value={values.compInfo?.compPhoneNumber}
                  error={
                    !!touched.compInfo?.compPhoneNumber &&
                    !!errors.compInfo?.compPhoneNumber
                  }
                  helperText={
                    touched.compInfo?.compPhoneNumber &&
                    errors.compInfo?.compPhoneNumber
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="email"
                  label="Email"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.compEmail"
                  value={values.compInfo?.compEmail}
                  error={
                    !!touched.compInfo?.compEmail &&
                    !!errors.compInfo?.compEmail
                  }
                  helperText={
                    touched.compInfo?.compEmail && errors.compInfo?.compEmail
                      ? errors.compInfo?.compEmail
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={5}>
                <InfoTextField
                  id="representative"
                  label="Người đại diện"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.representative"
                  value={values.compInfo?.representative}
                  error={
                    !!touched.compInfo?.representative &&
                    !!errors.compInfo?.representative
                  }
                  helperText={
                    touched.compInfo?.representative &&
                    errors.compInfo?.representative
                      ? errors.compInfo?.representative
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={3}>
                <InfoTextField
                  id="representative-position"
                  label="Chức vụ"
                  size="small"
                  margin="none"
                  disabled={true}
                  required
                  fullWidth
                  name="compInfo.representativePos"
                  value={values.compInfo?.representativePos}
                  error={
                    !!touched.compInfo?.representativePos &&
                    !!errors.compInfo?.representativePos
                  }
                  helperText={
                    touched.compInfo?.representativePos &&
                    errors.compInfo?.representativePos
                      ? errors.compInfo?.representativePos
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <SectionDivider sectionName="Thông tin Tàu và Lịch trình*: " />
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              Lịch trình dự kiến:
            </Typography>
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid size={4}>
                <InfoTextField
                  id="time-of-departure"
                  type="datetime-local"
                  required
                  label="Thời gian khởi hành dự kiến"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.timeOfDeparture"
                  value={values.requestInfo?.timeOfDeparture}
                  error={
                    !!touched.requestInfo?.timeOfDeparture &&
                    !!errors.requestInfo?.timeOfDeparture
                  }
                  helperText={
                    touched.requestInfo?.timeOfDeparture &&
                    errors.requestInfo?.timeOfDeparture
                      ? errors.requestInfo?.timeOfDeparture
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="arrival-location"
                  label="UN/LOCODE điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.UN_LOCODE_DepartureLocation"
                  value={values.requestInfo?.UN_LOCODE_DepartureLocation}
                  error={
                    !!touched.requestInfo?.UN_LOCODE_DepartureLocation &&
                    !!errors.requestInfo?.UN_LOCODE_DepartureLocation
                  }
                  helperText={
                    touched.requestInfo?.UN_LOCODE_DepartureLocation &&
                    errors.requestInfo?.UN_LOCODE_DepartureLocation
                      ? errors.requestInfo?.UN_LOCODE_DepartureLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="departure-location"
                  label="Tên điểm khởi hành"
                  required
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.departureLocation"
                  value={values.requestInfo?.departureLocation}
                  error={
                    !!touched.requestInfo?.departureLocation &&
                    !!errors.requestInfo?.departureLocation
                  }
                  helperText={
                    touched.requestInfo?.departureLocation &&
                    errors.requestInfo?.departureLocation
                      ? errors.requestInfo?.departureLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="estimated-time-of-arrival"
                  type="datetime-local"
                  required
                  label="Thời gian đến nơi dự kiến"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.estimatedTimeOfArrival"
                  value={values.requestInfo?.estimatedTimeOfArrival}
                  error={
                    !!touched.requestInfo?.estimatedTimeOfArrival &&
                    !!errors.requestInfo?.estimatedTimeOfArrival
                  }
                  helperText={
                    touched.requestInfo?.estimatedTimeOfArrival &&
                    errors.requestInfo?.estimatedTimeOfArrival
                      ? errors.requestInfo?.estimatedTimeOfArrival
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="arrival-location"
                  label="UN/LOCODE điểm đến"
                  required
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.UN_LOCODE_ArrivalLocation"
                  value={values.requestInfo?.UN_LOCODE_ArrivalLocation}
                  error={
                    !!touched.requestInfo?.UN_LOCODE_ArrivalLocation &&
                    !!errors.requestInfo?.UN_LOCODE_ArrivalLocation
                  }
                  helperText={
                    touched.requestInfo?.UN_LOCODE_ArrivalLocation &&
                    errors.requestInfo?.UN_LOCODE_ArrivalLocation
                      ? errors.requestInfo?.UN_LOCODE_ArrivalLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <InfoTextField
                  id="arrival-location"
                  label="Tên điểm đến"
                  required
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.arrivalLocation"
                  value={values.requestInfo?.arrivalLocation}
                  error={
                    !!touched.requestInfo?.arrivalLocation &&
                    !!errors.requestInfo?.arrivalLocation
                  }
                  helperText={
                    touched.requestInfo?.arrivalLocation &&
                    errors.requestInfo?.arrivalLocation
                      ? errors.requestInfo?.arrivalLocation
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Typography
              sx={{
                ml: 2,
                fontSize: 18,
                textDecoration: "underline",
                fontStyle: "italic",
                color: COLOR.primary_black_placeholder,
              }}
            >
              Thông tin Tàu:
            </Typography>
            <Grid container spacing={2} mx={2} rowSpacing={1} pt={2}>
              <Grid
                size={12}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <HorizontalImageInput
                  id="social-ins-image"
                  disabled={true}
                  width={300}
                  height={180}
                  name="requestInfo.shipImage"
                  sx={{ marginBottom: 2 }}
                  onClick={() =>
                    document.getElementById("social-ins-image").click()
                  }
                />
              </Grid>
              <Grid size={2}>
                <InfoTextField
                  id="ship-imo"
                  label="IMO"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.shipIMO"
                  value={values.requestInfo?.shipIMO}
                  error={
                    !!touched.requestInfo?.shipIMO &&
                    !!errors.requestInfo?.shipIMO
                  }
                  helperText={
                    touched.requestInfo?.shipIMO && errors.requestInfo?.shipIMO
                      ? errors.requestInfo?.shipIMO
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="ship-name"
                  label="Tên tàu"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.shipName"
                  value={values.requestInfo?.shipName}
                  error={
                    !!touched.requestInfo?.shipName &&
                    !!errors.requestInfo?.shipName
                  }
                  helperText={
                    touched.requestInfo?.shipName &&
                    errors.requestInfo?.shipName
                      ? errors.requestInfo?.shipName
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={2}>
                <NationalityTextField
                  id="ship-nationality"
                  label="Quốc tịch"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.shipNationality"
                  value={values.requestInfo?.shipNationality}
                  error={
                    !!touched.requestInfo?.shipNationality &&
                    !!errors.requestInfo?.shipNationality
                  }
                  helperText={
                    touched.requestInfo?.shipNationality &&
                    errors.requestInfo?.shipNationality
                      ? errors.requestInfo?.shipNationality
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
              <Grid size={4}>
                <InfoTextField
                  id="ship-type"
                  label="Loại tàu"
                  size="small"
                  margin="none"
                  disabled={true}
                  fullWidth
                  name="requestInfo.shipType"
                  value={values.requestInfo?.shipType}
                  error={
                    !!touched.requestInfo?.shipType &&
                    !!errors.requestInfo?.shipType
                  }
                  helperText={
                    touched.requestInfo?.shipType &&
                    errors.requestInfo?.shipType
                      ? errors.requestInfo?.shipType
                      : " "
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      color: COLOR.PrimaryBlack,
                    },
                    "& .MuiOutlinedInput-notchedOutline.Mui-disabled": {
                      borderColor: COLOR.PrimaryBlack,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Formik>
    </div>
  );
};

export default AdminSupplyRequestDetail;
